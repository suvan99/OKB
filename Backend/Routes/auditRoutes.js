import express from 'express';
import {
  getAuditLogs,
  getAuditLogsByType,
  getAuditLogsByAction,
  clearAuditLogs,
} from '../Controller/AuditController.js';
import { auth } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.get('/', auth, getAuditLogs);
router.get('/type/:type', auth, getAuditLogsByType);
router.get('/action/:action', auth, getAuditLogsByAction);
router.delete('/', auth, clearAuditLogs);

export default router;
