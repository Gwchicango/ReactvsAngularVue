const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/hotel';

// --- ROOMS ---
export async function getRooms() {
  const res = await fetch(`${BASE_URL}/rooms`);
  if (!res.ok) throw new Error('Error al cargar habitaciones');
  return await res.json();
}
export async function getRoom(id) {
  const res = await fetch(`${BASE_URL}/rooms/${id}`);
  if (!res.ok) throw new Error('No se encontró la habitación');
  return await res.json();
}
export async function createRoom(data) {
  const res = await fetch(`${BASE_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error creando habitación');
  return await res.json();
}
export async function updateRoom(id, data) {
  const res = await fetch(`${BASE_URL}/rooms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error actualizando habitación');
  return await res.json();
}
export async function deleteRoom(id) {
  const res = await fetch(`${BASE_URL}/rooms/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    let msg = 'Error eliminando habitación';
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return await res.json();
}

// --- GUESTS ---
export async function getGuests() {
  const res = await fetch(`${BASE_URL}/guests`);
  if (!res.ok) throw new Error('Error al cargar huéspedes');
  return await res.json();
}
export async function getGuest(id) {
  const res = await fetch(`${BASE_URL}/guests/${id}`);
  if (!res.ok) throw new Error('No se encontró el huésped');
  return await res.json();
}
export async function createGuest(data) {
  const res = await fetch(`${BASE_URL}/guests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error creando huésped');
  return await res.json();
}
export async function updateGuest(id, data) {
  const res = await fetch(`${BASE_URL}/guests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error actualizando huésped');
  return await res.json();
}
export async function deleteGuest(id) {
  const res = await fetch(`${BASE_URL}/guests/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    let msg = 'Error eliminando huésped';
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return await res.json();
}

// --- RESERVATIONS ---
export async function getReservations() {
  const res = await fetch(`${BASE_URL}/reservations`);
  if (!res.ok) throw new Error('Error al cargar reservas');
  return await res.json();
}
export async function getReservation(id) {
  const res = await fetch(`${BASE_URL}/reservations/${id}`);
  if (!res.ok) throw new Error('No se encontró la reserva');
  return await res.json();
}
export async function createReservation(data) {
  const res = await fetch(`${BASE_URL}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error creando reserva');
  return await res.json();
}
export async function updateReservation(id, data) {
  const res = await fetch(`${BASE_URL}/reservations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error actualizando reserva');
  return await res.json();
}
export async function deleteReservation(id) {
  const res = await fetch(`${BASE_URL}/reservations/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    let msg = 'Error eliminando reserva';
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return await res.json();
}
