const { sequelize } = require('./config/db');
const app = require('./app');
const http = require('http');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 5000;

// Create an HTTP server with the Express app
const server = http.createServer(app);

// Initialize Socket.IO for WebSocket connections
const io = socketIO(server, {
  cors: {
    origin: '*',  // Adjust based on your security policies
    methods: ['GET', 'POST']
  }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export the io instance so it can be used in other files
module.exports = io;

// Authenticate and sync database, then start server
sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    return sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });  // Only alter in development
  })
  .then(() => {
    console.log('Database synced');
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Database connection failed:', err));
