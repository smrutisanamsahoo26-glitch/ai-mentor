import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export const callAIMentor = async (messages, exams = [], mood = null) => {
  try {
    // Build context from exams
    let context = "";
    if (exams && exams.length > 0) {
      context += "\n\nUpcoming Exams:\n";
      exams.forEach((exam) => {
        const daysLeft = Math.ceil(
          (new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24),
        );
        context += `- ${exam.subject}: ${daysLeft} days left (Priority: ${exam.priority})\n`;
      });
    }

    if (mood) {
      context += `\n\nUser's current mood: ${mood}`;
    }

    // Prepare system prompt
    const systemPrompt = `You are an AI Study Mentor for college engineering students. You help with:
- Study planning and scheduling
- Explaining complex concepts simply
- Emotional support and motivation
- Exam preparation strategies
- Time management for students
- Detecting weak areas and suggesting practice topics

Be supportive, encouraging, and practical in your advice.${context}`;

    const response = await axios.post(
      OPENAI_ENDPOINT,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling AI Mentor:", error);
    throw new Error(
      error.response?.data?.error?.message ||
        "Failed to get AI response. Make sure your OpenAI API key is valid.",
    );
  }
};

// Generate study plan using AI
export const generateStudyPlan = async (subject, examDate, currentLevel) => {
  try {
    const daysLeft = Math.ceil(
      (new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24),
    );

    const prompt = `Create a detailed day-by-day study plan for ${subject} exam in ${daysLeft} days.
Current level: ${currentLevel} (beginner/intermediate/advanced)

Format the response as:
Day 1: [topic] - [time in hours] - [key points]
Day 2: [topic] - [time in hours] - [key points]
...

Make it realistic and achievable.`;

    const response = await axios.post(
      OPENAI_ENDPOINT,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw error;
  }
};

// Get emotional support based on mood
export const getEmotionalSupport = async (mood, studyHours, stress = null) => {
  try {
    const moodMessages = {
      happy: "You seem happy! That's great energy to study with.",
      neutral:
        "You're in a neutral mood. Let's channel that into productive studying.",
      sad: "I sense you're feeling down. Let me help lift your mood.",
      stressed:
        "You're stressed. Let's break this down into manageable chunks.",
      tired: "You seem tired. Let's find the balance between rest and study.",
    };

    const prompt = `Student is feeling ${mood}. ${moodMessages[mood]}
Study hours today: ${studyHours}${stress ? ` Stress level: ${stress}/10` : ""}

Provide:
1. 2-3 motivating sentences
2. 2 specific break suggestions
3. 1 study tip for their current mood

Keep it concise and supportive.`;

    const response = await axios.post(
      OPENAI_ENDPOINT,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting emotional support:", error);
    throw error;
  }
};

// Detect weak areas and provide suggestions
export const detectWeakAreas = async (subject, tasksCompleted, studyTime) => {
  try {
    const prompt = `Analyze this student's performance:
Subject: ${subject}
Tasks completed: ${tasksCompleted}
Study time: ${studyTime} hours

Provide:
1. Assessment of weak areas in ${subject}
2. 3 specific practice recommendations
3. Estimated time to improve

Be specific and actionable. Focus on engineering topics.`;

    const response = await axios.post(
      OPENAI_ENDPOINT,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 400,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error detecting weak areas:", error);
    throw error;
  }
};
