// middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const db = require('../models');
require('dotenv').config();

const User = db.User;
const Role = db.Role;

// 1. Verify Token
verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id; // Save the user ID from token to request
    next();
  });
};

// 2. Check if user is Admin
isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: {
        model: Role,
        attributes: ['name'],
      },
    });

    if (user.Role.name === 'admin') {
      next();
      return;
    }

    res.status(403).send({ message: 'Require Admin Role!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
};

module.exports = authJwt;