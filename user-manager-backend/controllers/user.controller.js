// controllers/user.controller.js

const db = require('../models');
const { Op } = require('sequelize'); // Import Sequelize's Operator

const User = db.User;
const Role = db.Role;

// --- Helper function for Pagination ---
const getPagination = (page, size) => {
  const limit = size ? +size : 10; // Default 10 items per page
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, users, totalPages, currentPage };
};

// --- 1. (Admin) Create a new User ---
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, roleId, isActive } = req.body;

    // Find the role
    // Default to 'user' role (id: 2) if not specified or invalid
    let userRole = await Role.findByPk(roleId || 2);
    if (!userRole) {
      userRole = await Role.findByPk(2); // Fallback to 'user'
    }

    const newUser = await User.create({
      username,
      email,
      password, // Password will be hashed by the 'beforeCreate' hook
      roleId: userRole.id,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).send({ message: 'User created successfully!', user: newUser });
  } catch (error) {
    // Handle potential unique constraint errors (e.g., username/email already exists)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).send({ message: 'Error: Username or email already in use.' });
    }
    res.status(500).send({ message: error.message });
  }
};

// --- 2. (Admin) Get All Users (with Pagination, Search, Sort) ---
exports.getAllUsers = async (req, res) => {
  const {
    page = 1,
    size = 10,
    search = '',
    sort = 'id',
    order = 'ASC',
  } = req.query;

  try {
    const { limit, offset } = getPagination(page, size);

    // Search condition (case-insensitive for username or email)
    const searchCondition = {
      [Op.or]: [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ],
    };

    const data = await User.findAndCountAll({
      where: searchCondition,
      limit,
      offset,
      order: [[sort, order]],
      include: {
        model: Role,
        attributes: ['id', 'name'], // Include the role name
      },
      attributes: {
        exclude: ['password'], // Never send password back
      },
    });

    const response = getPagingData(data, page, limit);
    res.status(200).send(response);

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// --- 3. (Admin) Get a Single User by ID ---
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      include: {
        model: Role,
        attributes: ['id', 'name'],
      },
      attributes: {
        exclude: ['password'],
      },
    });

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: `User with id=${id} not found.` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// --- 4. (Admin) Update a User ---
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, email, roleId, isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send({ message: `User with id=${id} not found.` });
    }

    // Update fields
    user.username = username || user.username;
    user.email = email || user.email;
    user.isActive = (isActive !== undefined) ? isActive : user.isActive;

    // Update role if provided
    if (roleId) {
      const role = await Role.findByPk(roleId);
      if (role) {
        user.roleId = role.id;
      }
    }

    await user.save();
    res.status(200).send({ message: 'User updated successfully!' });
  } catch (error) {
     // Handle potential unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).send({ message: 'Error: Username or email already in use.' });
    }
    res.status(500).send({ message: error.message });
  }
};

// --- 5. (Admin) Delete a User ---
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedRowCount = await User.destroy({
      where: { id: id },
    });

    if (deletedRowCount === 0) {
      return res.status(404).send({ message: `User with id=${id} not found.` });
    }

    res.status(200).send({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};