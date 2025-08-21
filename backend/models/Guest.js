const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Guest = sequelize.define('Guest', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, validate: { len: [2, 100] } },
  document: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING, allowNull: false, validate: { len: [7, 20] } },
}, {
  tableName: 'guests',
  timestamps: false
});

module.exports = Guest;
