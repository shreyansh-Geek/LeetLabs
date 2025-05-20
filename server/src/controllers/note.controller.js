import { db } from "../utils/db.js";

export const saveNote = async (req, res) => {
  const { problemId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;
  try {
    const note = await db.note.upsert({
      where: { userId_problemId: { userId, problemId } },
      update: { content, updatedAt: new Date() },
      create: { userId, problemId, content },
    });
    return res.status(200).json({ success: true, note });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error saving note" });
  }
};

export const getNote = async (req, res) => {
  const { problemId } = req.params;
  const userId = req.user.id;
  try {
    const note = await db.note.findUnique({
      where: { userId_problemId: { userId, problemId } },
    });
    return res.status(200).json({ success: true, note: note?.content || "" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching note" });
  }
};