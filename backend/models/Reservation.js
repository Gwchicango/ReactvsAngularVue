const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Room = require('./Room');
const Guest = require('./Guest');

const Reservation = sequelize.define('Reservation', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Room, key: 'id' },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  },
  guestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Guest, key: 'id' },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  },
  checkIn: { type: DataTypes.DATEONLY, allowNull: false },
  checkOut: { type: DataTypes.DATEONLY, allowNull: false, validate: { isAfterCheckIn(value) { if (value <= this.checkIn) throw new Error('La fecha de salida debe ser posterior a la de entrada.'); } } },
  personas: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pendiente' }, // pendiente, confirmada, cancelada, finalizada
  total: { type: DataTypes.DECIMAL(10,2), allowNull: false, validate: { min: 0 } },
}, {
  tableName: 'reservations',
  timestamps: false
});

Room.hasMany(Reservation, { foreignKey: 'roomId' });
Reservation.belongsTo(Room, { foreignKey: 'roomId' });
Guest.hasMany(Reservation, { foreignKey: 'guestId' });
Reservation.belongsTo(Guest, { foreignKey: 'guestId' });

module.exports = Reservation;
