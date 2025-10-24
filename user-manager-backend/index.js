// index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models'); 
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- Test Route ---
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the User Manager API!' });
});


// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

// --- Database Initialization and Server Start ---
const PORT = process.env.PORT || 5000;
 
// Function to initialize roles
const initializeRoles = async () => {
  try {
    const adminRole = await db.Role.findOrCreate({
      where: { id: 1, name: 'admin' },
    });
    const userRole = await db.Role.findOrCreate({
      where: { id: 2, name: 'user' },
    });
    console.log('Roles initialized:', adminRole[1], userRole[1]);
  } catch (error) {
    console.error('Error initializing roles:', error);
  }
};

// Function to connect and sync the database
const initializeDatabase = async () => {
  try {
    // Sync all models
    // {force: true} will drop tables if they exist. Use only in dev.
    // await db.sequelize.sync({ force: true }); 
    await db.sequelize.sync();
    console.log('Database synced successfully.');

    // Initialize the default roles
    await initializeRoles();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Start the application
initializeDatabase();