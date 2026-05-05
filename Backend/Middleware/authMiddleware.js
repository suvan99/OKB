import jwt from 'jsonwebtoken';
import User from '../Module/LogIn.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'secret_key');
    req.userId = decoded.userId;

    // Get user role
    const user = await User.findById(req.userId).select('role');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.userRole = user.role || 'user'; // Default to 'user' if role is not set

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
