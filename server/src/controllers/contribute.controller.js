// server/src/controllers/contribute.controller.js
import { db } from "../utils/db.js";

export const createContribution = async (req, res) => {
  // Check if req.body is defined
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const { name, email, contactNumber, contributionType, experience, portfolio, message } = req.body;
  const { id: userId } = req.user; // Extract userId from authenticated user

  // Basic validation
  if (!name || !email || !contributionType) {
    return res.status(400).json({ message: "Name, email, and contribution type are required" });
  }

  // Validate email format
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Create contribution
    const contribution = await db.contribution.create({
      data: {
        userId,
        name,
        email,
        contactNumber,
        contributionType,
        experience,
        portfolio,
        message,
      },
      include: { user: { select: { name: true, email: true } } },
    });

    // Send confirmation email
    try {
      const { sendMail } = require("../utils/mailer");
      await sendMail({
        to: email,
        subject: "Thank You for Your Interest in Contributing to LeetLabs!",
        html: `<p>Hi ${name},</p><p>Thank you for expressing interest in contributing to LeetLabs! We'll review your application and reach out soon.</p>`,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return res.status(201).json({
      message: "Contribution application submitted successfully",
      contribution,
    });
  } catch (error) {
    console.error("Contribution Error:", error);
    return res.status(500).json({ message: "Failed to submit contribution application" });
  }
};