import dotenv from 'dotenv';
import connectDB from './DB/db.js';

dotenv.config();

(async () => {
  try {
    await connectDB();
    console.log('Test connection succeeded');
    process.exit(0);
  } catch (err) {
    console.error('Test connection failed:', err.message || err);
    process.exit(1);
  }
})();
