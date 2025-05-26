import express from 'express';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get all players (GM only)
router.get(
  '/players',
  verifyToken,           // <-- Add this!
  checkRole(['GM']),     // <-- Then this
  async (req, res) => {
    const prisma = req.app.locals.prisma;
    try {
      const players = await prisma.user.findMany({
        where: { role: 'PLAYER' },
        select: {
          id: true,
          name: true,
          email: true
        }
      });
      res.json(players);
    } catch (error) {
      console.error('Error fetching players:', error);
      res.status(500).json({ message: 'Server error fetching players' });
    }
  }
);

export default router;