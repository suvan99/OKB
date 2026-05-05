import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './DB/db.js';

import routes from './Routes/index.js';
import authRoutes from './Routes/authRoutes.js';
import sopRoutes from './Routes/sopRoutes.js';
import auditRoutes from './Routes/auditRoutes.js';
import contactRoutes from './Routes/contactRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  }
});
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Connect Database
    await connectDB();

    // Socket.io connection handling
    io.on('connection', (socket) => {
      console.log('🔌 User connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('🔌 User disconnected:', socket.id);
      });
    });

    // Make io accessible to routes
    app.set('io', io);

    // Middleware
    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.use('/api', routes);
    app.use('/api/auth', authRoutes);
    app.use('/api/sops', sopRoutes);
    app.use('/api/audit', auditRoutes);
    app.use('/api/contact', contactRoutes);

    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'Server is running 🚀' });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error('❌ Error:', err.stack);
      res.status(500).json({ error: 'Something went wrong!' });
    });

    // Start server
    server.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  }
};

start();

export default app;
