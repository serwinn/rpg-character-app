import express from 'express';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get all characters (GM only)
router.get(
  '/',
  verifyToken,           // <-- Add this!
  checkRole(['GM']),     // <-- Then this
  async (req, res) => {
    const prisma = req.app.locals.prisma;
    try {
      const characters = await prisma.character.findMany({
        include: {
          player: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Flatten occupation and lastUpdated for frontend
      const mapped = characters.map((char) => ({
        id: char.id,
        name: char.name,
        player: char.player,
        occupation: char.data?.occupation || '',
        lastUpdated: char.updatedAt ? char.updatedAt.toISOString() : char.createdAt.toISOString(),
      }));

      res.json(mapped);
    } catch (error) {
      console.error('Error fetching all characters:', error);
      res.status(500).json({ message: 'Server error fetching characters' });
    }
  }
);

// Get player's characters
router.get('/player', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const userId = req.user.id;
  
  try {
    const characters = await prisma.character.findMany({
      where: {
        playerId: userId
      }
    });

    // Always use updatedAt from DB for lastUpdated
    const mapped = characters.map((char) => ({
      id: char.id,
      name: char.name,
      occupation: char.data?.occupation || '',
      avatar: char.data?.avatar || null,
      lastUpdated: char.updatedAt ? char.updatedAt.toISOString() : char.createdAt.toISOString(),
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Error fetching player characters:', error);
    res.status(500).json({ message: 'Server error fetching characters' });
  }
});

// Get a specific character (latest version data only, flattened)
router.get('/:id', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  // Helper to unwrap nested .data fields
  function unwrapData(obj) {
    while (obj && obj.data) {
      obj = obj.data;
    }
    return obj;
  }

  try {
    const character = await prisma.character.findUnique({
      where: { id },
      include: {
        player: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    // Check if user has permission to view this character
    if (userRole !== 'GM' && character.playerId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to view this character' });
    }

    // Get the latest version
    const latestVersion = await prisma.characterVersion.findFirst({
      where: { characterId: id },
      orderBy: { createdAt: 'desc' }
    });

    if (!latestVersion) {
      return res.status(404).json({ message: 'No version found for this character' });
    }

    // Unwrap the latest data (flatten all nested .data)
    const latestData = unwrapData(latestVersion.data);

    // Optionally, add player info if needed
    if (character.player) {
      latestData.player = character.player;
    }

    res.json(latestData);
  } catch (error) {
    console.error(`Error fetching character ${id}:`, error);
    res.status(500).json({ message: 'Server error fetching character' });
  }
});

// Helper: Validate avatar size (max 1MB)
function validateAvatarSize(avatarBase64, maxBytes = 1024 * 1024) {
  if (!avatarBase64) return true;
  // Remove data URL prefix if present
  const base64 = avatarBase64.split(',')[1] || avatarBase64;
  // Calculate size in bytes
  const size = Math.ceil((base64.length * 3) / 4);
  return size <= maxBytes;
}

// Create a new character
router.post('/', verifyToken, async (req, res) => {
  const prisma = req.app.locals.prisma;
  const io = req.app.locals.io;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const characterData = req.body;

    // Validate avatar size (max 1MB)
    if (characterData.avatar && !validateAvatarSize(characterData.avatar)) {
      return res.status(400).json({ message: 'Avatar image is too large (max 1MB)' });
    }

    // If user is a player, they can only create characters for themselves
    if (userRole === 'PLAYER') {
      characterData.playerId = userId;
    }

    // Validate playerId if provided
    let playerIdToSet = null;
    if (characterData.playerId) {
      const player = await prisma.user.findUnique({
        where: { id: characterData.playerId }
      });

      if (!player) {
        return res.status(400).json({ message: 'Invalid player ID' });
      }
      playerIdToSet = characterData.playerId;
    }

    // Create character
    const character = await prisma.character.create({
      data: {
        name: characterData.name,
        data: characterData,
        playerId: playerIdToSet // Only set if valid
      }
    });

    // Create initial version
    await prisma.characterVersion.create({
      data: {
        characterId: character.id,
        data: characterData
      }
    });

    res.status(201).json(character);
  } catch (error) {
    console.error('Error creating character:', error);
    res.status(500).json({ message: 'Server error creating character' });
  }
});

// Update a character (overwrite latest version)
router.put('/:id', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const io = req.app.locals.io;
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Check if character exists
    const existingCharacter = await prisma.character.findUnique({
      where: { id }
    });

    if (!existingCharacter) {
      return res.status(404).json({ message: 'Character not found' });
    }

    // Check if user has permission to update this character
    if (userRole !== 'GM' && existingCharacter.playerId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to update this character' });
    }

    const characterData = req.body;

    // Validate avatar size (max 1MB)
    if (characterData.avatar && !validateAvatarSize(characterData.avatar)) {
      return res.status(400).json({ message: 'Avatar image is too large (max 1MB)' });
    }

    // Players can't change the character's player
    if (userRole === 'PLAYER') {
      characterData.playerId = userId;
    }

    // Update character
    const updatedCharacter = await prisma.character.update({
      where: { id },
      data: {
        name: characterData.name,
        data: characterData,
        playerId: characterData.playerId
      }
    });

    // Overwrite the latest version instead of creating a new one
    const latestVersion = await prisma.characterVersion.findFirst({
      where: { characterId: id },
      orderBy: { createdAt: 'desc' }
    });

    if (latestVersion) {
      await prisma.characterVersion.update({
        where: { id: latestVersion.id },
        data: {
          data: characterData
        }
      });
    } else {
      // If no version exists, create one
      await prisma.characterVersion.create({
        data: {
          characterId: id,
          data: characterData
        }
      });
    }

    // Emit socket event for real-time updates
    io.emit(`character:update:${id}`, updatedCharacter);

    // Return updated character
    res.json(updatedCharacter);
  } catch (error) {
    console.error(`Error updating character ${id}:`, error);
    res.status(500).json({ message: 'Server error updating character' });
  }
});

// Delete a character
router.delete('/:id', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;
  
  try {
    // Check if character exists
    const character = await prisma.character.findUnique({
      where: { id }
    });
    
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    
    // Check if user has permission to delete this character
    if (userRole !== 'GM' && character.playerId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this character' });
    }
    
    // Delete all versions first (due to foreign key constraint)
    await prisma.characterVersion.deleteMany({
      where: { characterId: id }
    });
    
    // Delete character
    await prisma.character.delete({
      where: { id }
    });
    
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    console.error(`Error deleting character ${id}:`, error);
    res.status(500).json({ message: 'Server error deleting character' });
  }
});

// Get character versions (each object is a saved version)
router.get('/:id/versions', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Check if character exists and user has permission
    const character = await prisma.character.findUnique({
      where: { id }
    });

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    if (userRole !== 'GM' && character.playerId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to view this character' });
    }

    // Get all versions (each object is a saved version)
    const versions = await prisma.characterVersion.findMany({
      where: { characterId: id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(versions);
  } catch (error) {
    console.error(`Error fetching versions for character ${id}:`, error);
    res.status(500).json({ message: 'Server error fetching character versions' });
  }
});

// Restore a character version
router.post('/:id/versions/:versionId/restore', async (req, res) => {
  const prisma = req.app.locals.prisma;
  const io = req.app.locals.io;
  const { id, versionId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;
  
  try {
    // Check if character exists and user has permission
    const character = await prisma.character.findUnique({
      where: { id }
    });
    
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    
    if (userRole !== 'GM' && character.playerId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to modify this character' });
    }
    
    // Find the version
    const version = await prisma.characterVersion.findUnique({
      where: { id: versionId }
    });
    
    if (!version || version.characterId !== id) {
      return res.status(404).json({ message: 'Version not found' });
    }
    
    // Restore the character data from this version
    const versionData = version.data;
    
    // Update character with version data
    const updatedCharacter = await prisma.character.update({
      where: { id },
      data: {
        name: versionData.name,
        data: versionData
      }
    });
    
    // Create a new version record for this restoration
    await prisma.characterVersion.create({
      data: {
        characterId: id,
        data: versionData,
        notes: `Restored from version created at ${version.createdAt}`
      }
    });
    
    // Emit socket event for real-time updates
    io.emit(`character:update:${id}`, updatedCharacter);
    
    res.json(updatedCharacter);
  } catch (error) {
    console.error(`Error restoring version ${versionId} for character ${id}:`, error);
    res.status(500).json({ message: 'Server error restoring character version' });
  }
});

export default router;