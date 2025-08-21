const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Room = sequelize.define('Room', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  number: { type: DataTypes.STRING, allowNull: false, unique: true },
  type: { type: DataTypes.STRING, allowNull: false }, // Ej: simple, doble, suite
  capacity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'disponible' }, // disponible, ocupada, limpieza, etc
}, {
  tableName: 'rooms',
  timestamps: false
});

module.exports = Room;
