import express from 'express';
import { register, login, getProfile, getAllUsers, updateUser, deleteUser } from '../Controller/LogInController.js';
import { auth } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);

// Admin only routes
router.get('/users', auth, getAllUsers);
router.put('/users/:userId', auth, updateUser);
router.delete('/users/:userId', auth, deleteUser);

export default router;
