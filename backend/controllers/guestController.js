const Guest = require('../models/Guest');

module.exports = {
  async list(req, res) {
    const guests = await Guest.findAll();
    res.json(guests);
  },
  async get(req, res) {
    const guest = await Guest.findByPk(req.params.id);
    if (!guest) return res.status(404).json({ error: 'No existe el huésped' });
    res.json(guest);
  },
  async create(req, res) {
    try {
      const { name, document, email } = req.body;
      // Validar que no se repita nombre
      const existsName = await Guest.findOne({ where: { name } });
      if (existsName) {
        return res.status(400).json({ error: 'Ya existe un huésped con ese nombre.' });
      }
      // Validar que no se repita documento
      const existsDoc = await Guest.findOne({ where: { document } });
      if (existsDoc) {
        return res.status(400).json({ error: 'Ya existe un huésped con ese documento.' });
      }
      // Validar que no se repita email
      const existsEmail = await Guest.findOne({ where: { email } });
      if (existsEmail) {
        return res.status(400).json({ error: 'Ya existe un huésped con ese email.' });
      }
      const guest = await Guest.create(req.body);
      res.status(201).json(guest);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
  async update(req, res) {
    const guest = await Guest.findByPk(req.params.id);
    if (!guest) return res.status(404).json({ error: 'No existe el huésped' });
    try {
      await guest.update(req.body);
      res.json(guest);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
  async delete(req, res) {
    const guest = await Guest.findByPk(req.params.id);
    if (!guest) return res.status(404).json({ error: 'No existe el huésped' });
    // Validar si tiene reservas asociadas
    const Reservation = require('../models/Reservation');
    const reservas = await Reservation.count({ where: { guestId: guest.id } });
    if (reservas > 0) {
      return res.status(400).json({ error: 'No se puede eliminar el huésped porque tiene reservas.' });
    }
    await guest.destroy();
    res.json({ success: true });
  }
};
