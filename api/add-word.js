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

    if (req.method === 'POST') {
      const { word, definitions, etymology, synonyms, sounds, partOfSpeech, romanForm, latinForm, kannadaForm } = req.body;

      if (!word) {
        return res.status(400).json({ message: 'Word is required.' });
      }

      const newWord = new KonkaniWords({
        word,
        definitions,
        etymology,
        synonyms,
        sounds,
        partOfSpeech,
        romanForm,
        latinForm,
        kannadaForm,
      });

      const savedWord = await newWord.save();
      res.status(201).json({ message: 'Word added successfully!', word: savedWord });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
