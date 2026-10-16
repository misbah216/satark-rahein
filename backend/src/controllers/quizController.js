import Question from '../models/Question.js';
import User from '../models/User.js';

// 1. Category ke hisaab se questions fetch karna
export const getQuestionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const filter = category && category !== 'All' ? { category } : {};

    // .select('-correctAnswerIndex') se right answer hide rahega
    const questions = await Question.find(filter).select('-correctAnswerIndex');

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Quiz answers verify karna aur user stats update karna
export const submitQuiz = async (req, res) => {
  try {
    const { category, answers } = req.body;
    // Expected format: answers = [{ questionId: "...", selectedOptionIndex: 1 }, ...]
    const userId = req.user?.id || req.user?._id;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No answers provided',
      });
    }

    const questionIds = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    let score = 0;
    const review = [];

    questions.forEach((q) => {
      const userAnswerObj = answers.find((a) => a.questionId === q._id.toString());
      const selectedIndex = userAnswerObj ? userAnswerObj.selectedOptionIndex : null;
      const isCorrect = selectedIndex === q.correctAnswerIndex;

      if (isCorrect) score += 1;

      review.push({
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        selectedOptionIndex: selectedIndex,
        correctAnswerIndex: q.correctAnswerIndex,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Points rule: Har correct answer par 10 points
    const earnedPoints = score * 10;

    // User document update
    const user = await User.findById(userId);
    if (user) {
      user.totalScore += earnedPoints;
      user.quizzesCompleted += 1;
      user.quizHistory.push({
        category: category || 'Phishing',
        score,
        totalQuestions,
        percentage,
      });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Quiz evaluated successfully',
      score,
      totalQuestions,
      percentage,
      earnedPoints,
      totalScore: user ? user.totalScore : 0,
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};