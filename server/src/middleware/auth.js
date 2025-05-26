import jwt from 'jsonwebtoken';

// Middleware to verify JWT and attach user to req
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Debug log
    // console.log('verifyToken:', req.user);
    next();
  } catch (error) {
    console.log('verifyToken error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware to check user role
export const checkRole = (roles) => {
  return (req, res, next) => {
    // Debug log
    // console.log('checkRole:', req.user, 'allowed:', roles);
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};