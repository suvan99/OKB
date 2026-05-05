import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'view'],
      required: true,
    },
    type: {
      type: String,
      enum: ['sop', 'policy', 'tag', 'search', 'user'],
      required: true,
    },
    resourceId: String,
    resourceTitle: String,
    details: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const Audit = mongoose.model('Audit', auditSchema);

export default Audit;
