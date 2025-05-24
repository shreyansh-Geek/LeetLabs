// server/src/controllers/aiDiscussion.controller.js
import axios from 'axios';
import { db } from '../utils/db.js';

export const getChatHistory = async (req, res) => {
  const { problemId } = req.params;
  const userId = req.user.id;

  try {
    const messages = await db.chatMessage.findMany({
      where: { problemId, userId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, role: true, content: true, createdAt: true },
    });
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

export const sendMessage = async (req, res) => {
  const { problemId } = req.params;
  const { message } = req.body;
  const userId = req.user.id;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      select: { title: true, description: true, difficulty: true, tags: true, examples: true },
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const previousMessages = await db.chatMessage.findMany({
      where: { problemId, userId },
      orderBy: { createdAt: 'asc' },
      select: { role: true, content: true },
    });

    const context = `You are an AI assistant helping with a coding problem on LeetLabs. The problem is titled "${problem.title}" (Difficulty: ${problem.difficulty}). Description: ${problem.description}. Tags: ${problem.tags.join(', ')}. Examples: ${JSON.stringify(problem.examples)}. Provide clear, concise, and accurate answers related to the problem.`;

    const messages = [
      { role: 'system', content: context },
      ...previousMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const assistantMessage = response.data.choices[0].message.content;

    await db.chatMessage.createMany({
      data: [
        { problemId, userId, role: 'user', content: message, createdAt: new Date() },
        { problemId, userId, role: 'assistant', content: assistantMessage, createdAt: new Date() },
      ],
    });

    return res.status(200).json({
      success: true,
      message: { role: 'assistant', content: assistantMessage },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to process message' });
  }
};

export const clearChat = async (req, res) => {
  const { problemId } = req.params;
  const userId = req.user.id;

  try {
    await db.chatMessage.deleteMany({
      where: { problemId, userId },
    });
    return res.status(200).json({ success: true, message: 'Chat cleared' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to clear chat' });
  }
};