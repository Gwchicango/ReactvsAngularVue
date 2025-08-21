import * as hotelService from '../services/hotelService';

// --- ROOMS ---
export async function fetchRooms() {
  return await hotelService.getRooms();
}
export async function fetchRoom(id) {
  return await hotelService.getRoom(id);
}
export async function createRoom(data) {
  return await hotelService.createRoom(data);
}
export async function updateRoom(id, data) {
  return await hotelService.updateRoom(id, data);
}
export async function deleteRoom(id) {
  return await hotelService.deleteRoom(id);
}

// --- GUESTS ---
export async function fetchGuests() {
  return await hotelService.getGuests();
}
export async function fetchGuest(id) {
  return await hotelService.getGuest(id);
}
export async function createGuest(data) {
  return await hotelService.createGuest(data);
}
export async function updateGuest(id, data) {
  return await hotelService.updateGuest(id, data);
}
export async function deleteGuest(id) {
  return await hotelService.deleteGuest(id);
}

// --- RESERVATIONS ---
export async function fetchReservations() {
  return await hotelService.getReservations();
}
export async function fetchReservation(id) {
  return await hotelService.getReservation(id);
}
export async function createReservation(data) {
  return await hotelService.createReservation(data);
}
export async function updateReservation(id, data) {
  return await hotelService.updateReservation(id, data);
}
export async function deleteReservation(id) {
  return await hotelService.deleteReservation(id);
}
