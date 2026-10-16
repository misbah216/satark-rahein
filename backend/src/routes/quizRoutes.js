import express from 'express';
import { getQuestionsByCategory, submitQuiz } from '../controllers/quizController.js';
import {requireAuth} from '../middleware/auth.js'; 

const router = express.Router();


router.get('/category/:category', getQuestionsByCategory);


router.post('/submit', requireAuth, submitQuiz);

export default router;