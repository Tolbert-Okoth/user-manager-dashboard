// models/Role.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: 'user', // Default role is 'user'
  },
});

module.exports = Role;