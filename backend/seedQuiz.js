import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './src/models/Question.js';

dotenv.config();

const sampleQuestions = [
  {
    category: 'Earthquake Safety',
    questionText: 'What is the universally recommended action to take immediately during an earthquake when inside a classroom or building?',
    options: [
      'Run immediately toward the main exit or staircase',
      'Drop, Cover, and Hold On under sturdy furniture',
      'Stand directly next to exterior glass windows',
      'Take the elevator down to the ground floor'
    ],
    correctAnswerIndex: 1,
    explanation: 'The Drop, Cover, and Hold On protocol protects individuals from falling debris and structural hazards, which cause the majority of earthquake injuries.',
    difficulty: 'Easy'
  },
  {
    category: 'Earthquake Safety',
    questionText: 'If you are outdoors on a campus ground when earthquake tremors begin, what should you do?',
    options: [
      'Move to an open area away from buildings, power lines, and trees',
      'Run inside the nearest concrete building for shelter',
      'Stand directly beneath street lights or utility poles',
      'Lie flat against the exterior wall of the building'
    ],
    correctAnswerIndex: 0,
    explanation: 'Exterior building walls, windows, and overhead utility lines present major collapse risks during tremors. Open grounds offer maximum safety.',
    difficulty: 'Easy'
  },
  {
    category: 'Fire Safety',
    questionText: 'Which protocol should be followed if a fire breaks out and dense smoke fills the corridor or hallway?',
    options: [
      'Run upright as fast as possible to exit',
      'Crawl low under the smoke while heading toward the nearest exit',
      'Open all doors and windows to increase airflow',
      'Hide inside a restroom and wait'
    ],
    correctAnswerIndex: 1,
    explanation: 'Smoke, heat, and toxic gases rise toward the ceiling. Cleaner, cooler air remains closer to the floor during a structural fire.',
    difficulty: 'Easy'
  },
  {
    category: 'Fire Safety',
    questionText: 'What does the acronym PASS stand for when operating a standard fire extinguisher?',
    options: [
      'Pull, Aim, Squeeze, Sweep',
      'Press, Activate, Spray, Stop',
      'Position, Align, Secure, Slide',
      'Protect, Alert, Sound, Safe'
    ],
    correctAnswerIndex: 0,
    explanation: 'PASS stands for: Pull the pin, Aim low at the base of the fire, Squeeze the lever, and Sweep side to side.',
    difficulty: 'Medium'
  },
  {
    category: 'Flood Preparedness',
    questionText: 'What is the safest rule to follow when encountering flowing water or submerged streets during heavy flash floods?',
    options: [
      'Walk through the water if it appears less than knee-deep',
      'Turn Around, Don’t Drown: Avoid walking or driving into moving water',
      'Swim quickly across to reach elevated dry ground',
      'Stand inside storm water drains for stability'
    ],
    correctAnswerIndex: 1,
    explanation: 'Just six inches of fast-moving water can knock an adult off their feet, and hidden sinkholes or live electrical wires often lie beneath floodwaters.',
    difficulty: 'Easy'
  },
  {
    category: 'Cyclone & Storms',
    questionText: 'What should students and staff do if an official cyclone landfall alert is sounded during school hours?',
    options: [
      'Go to the terrace or roof to monitor wind velocity',
      'Stay indoors away from exterior glass windows and shelter in central interior rooms',
      'Leave immediately on two-wheelers to travel home',
      'Open all outward-facing windows to balance pressure'
    ],
    correctAnswerIndex: 1,
    explanation: 'High-speed winds blow debris that can shatter windows. Interior rooms and reinforced structural walls provide the safest shelter during cyclone landfall.',
    difficulty: 'Medium'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI or MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(mongoUri);
    await Question.deleteMany();
    await Question.insertMany(sampleQuestions);
    console.log('Disaster safety quiz questions seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed execution failed:', error.message);
    process.exit(1);
  }
};

seedDB();