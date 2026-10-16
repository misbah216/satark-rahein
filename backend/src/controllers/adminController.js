import User from '../models/User.js';
import Question from '../models/Question.js';

// Institute Location Hazard Database
export const LOCATION_HAZARDS = {
  'delhi-ncr': {
    name: 'Delhi-NCR / Western UP (Seismic Zone IV & Urban)',
    primaryHazards: ['Earthquake Safety', 'Fire Safety'],
    riskLevel: 'HIGH',
    advisory: 'Dense infrastructure zone prone to moderate-high seismic tremors and high-rise structural fire risks.',
  },
  'uttarakhand': {
    name: 'Uttarakhand / Hilly Region (Seismic Zone V & Cloudburst)',
    primaryHazards: ['Earthquake Safety', 'Flood Preparedness'],
    riskLevel: 'CRITICAL',
    advisory: 'Steep terrain vulnerable to active fault lines, landslides, and flash flood runoffs.',
  },
  'mumbai-coastal': {
    name: 'Mumbai / Coastal Region (Cyclone & Urban Flooding)',
    primaryHazards: ['Cyclone & Storms', 'Flood Preparedness'],
    riskLevel: 'HIGH',
    advisory: 'Coastal weather zone vulnerable to severe monsoon waterlogging, tidal surges, and cyclonic winds.',
  },
  'odisha-bengal': {
    name: 'Odisha & Bengal Coast (Super Cyclones)',
    primaryHazards: ['Cyclone & Storms', 'Flood Preparedness'],
    riskLevel: 'CRITICAL',
    advisory: 'Frequent cyclonic storms requiring active shelter evacuation and storm surge readiness.',
  },
};

// Global Campus Broadcast Store (In-Memory for real-time alerts)
let activeBroadcast = {
  title: 'All Systems Normal',
  message: 'Routine emergency protocols active. No active campus warning issued.',
  severity: 'normal', // normal, warning, emergency
  updatedAt: new Date(),
};

export const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    
    const students = await User.find({ role: 'student' }).select('totalScore quizzesCompleted quizHistory');
    
    let totalScoreSum = 0;
    let totalDrillsSum = 0;
    let categoryStats = {
      'Earthquake Safety': { total: 0, count: 0 },
      'Fire Safety': { total: 0, count: 0 },
      'Flood Preparedness': { total: 0, count: 0 },
      'Cyclone & Storms': { total: 0, count: 0 },
    };

    students.forEach((s) => {
      totalScoreSum += s.totalScore || 0;
      totalDrillsSum += s.quizzesCompleted || 0;
      (s.quizHistory || []).forEach((qh) => {
        if (categoryStats[qh.category]) {
          categoryStats[qh.category].total += qh.percentage || 0;
          categoryStats[qh.category].count += 1;
        }
      });
    });

    const avgCampusReadiness = students.length > 0
      ? Math.round(totalScoreSum / students.length)
      : 0;

    // Identify Weakest Module
    let weakestModule = 'None';
    let lowestAvg = 100;
    Object.keys(categoryStats).forEach((cat) => {
      const { total, count } = categoryStats[cat];
      if (count > 0) {
        const avg = Math.round(total / count);
        if (avg < lowestAvg) {
          lowestAvg = avg;
          weakestModule = cat;
        }
      }
    });

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        avgCampusReadiness,
        totalDrillsCompleted: totalDrillsSum,
        weakestModule: weakestModule === 'None' ? 'Fire Safety' : weakestModule,
        weakestAvg: lowestAvg === 100 ? 45 : lowestAvg,
      },
      broadcast: activeBroadcast,
      hazardsConfig: LOCATION_HAZARDS,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['student', 'teacher'] } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBroadcast = async (req, res) => {
  try {
    const { title, message, severity } = req.body;
    activeBroadcast = {
      title: title || 'Campus Alert',
      message: message || '',
      severity: severity || 'warning',
      updatedAt: new Date(),
    };
    res.json({ success: true, broadcast: activeBroadcast });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { category, questionText, options, correctAnswerIndex, explanation, difficulty } = req.body;
    if (!category || !questionText || !options || options.length < 2) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }
    const newQ = await Question.create({
      category,
      questionText,
      options,
      correctAnswerIndex,
      explanation,
      difficulty: difficulty || 'Medium',
    });
    res.status(201).json({ success: true, question: newQ });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};