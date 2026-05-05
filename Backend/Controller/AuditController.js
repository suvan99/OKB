import Audit from '../Module/Audit.js';

// Get all audit logs for user
export const getAuditLogs = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 50, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const logs = await Audit.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('userId', 'firstName lastName email');

    const total = await Audit.countDocuments({ userId });

    res.status(200).json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get audit logs by type
export const getAuditLogsByType = async (req, res) => {
  try {
    const userId = req.userId;
    const { type } = req.params;

    const logs = await Audit.find({ userId, type })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName email');

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get audit logs by action
export const getAuditLogsByAction = async (req, res) => {
  try {
    const userId = req.userId;
    const { action } = req.params;

    const logs = await Audit.find({ userId, action })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName email');

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear audit logs
export const clearAuditLogs = async (req, res) => {
  try {
    const userId = req.userId;

    await Audit.deleteMany({ userId });

    res.status(200).json({ message: 'Audit logs cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create audit log (helper)
export const createAuditLog = async (userId, action, type, resourceId, resourceTitle, details) => {
  try {
    await Audit.create({
      userId,
      action,
      type,
      resourceId,
      resourceTitle,
      details,
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};
