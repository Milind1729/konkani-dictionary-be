import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const app = express();
app.use(cors());
app.use(bodyParser.json());


const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000
const MONGO_URI = process.env.MONGO_URI; // Use Mongo URI from .env

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Define the schema for Konkani words
const KonkaniWordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  definitions: { type: [String], default: [] },
  etymology: String,
  synonyms: { type: [String], default: [] },
  sounds: [
    {
      ipa: String,
    },
  ],
  partOfSpeech: String,
  romanForm: String,
  latinForm: String,
  kannadaForm: String,
}, { timestamps: true,collection: 'KonkaniWords' },);

const KonkaniWords = mongoose.model('KonkaniWords', KonkaniWordSchema);

// API Endpoint to add a word
app.post('/api/addword', async (req, res) => {
  try {
    const {
      word,
      definitions,
      etymology,
      synonyms,
      sounds,
      partOfSpeech,
      romanForm,
      latinForm,
      kannadaForm,
    } = req.body;

    // Ensure the required field 'word' is present
    if (!word) {
      return res.status(400).json({ message: 'Word is required.' });
    }

    // Create a new word
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

    // Save to database
    const savedWord = await newWord.save();

    // Respond with the saved document
    res.status(201).json({ message: 'Word added successfully!', word: savedWord });
    console.log({ message: 'Word added successfully!', word: savedWord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch a random word from the database
app.get('/api/random-word', async (req, res) => {
  try {
    console.log('Fetching random word');
    const count = await KonkaniWords.countDocuments();
    const randomIndex = Math.floor(Math.random() * count); // Random index
    const randomWord = await KonkaniWords.findOne().skip(randomIndex); // Fetch random word

    if (randomWord) {
      console.log('Random word:', randomWord);
      res.json(randomWord);
    } else {
      res.status(404).json({ message: 'No words found' });
    }
  } catch (error) {
    console.error('Error fetching random word:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API Endpoint to search a word by its latinForm
app.get('/api/search-latin', async (req, res) => {
  try {
    // Extract latinForm from query parameters
    const { latinForm } = req.query;

    if (!latinForm) {
      return res.status(400).json({ message: 'Latin form is required.' });
    }

    // Search for words by latinForm
    const word = await KonkaniWords.findOne({ latinForm: latinForm });

    if (word) {
      res.json(word);
    } else {
      res.status(404).json({ message: 'Word not found with the provided Latin form.' });
    }
  } catch (error) {
    console.error('Error searching for word by latinForm:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


export default app;