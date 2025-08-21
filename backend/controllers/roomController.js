const Room = require('../models/Room');

module.exports = {
  async list(req, res) {
    const rooms = await Room.findAll();
    res.json(rooms);
  },
  async get(req, res) {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: 'No existe la habitación' });
    res.json(room);
  },
  async create(req, res) {
    try {
      // Validar número único
      const exists = await Room.findOne({ where: { number: req.body.number } });
      if (exists) {
        return res.status(400).json({ error: 'Ya existe una habitación con ese número.' });
      }
      const room = await Room.create(req.body);
      res.status(201).json(room);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
  async update(req, res) {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: 'No existe la habitación' });
    try {
      // Validar número único (excepto la misma habitación)
      if (req.body.number && req.body.number !== room.number) {
        const exists = await Room.findOne({ where: { number: req.body.number } });
        if (exists) {
          return res.status(400).json({ error: 'Ya existe una habitación con ese número.' });
        }
      }
      await room.update(req.body);
      res.json(room);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
  async delete(req, res) {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: 'No existe la habitación' });
    // Verificar si hay reservas asociadas
    const Reservation = require('../models/Reservation');
    const reservas = await Reservation.count({ where: { roomId: room.id } });
    if (reservas > 0) {
      return res.status(400).json({ error: 'No se puede eliminar la habitación porque tiene reservas.' });
    }
    await room.destroy();
    res.json({ success: true });
  }
};
