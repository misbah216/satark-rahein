import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function toSafeUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    roleField: user.roleField,
    totalScore: user.totalScore || 0,
    quizzesCompleted: user.quizzesCompleted || 0,
    quizHistory: user.quizHistory || [],
  };
}

export async function register(req, res) {
  try {
    const { fullName, email, password, role, roleField } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'fullName, email, password and role are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ fullName, email, password, role, roleField });
    const token = signToken(user);

    res.status(201).json({ token, user: toSafeUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'email, password and role are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || user.role !== role) {
      return res.status(401).json({ message: 'Invalid credentials or role' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials or role' });
    }

    const token = signToken(user);
    res.json({ token, user: toSafeUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: toSafeUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
}