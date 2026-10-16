import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Earthquake Safety', 'Fire Safety', 'Flood Preparedness', 'Cyclone & Storms'],
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    correctAnswerIndex: {
      type: Number,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Question', questionSchema);