// controllers/analytics.controller.js

const db = require('../models');
const { Op } = require('sequelize');

const User = db.User;
const Role = db.Role;

exports.getStats = async (req, res) => {
  try {
    // 1. Total Users
    const totalUsers = await User.count();

    // 2. Active vs. Inactive
    const activeUsers = await User.count({ where: { isActive: true } });
    const inactiveUsers = await User.count({ where: { isActive: false } });

    // 3. Users by Role
    const usersByRole = await User.findAll({
      attributes: [
        // Include the role name
        [db.Sequelize.col('Role.name'), 'roleName'],
        // Count users in each group
        [db.Sequelize.fn('COUNT', db.Sequelize.col('User.id')), 'userCount'],
      ],
      include: {
        model: Role,
        attributes: [], // Don't include any Role attributes directly
      },
      group: [db.Sequelize.col('Role.name')],
    });

    res.status(200).send({
      totalUsers,
      statusBreakdown: [
        { name: 'Active', value: activeUsers },
        { name: 'Inactive', value: inactiveUsers },
      ],
      roleBreakdown: usersByRole.map((role) => ({
        name: role.get('roleName'),
        value: parseInt(role.get('userCount'), 10),
      })),
    });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};