import { useEffect, useState } from 'react';
import * as hotelService from '../services/hotelService';
import './GuestsView.css';
import ModalForm from '../components/ModalForm';
import TableCrud from '../components/TableCrud';


export function GuestsView() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const [form, setForm] = useState({ name: '', document: '', email: '', phone: '' });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  async function fetchGuests() {
    setLoading(true); setError(null);
    try {
      const data = await hotelService.getGuests();
      setGuests(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }


  function openModal(guest = null) {
    setEditGuest(guest);
    setForm(guest ? {
      name: guest.name,
      document: guest.document,
      email: guest.email,
      phone: guest.phone
    } : { name: '', document: '', email: '', phone: '' });
    setFormError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditGuest(null);
    setForm({ name: '', document: '', email: '', phone: '' });
    setFormError(null);
  }

  function handleFieldChange(name, value) {
    setForm({ ...form, [name]: value });
  }



  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    try {
      if (editGuest) {
        await hotelService.updateGuest(editGuest.id, form);
      } else {
        await hotelService.createGuest(form);
      }
      closeModal();
      fetchGuests();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(guest) {
    await hotelService.deleteGuest(guest.id);
    fetchGuests();
  }

  return (
    <div className="container">
      <div className="guests-header mb-4">
        <h2 className="mb-0">Gestión de Huéspedes</h2>
        <button className="btn btn-primary shadow guests-new-btn" onClick={() => openModal()}>
          <i className="bi bi-person-plus me-2"></i> Nuevo Huésped
        </button>
  </div>
  <div className="guests-divider" />
      {loading && <p>Cargando...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && guests.length === 0 && (
        <div className="alert alert-info">No hay huéspedes registrados.</div>
      )}
      <TableCrud
        columns={[
          { key: 'name', label: 'Nombres' },
          { key: 'document', label: 'Cédula' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Teléfono' },
        ]}
        data={guests}
        onEdit={guest => openModal(guest)}
        onDelete={guest => handleDelete(guest)}
        loading={loading}
        emptyText="No hay huéspedes registrados."
      />

      <ModalForm
        show={modalOpen}
        title={editGuest ? 'Editar Huésped' : 'Nuevo Huésped'}
        icon={<i className="bi bi-person me-2" />}
        fields={[
          { name: 'name', label: 'Nombres', type: 'text', value: form.name, required: true, autoFocus: true },
          { name: 'document', label: 'Cédula', type: 'text', value: form.document, required: true },
          { name: 'email', label: 'Email', type: 'email', value: form.email, required: true },
          { name: 'phone', label: 'Teléfono', type: 'text', value: form.phone, required: true },
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
