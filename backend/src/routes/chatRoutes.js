import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// Fallback safety database (agar internet ya API key issue ho)
const FALLBACK_KNOWLEDGE = [
  {
    keywords: ['earthquake', 'tremor', 'shaking'],
    answer: "During an earthquake: DROP to your hands and knees, COVER your head and neck under sturdy furniture, and HOLD ON until shaking stops. Stay away from windows. If outdoors, move to an open clear ground. Never use elevators."
  },
  {
    keywords: ['fire', 'smoke', 'extinguisher'],
    answer: "During a fire: Sound alarm immediately. Evacuate via stairs (never elevators). If there is smoke, crawl low on hands and knees. Use the PASS method for extinguishers: Pull pin, Aim low, Squeeze lever, Sweep side-to-side."
  },
  {
    keywords: ['flood', 'water'],
    answer: "During floods: Never walk or drive through moving water ('Turn Around, Don't Drown'). Move immediately to higher ground/upper floors. Avoid basements and avoid electrical equipment if standing in water."
  },
  {
    keywords: ['number', 'helpline', 'contact'],
    answer: "Emergency Helplines: 112 (National Emergency), 101 (Fire), 102/108 (Ambulance), 1070/1077 (Disaster Management Services)."
  }
];

router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Agar Gemini API Key available hai toh direct AI se reply lo
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: `You are 'Satark AI', an official campus disaster preparedness and safety assistant.
Your job is to provide accurate, crisp, life-saving advice to students and teachers for disasters such as earthquakes, fires, floods, cyclones, stampedes, and first-aid emergencies.
Rules:
- Give direct, practical, step-by-step advice.
- Keep answers concise (within 3 to 5 sentences or bullet points).
- Emphasize NDMA and international life-safety protocols (e.g., Drop Cover Hold On, PASS rule).
- If the query is off-topic (not related to disaster safety, emergencies, or campus protocols), politely decline and remind the user that you are specialized in disaster preparedness.`,
          },
        });

        if (response?.text) {
          return res.json({ reply: response.text });
        }
      } catch (geminiError) {
        console.error('Gemini API call failed, using fallback:', geminiError.message);
      }
    }

    // Fallback logic
    const lower = message.toLowerCase();
    const matched = FALLBACK_KNOWLEDGE.find(item =>
      item.keywords.some(kw => lower.includes(kw))
    );

    const reply = matched
      ? matched.answer
      : "I am Satark AI. In an active emergency, alert campus wardens immediately. Ask me specific questions about Earthquake procedures, Fire safety (PASS), Floods, Cyclones, or Helpline numbers.";

    return res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

export default router;