import jwt from 'jsonwebtoken';

export const setupSocketAuth = (io, prisma) => {
  // Middleware for socket authentication
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verify user exists in database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      // Attach user info to socket
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      
      next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });
};