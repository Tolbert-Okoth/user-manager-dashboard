// controllers/auth.controller.js

const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = db.User;
const Role = db.Role;

// 1. Register a new Admin User
// NOTE: This is for initial setup. 
exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Find the 'admin' role
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      return res.status(500).send({ message: "Error: 'admin' role not found." });
    }

    // Create the user
    const user = await User.create({
      username: username,
      email: email,
      password: password, // Password will be hashed by the 'beforeCreate' hook
      roleId: adminRole.id,
    });

    res.status(201).send({ message: 'Admin user registered successfully!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// 2. Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email, and include their Role
    const user = await User.findOne({
      where: { email: email },
      include: {
        model: Role,
        attributes: ['name'],
      },
    });

    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    // Check if the user is an 'admin'
    if (user.Role.name !== 'admin') {
      return res.status(403).send({ message: 'Access denied. Not an admin.' });
    }

    // Compare submitted password with hashed password
    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid password!',
      });
    }

    // Sign a new token
    const token = jwt.sign(
      { id: user.id, role: user.Role.name },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h', // Token expires in 24 hours
      }
    );

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.Role.name,
      accessToken: token,
    });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};