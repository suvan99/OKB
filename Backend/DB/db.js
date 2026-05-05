// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     const mongoURI = process.env.MONGODB_URI;

//     if (!mongoURI) {
//       throw new Error('MONGODB_URI not defined in .env file');
//     }

//     await mongoose.connect(mongoURI);

//     console.log('✅ MongoDB Connected Successfully');
//     return mongoose.connection;
//   } catch (error) {
//     console.error('❌ MongoDB Connection Error:', error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;



import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI not defined in .env file');
    }

    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB Connected Successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
