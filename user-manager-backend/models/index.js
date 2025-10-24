// models/index.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');

// --- Define Associations ---

// One-to-Many: Role has many Users
Role.hasMany(User, {
  foreignKey: {
    name: 'roleId',
    allowNull: false,
    defaultValue: 2, // Default to a 'user' role (we'll create this)
  },
});

// User belongs to one Role
User.belongsTo(Role, {
  foreignKey: 'roleId',
});

// --- Export Models and Connection ---
const db = {
  sequelize,
  Sequelize,
  User,
  Role,
};

module.exports = db;