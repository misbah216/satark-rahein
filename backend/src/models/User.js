import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      required: true,
    },
    roleField: { type: String, trim: true },

    totalScore: {
      type: Number,
      default: 0,
    },
    quizzesCompleted: {
      type: Number,
      default: 0,
    },
    quizHistory: [
      {
        category: {
          type: String,
          enum: ['Earthquake Safety', 'Fire Safety', 'Flood Preparedness', 'Cyclone & Storms'],
          required: true,
        },
        score: {
          type: Number,
          required: true,
        },
        totalQuestions: {
          type: Number,
          required: true,
        },
        percentage: {
          type: Number,
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);