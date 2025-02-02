import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KonkaniWords from '../models/konkaniWordModel.js';

dotenv.config();

// MongoDB connection function
const connectDb = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI);
};

export default async (req, res) => {
  try {
    // Connect to the database
    await connectDb();

    if (req.method === 'GET') {
      const count = await KonkaniWords.countDocuments();
      const randomIndex = Math.floor(Math.random() * count);
      const randomWord = await KonkaniWords.findOne().skip(randomIndex);

      if (randomWord) {
        res.status(200).json(randomWord);
      } else {
        res.status(404).json({ message: 'No words found' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
