import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyToken, checkRole } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import charactersRoutes from './routes/characters.js';
import usersRoutes from './routes/users.js';
import { setupSocketAuth } from './socket/auth.js';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const prisma = new PrismaClient();
app.locals.prisma = prisma; // <-- Make Prisma available to routes

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/characters', verifyToken, charactersRoutes);
app.use('/api/users', verifyToken, checkRole(['GM']), usersRoutes); // Adjust role as needed

app.get('/', (req, res) => {
  res.json({ message: 'RPG Character Sheet API' });
});

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.locals.io = io;  // <-- Add this line to expose io to routes

setupSocketAuth(io, prisma);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId} with role: ${socket.userRole}`);

  // Additional socket event handlers here

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
