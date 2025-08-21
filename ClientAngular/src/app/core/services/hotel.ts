import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const backendBase = environment.BACKEND_URL + '/hotel';

@Injectable({ providedIn: 'root' })
export class HotelService {
  // --- ROOMS ---
  async getRooms() {
  const res = await fetch(`${backendBase}/rooms`);
    if (!res.ok) throw new Error('Error al cargar habitaciones');
    return await res.json();
  }
  async getRoom(id: string | number) {
  const res = await fetch(`${backendBase}/rooms/${id}`);
    if (!res.ok) throw new Error('No se encontró la habitación');
    return await res.json();
  }
  async createRoom(data: any) {
  const res = await fetch(`${backendBase}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Error creando habitación');
    return await res.json();
  }
  async updateRoom(id: string | number, data: any) {
  const res = await fetch(`${backendBase}/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Error actualizando habitación');
    return await res.json();
  }
  async deleteRoom(id: string | number) {
  const res = await fetch(`${backendBase}/rooms/${id}`, { method: 'DELETE' });
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
  async getGuests() {
  const res = await fetch(`${backendBase}/guests`);
    if (!res.ok) throw new Error('Error al cargar huéspedes');
    return await res.json();
  }
  async getGuest(id: string | number) {
  const res = await fetch(`${backendBase}/guests/${id}`);
    if (!res.ok) throw new Error('No se encontró el huésped');
    return await res.json();
  }
  async createGuest(data: any) {
  const res = await fetch(`${backendBase}/guests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Error creando huésped');
    return await res.json();
  }
  async updateGuest(id: string | number, data: any) {
  const res = await fetch(`${backendBase}/guests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Error actualizando huésped');
    return await res.json();
  }
  async deleteGuest(id: string | number) {
  const res = await fetch(`${backendBase}/guests/${id}`, { method: 'DELETE' });
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
  async getReservations() {
  const res = await fetch(`${backendBase}/reservations`);
    if (!res.ok) throw new Error('Error al cargar reservas');
    return await res.json();
  }
  async getReservation(id: string | number) {
  const res = await fetch(`${backendBase}/reservations/${id}`);
    if (!res.ok) throw new Error('No se encontró la reserva');
    return await res.json();
  }
  async createReservation(data: any) {
  const res = await fetch(`${backendBase}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Error creando reserva');
    return await res.json();
  }
  async updateReservation(id: string | number, data: any) {
  const res = await fetch(`${backendBase}/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Error actualizando reserva');
    return await res.json();
  }
  async deleteReservation(id: string | number) {
  const res = await fetch(`${backendBase}/reservations/${id}`, { method: 'DELETE' });
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
}
