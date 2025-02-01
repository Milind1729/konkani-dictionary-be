import mongoose from 'mongoose';

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
}, { timestamps: true, collection: 'KonkaniWords' });

const KonkaniWords = mongoose.model('KonkaniWords', KonkaniWordSchema);

export default KonkaniWords;
