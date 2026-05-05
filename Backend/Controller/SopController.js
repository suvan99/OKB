import Sop from '../Module/Sop.js';
import Audit from '../Module/Audit.js';

// Create SOP
export const createSop = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.userId;
    const userRole = req.userRole;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Check duplicate title - for regular users, check their own; for admin, check global
    let duplicateQuery = { title: { $regex: new RegExp(`^${title}$`, 'i') } };
    if (userRole !== 'admin') {
      duplicateQuery.userId = userId;
    } else {
      duplicateQuery.isGlobal = true;
    }

    const existing = await Sop.findOne(duplicateQuery);
    if (existing) {
      return res.status(400).json({ message: 'An SOP with this title already exists' });
    }

    const sop = new Sop({
      userId,
      title,
      content: content || '',
      tags: tags || [],
      isGlobal: userRole === 'admin',
      versions: [],
    });

    await sop.save();

    // Log audit
    await Audit.create({
      userId,
      action: 'create',
      type: 'sop',
      resourceId: sop._id,
      resourceTitle: title,
    });

    // Emit real-time update to all connected clients
    const io = req.app.get('io');
    io.emit('sopUpdated', { action: 'create', sop: sop });

    res.status(201).json({ message: 'SOP created', sop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all SOPs for user or all if admin
export const getAllSops = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.userRole;

    let query = {};
    if (userRole !== 'admin') {
      // Regular users see their own SOPs plus global ones
      query = {
        $or: [
          { userId: userId },
          { isGlobal: true }
        ]
      };
    }
    // Admin sees all SOPs

    const sops = await Sop.find(query).sort({ createdAt: -1 }).populate('userId', 'firstName lastName email');
    res.status(200).json(sops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single SOP
export const getSopById = async (req, res) => {
  try {
    const { sopId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    let query = { _id: sopId };
    if (userRole !== 'admin') {
      query = {
        _id: sopId,
        $or: [
          { userId: userId },
          { isGlobal: true }
        ]
      };
    }

    const sop = await Sop.findOne(query).populate('userId', 'firstName lastName email');
    if (!sop) {
      return res.status(404).json({ message: 'SOP not found' });
    }

    // Log audit - view
    await Audit.create({
      userId,
      action: 'view',
      type: 'sop',
      resourceId: sop._id,
      resourceTitle: sop.title,
    });

    res.status(200).json(sop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};;

// Update SOP
export const updateSop = async (req, res) => {
  try {
    const { sopId } = req.params;
    const { title, content, tags } = req.body;
    const userId = req.userId;
    const userRole = req.userRole;

    let query = { _id: sopId };
    if (userRole !== 'admin') {
      query = {
        _id: sopId,
        $or: [
          { userId: userId },
          { isGlobal: true }
        ]
      };
    }

    const sop = await Sop.findOne(query);
    if (!sop) {
      return res.status(404).json({ message: 'SOP not found' });
    }

    // Only allow editing own SOPs or global SOPs for regular users, but for global, check if they can edit
    if (userRole !== 'admin' && sop.isGlobal) {
      return res.status(403).json({ message: 'Cannot edit global SOPs' });
    }

    // Save version history
    if (content !== sop.content || JSON.stringify(tags) !== JSON.stringify(sop.tags)) {
      sop.versions = [
        {
          content: sop.content,
          tags: sop.tags,
          updatedAt: sop.updatedAt,
        },
        ...sop.versions,
      ];
    }

    sop.title = title || sop.title;
    sop.content = content !== undefined ? content : sop.content;
    sop.tags = tags || sop.tags;

    await sop.save();

    // Log audit
    await Audit.create({
      userId,
      action: 'update',
      type: 'sop',
      resourceId: sop._id,
      resourceTitle: sop.title,
    });

    // Emit real-time update to all connected clients
    const io = req.app.get('io');
    io.emit('sopUpdated', { action: 'update', sop: sop });

    res.status(200).json({ message: 'SOP updated', sop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};;

// Delete SOP
export const deleteSop = async (req, res) => {
  try {
    const { sopId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    let query = { _id: sopId };
    if (userRole !== 'admin') {
      query = {
        _id: sopId,
        $or: [
          { userId: userId },
          { isGlobal: true }
        ]
      };
    }

    const sop = await Sop.findOne(query);
    if (!sop) {
      return res.status(404).json({ message: 'SOP not found' });
    }

    // Only allow deleting own SOPs or global SOPs for regular users, but for global, check if they can delete
    if (userRole !== 'admin' && sop.isGlobal) {
      return res.status(403).json({ message: 'Cannot delete global SOPs' });
    }

    await Sop.findOneAndDelete(query);

    // Log audit
    await Audit.create({
      userId,
      action: 'delete',
      type: 'sop',
      resourceId: sop._id,
      resourceTitle: sop.title,
    });

    // Emit real-time update to all connected clients
    const io = req.app.get('io');
    io.emit('sopUpdated', { action: 'delete', sopId: sop._id });

    res.status(200).json({ message: 'SOP deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};;

// Search SOPs
export const searchSops = async (req, res) => {
  try {
    const { query, tag } = req.query;
    const userId = req.userId;
    const userRole = req.userRole;

    if (!query && !tag) {
      return res.status(400).json({ message: 'Query or tag is required' });
    }

    const clauses = [];

    if (query) {
      const regex = new RegExp(query, 'i');
      clauses.push({
        $or: [
          { title: { $regex: regex } },
          { content: { $regex: regex } },
          { tags: { $in: [regex] } },
        ],
      });
    }

    if (tag) {
      const tagRegex = new RegExp(tag, 'i');
      clauses.push({ tags: { $in: [tagRegex] } });
    }

    let searchQuery = clauses.length === 1 ? clauses[0] : { $and: clauses };

    if (userRole !== 'admin') {
      searchQuery = {
        $and: [
          searchQuery,
          {
            $or: [
              { userId: userId },
              { isGlobal: true },
            ],
          },
        ],
      };
    }

    const sops = await Sop.find(searchQuery).sort({ createdAt: -1 }).populate('userId', 'firstName lastName email');

    await Audit.create({
      userId,
      action: 'view',
      type: 'search',
      details: { query, tag },
    });

    res.status(200).json(sops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};;
