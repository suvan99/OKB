import mongoose from 'mongoose';

const sopSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    tags: [String],
    isGlobal: {
      type: Boolean,
      default: false,
    },
    versions: [
      {
        content: String,
        tags: [String],
        updatedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

const Sop = mongoose.model('Sop', sopSchema);

export default Sop;
