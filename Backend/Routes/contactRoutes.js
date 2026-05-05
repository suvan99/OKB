import express from 'express';
import {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} from '../Controller/ContactController.js';
import { auth } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Public route - anyone can submit contact
router.post('/submit', submitContact);

// Protected routes - only authenticated users can view/manage contacts
router.get('/all', auth, getAllContacts);
router.get('/:id', auth, getContactById);
router.patch('/:id/status', auth, updateContactStatus);
router.delete('/:id', auth, deleteContact);

export default router;
