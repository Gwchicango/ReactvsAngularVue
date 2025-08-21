
import { useEffect, useState } from 'react';
import * as hotelService from '../services/hotelService';
import ModalForm from '../components/ModalForm';
import TableCrud from '../components/TableCrud';
import './ReservationsView.css';

export function ReservationsView() {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editReservation, setEditReservation] = useState(null);
  const [form, setForm] = useState({ roomId: '', guestId: '', checkIn: '', checkOut: '', personas: '', status: 'pendiente' });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true); setError(null);
    try {
      const [resv, rms, gsts] = await Promise.all([
        hotelService.getReservations(),
        hotelService.getRooms(),
        hotelService.getGuests()
      ]);
      setReservations(resv);
      setRooms(rms);
      setGuests(gsts);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function openModal(reservation = null) {
    setEditReservation(reservation);
    setForm(reservation ? {
      roomId: reservation.roomId,
      guestId: reservation.guestId,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      personas: reservation.personas || '',
      status: reservation.status
    } : { roomId: '', guestId: '', checkIn: '', checkOut: '', personas: '', status: 'pendiente' });
    setFormError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditReservation(null);
    setForm({ roomId: '', guestId: '', checkIn: '', checkOut: '', status: 'pendiente', total: '' });
    setFormError(null);
  }

  function handleFieldChange(name, value) {
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    // Validación de fechas
    const today = new Date();
    today.setHours(0,0,0,0);
    const checkInDate = new Date(form.checkIn);
    const checkOutDate = new Date(form.checkOut);
    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      setFormError('Las fechas no son válidas.');
      return;
    }
    if (checkInDate <= today) {
      setFormError('La fecha de entrada debe ser mayor a la fecha actual.');
      return;
    }
    const minCheckOut = new Date(checkInDate);
    minCheckOut.setDate(minCheckOut.getDate() + 1);
    if (checkOutDate < minCheckOut) {
      setFormError('La fecha de salida debe ser al menos un día después de la entrada.');
      return;
    }
    // Validar personas y capacidad
    const room = rooms.find(r => r.id === parseInt(form.roomId));
    if (room && form.personas) {
      if (parseInt(form.personas) > room.capacity) {
        setFormError(`La habitación seleccionada admite máximo ${room.capacity} personas.`);
        return;
      }
      if (parseInt(form.personas) < 1) {
        setFormError('Debe ingresar al menos 1 persona.');
        return;
      }
    }
    try {
      // Calcular el total antes de enviar
      const total = form.personas ? (parseInt(form.personas) * 50) : 0;
      const formToSend = { ...form, total };
      if (editReservation) {
        await hotelService.updateReservation(editReservation.id, formToSend);
      } else {
        await hotelService.createReservation(formToSend);
      }
      closeModal();
      fetchAll();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(reservation) {
    try {
      await hotelService.deleteReservation(reservation.id);
      fetchAll();
    } catch (err) {
      // Propaga el error para que TableCrud lo muestre en el modal
      throw err;
    }
  }

  return (
    <div className="container">
      <div className="reservations-header mb-4">
        <h2 className="mb-0">Gestión de Reservas</h2>
        <button className="btn btn-primary shadow reservations-new-btn" onClick={() => openModal()}>
          <i className="bi bi-calendar-plus me-2"></i> Nueva Reserva
        </button>
      </div>
      <div className="reservations-divider" />
      {loading && <p>Cargando...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      <TableCrud
        columns={[
          { key: 'Room', label: 'Habitación', render: r => r.Room?.number || (rooms.find(room => room.id === r.roomId)?.number) || '' },
          { key: 'Guest', label: 'Huésped', render: r => r.Guest?.name || (guests.find(g => g.id === r.guestId)?.name) || '' },
          { key: 'checkIn', label: 'Check-In' },
          { key: 'checkOut', label: 'Check-Out' },
          { key: 'status', label: 'Estado' },
          { key: 'total', label: 'Total' },
          { key: 'personas', label: 'Personas', render: r => r.personas },
        ]}
        data={reservations}
        onEdit={reservation => openModal(reservation)}
        onDelete={reservation => handleDelete(reservation)}
        loading={loading}
        emptyText="No hay reservas registradas."
      />

      <ModalForm
        show={modalOpen}
        title={editReservation ? 'Editar Reserva' : 'Nueva Reserva'}
        icon={<i className="bi bi-calendar me-2" />}
        fields={[
          {
            name: 'roomId', label: 'Habitación', type: 'select', value: form.roomId, required: true,
            options: rooms.map(r => ({ value: r.id, label: `${r.number} (max ${r.capacity})` }))
          },
          {
            name: 'guestId', label: 'Huésped', type: 'select', value: form.guestId, required: true,
            options: guests.map(g => ({ value: g.id, label: g.name }))
          },
          { name: 'checkIn', label: 'Check-In', type: 'date', value: form.checkIn, required: true },
          { name: 'checkOut', label: 'Check-Out', type: 'date', value: form.checkOut, required: true },
          { name: 'personas', label: 'Personas', type: 'number', value: form.personas, required: true },
          {
            name: 'status', label: 'Estado', type: 'select', value: form.status, required: true,
            options: [
              { value: 'pendiente', label: 'Pendiente' },
              { value: 'confirmada', label: 'Confirmada' },
              { value: 'cancelada', label: 'Cancelada' },
              { value: 'finalizada', label: 'Finalizada' },
            ]
          },
          { name: 'total', label: 'Total', type: 'number', value: form.personas ? (parseInt(form.personas) * 50) : '', readOnly: true },
        ]}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
        onClose={closeModal}
        error={formError}
        submitLabel="Guardar"
      />
    </div>
  );
}
