const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const Guest = require('../models/Guest');

module.exports = {
  async list(req, res) {
    const reservations = await Reservation.findAll({ include: [Room, Guest] });
    res.json(reservations);
  },
  async get(req, res) {
    const reservation = await Reservation.findByPk(req.params.id, { include: [Room, Guest] });
    if (!reservation) return res.status(404).json({ error: 'No existe la reserva' });
    res.json(reservation);
  },
  async create(req, res) {
    try {
  const { roomId, guestId, checkIn, checkOut, personas } = req.body;
      // Validar existencia de room y guest
      const room = await Room.findByPk(roomId);
      if (!room) return res.status(400).json({ error: 'La habitación no existe' });
      const guest = await Guest.findByPk(guestId);
      if (!guest) return res.status(400).json({ error: 'El huésped no existe' });
  // Validar fechas
  if (!checkIn || !checkOut) return res.status(400).json({ error: 'Debe indicar fecha de entrada y salida' });
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (isNaN(inDate) || isNaN(outDate)) return res.status(400).json({ error: 'Fechas inválidas' });
  if (inDate >= outDate) return res.status(400).json({ error: 'La fecha de salida debe ser posterior a la de entrada' });
  // Validar personas y capacidad
  if (!personas || isNaN(personas) || personas < 1) return res.status(400).json({ error: 'Debe indicar el número de personas (mínimo 1)' });
  if (personas > room.capacity) return res.status(400).json({ error: `La habitación admite máximo ${room.capacity} personas` });
      // Validar solapamiento de reservas
      const overlap = await Reservation.findOne({
        where: {
          roomId,
          [require('sequelize').Op.or]: [
            {
              checkIn: { [require('sequelize').Op.lt]: checkOut },
              checkOut: { [require('sequelize').Op.gt]: checkIn }
            }
          ]
        }
      });
      if (overlap) return res.status(400).json({ error: 'La habitación ya está reservada en ese rango de fechas' });
      const reservation = await Reservation.create(req.body);
      res.status(201).json(reservation);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
  async update(req, res) {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'No existe la reserva' });
    try {
  const { roomId, guestId, checkIn, checkOut, personas } = req.body;
      // Validar existencia de room y guest
      const room = await Room.findByPk(roomId);
      if (!room) return res.status(400).json({ error: 'La habitación no existe' });
      const guest = await Guest.findByPk(guestId);
      if (!guest) return res.status(400).json({ error: 'El huésped no existe' });
  // Validar fechas
  if (!checkIn || !checkOut) return res.status(400).json({ error: 'Debe indicar fecha de entrada y salida' });
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (isNaN(inDate) || isNaN(outDate)) return res.status(400).json({ error: 'Fechas inválidas' });
  if (inDate >= outDate) return res.status(400).json({ error: 'La fecha de salida debe ser posterior a la de entrada' });
  // Validar personas y capacidad
  if (!personas || isNaN(personas) || personas < 1) return res.status(400).json({ error: 'Debe indicar el número de personas (mínimo 1)' });
  if (personas > room.capacity) return res.status(400).json({ error: `La habitación admite máximo ${room.capacity} personas` });
      // Validar solapamiento de reservas (excluyendo la actual)
      const overlap = await Reservation.findOne({
        where: {
          roomId,
          id: { [require('sequelize').Op.ne]: reservation.id },
          [require('sequelize').Op.or]: [
            {
              checkIn: { [require('sequelize').Op.lt]: checkOut },
              checkOut: { [require('sequelize').Op.gt]: checkIn }
            }
          ]
        }
      });
      if (overlap) return res.status(400).json({ error: 'La habitación ya está reservada en ese rango de fechas' });
      await reservation.update(req.body);
      res.json(reservation);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
  async delete(req, res) {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'No existe la reserva' });
    if (reservation.status !== 'cancelada' && reservation.status !== 'finalizada') {
      return res.status(400).json({ error: 'Solo se puede eliminar una reserva cancelada o finalizada.' });
    }
    await reservation.destroy();
    res.json({ success: true });
  }
};
