import { useEffect, useState } from 'react';
import * as hotelService from '../services/hotelService';
import './RoomsView.css';
import ModalForm from '../components/ModalForm';
import TableCrud from '../components/TableCrud';


export function RoomsView() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm] = useState({ number: '', type: '', capacity: '', status: '' });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    setLoading(true); setError(null);
    try {
      const data = await hotelService.getRooms();
      setRooms(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }


  function openModal(room = null) {
    setEditRoom(room);
    setForm(room ? {
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      status: room.status
    } : { number: '', type: '', capacity: '', status: '' });
    setFormError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditRoom(null);
    setForm({ number: '', type: '', capacity: '', status: '' });
    setFormError(null);
  }

  function handleFieldChange(name, value) {
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    try {
      if (editRoom) {
        await hotelService.updateRoom(editRoom.id, form);
      } else {
        await hotelService.createRoom(form);
      }
      closeModal();
      fetchRooms();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(room) {
    await hotelService.deleteRoom(room.id);
    fetchRooms();
  }

  return (
    <div className="container">
      <div className="rooms-header mb-4">
        <h2 className="mb-0">Gestión de Habitaciones</h2>
        <button className="btn btn-primary shadow rooms-new-btn" onClick={() => openModal()}>
          <i className="bi bi-plus-circle me-2"></i> Nueva Habitación
        </button>
  </div>
  <div className="rooms-divider" />
      {loading && <p>Cargando...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
  <TableCrud
        columns={[
          { key: 'number', label: 'Número' },
          { key: 'type', label: 'Tipo' },
          { key: 'capacity', label: 'Capacidad' },
          { key: 'status', label: 'Estado' },
        ]}
        data={rooms}
        onEdit={room => openModal(room)}
  onDelete={room => handleDelete(room)}
        loading={loading}
        emptyText="No hay habitaciones registradas."
      />

      <ModalForm
        show={modalOpen}
        title={editRoom ? 'Editar Habitación' : 'Nueva Habitación'}
        icon={<i className="bi bi-door-closed me-2" />}
        fields={[
          { name: 'number', label: 'Número Habitación', type: 'text', value: form.number, required: true, autoFocus: true },
          { name: 'type', label: 'Tipo', type: 'select', value: form.type, required: true, options: [
            { value: '', label: 'Seleccione tipo' },
            { value: 'individual', label: 'Individual' },
            { value: 'doble', label: 'Doble' },
            { value: 'suite', label: 'Suite' },
            { value: 'familiar', label: 'Familiar' },
          ] },
          { name: 'capacity', label: 'Capacidad', type: 'number', value: form.capacity, required: true },
          { name: 'status', label: 'Estado', type: 'select', value: form.status, required: true, options: [
            { value: 'disponible', label: 'Disponible' },
            { value: 'ocupada', label: 'Ocupada' },
            { value: 'mantenimiento', label: 'Mantenimiento' },
          ] },
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
