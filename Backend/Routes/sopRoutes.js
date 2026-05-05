import express from 'express';
import {
  createSop,
  getAllSops,
  getSopById,
  updateSop,
  deleteSop,
  searchSops,
} from '../Controller/SopController.js';
import { auth } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/', auth, createSop);
router.get('/', auth, getAllSops);
router.get('/search', auth, searchSops);
router.get('/:sopId', auth, getSopById);
router.put('/:sopId', auth, updateSop);
router.delete('/:sopId', auth, deleteSop);

export default router;
