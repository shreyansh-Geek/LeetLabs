
import bcrypt from "bcryptjs";
import { db } from "../utils/db.js";
import { UserRole } from "../generated/prisma/index.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import passport from "../utils/passport.js";
import { sendMail } from "../utils/mailer.js";
import {
  registrationMailTemplate,
  passwordResetMailTemplate,
} from "../utils/mailTemplates.js";

// Keep cookie settings identical across password login and OAuth.
// Localhost uses non-Secure cookies; production requires HTTPS.
const authCookieBase = {
  httpOnly: true,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const accessCookieOptions = {
  ...authCookieBase,
  maxAge: 24 * 60 * 60 * 1000,
};

const refreshCookieOptions = {
  ...authCookieBase,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const clearAuthCookies = (res) => {
  // Clear cookies created by current and legacy authentication flows.
  for (const sameSite of ["lax", "none", "strict"]) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite,
    });
  }
};

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const userExists = await db.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.USER,
        verificationToken,
        verificationTokenExpiry,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "User not created/registered",
      });
    }

    const verificationLink =
      `${process.env.BASE_URL}/api/v1/auth/verifyUser/${verificationToken}`;

    const template = registrationMailTemplate({
      name,
      verificationLink,
    });

    await sendMail({
      to: user.email,
      subject: "LeetLabs Verification Email",
      htmlMessage: template,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { verificationToken } = req.params;

    if (!verificationToken) {
      return res.status(400).json({
        success: false,
        message: "Token not found",
      });
    }

    const user = await db.user.findFirst({
      where: { verificationToken },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found or already verified",
      });
    }

    if (user.verificationTokenExpiry < new Date()) {
      const newVerificationToken = crypto.randomBytes(32).toString("hex");
      const newVerificationTokenExpiry = new Date(
        Date.now() + 10 * 60 * 1000
      );

      await db.user.update({
        where: { id: user.id },
        data: {
          verificationToken: newVerificationToken,
          verificationTokenExpiry: newVerificationTokenExpiry,
        },
      });

      const verificationLink =
        `${process.env.BASE_URL}/api/v1/auth/verifyUser/${newVerificationToken}`;

      const template = registrationMailTemplate({
        name: user.name,
        verificationLink,
      });

      await sendMail({
        to: user.email,
        subject: "New Verification Email - LeetLabs",
        htmlMessage: template,
      });

      return res.status(400).json({
        success: false,
        message:
          "Token expired. A new verification email has been sent to your email address.",
      });
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        isemailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    return res.redirect(`${process.env.FRONTEND_URL}/login`);
  } catch (error) {
    console.error("Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (!user.isemailVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.ACCESSTOKEN_SECRET,
      {
        expiresIn: process.env.ACCESSTOKEN_EXPIRY,
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.REFRESHTOKEN_SECRET,
      {
        expiresIn: process.env.REFRESHTOKEN_EXPIRY,
      }
    );

    // Store the active refresh token in the database.
    await db.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      error: "Login failed",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Revoke the active refresh-token session.
    await db.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error.message);

    clearAuthCookies(res);

    return res.status(500).json({
      success: false,
      message: "Failed to log out",
    });
  }
};

export const check = async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Check successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Authentication Check Error:", error);

    return res.status(400).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordTokenExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken,
        resetPasswordTokenExpiry,
      },
    });

    const resetLink =
      `${process.env.BASE_URL}/api/v1/auth/resetPassword/${resetPasswordToken}`;

    const mail = passwordResetMailTemplate({
      name: user.name,
      resetLink,
    });

    await sendMail({
      to: user.email,
      subject: "LeetLabs Reset Password Link",
      htmlMessage: mail,
    });

    return res.status(200).json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { newpassword } = req.body;

  if (!resetPasswordToken || !newpassword) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const user = await db.user.findFirst({
      where: { resetPasswordToken },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    if (
      !user.resetPasswordTokenExpiry ||
      user.resetPasswordTokenExpiry < new Date()
    ) {
      const newResetPasswordToken = crypto.randomBytes(32).toString("hex");
      const newResetPasswordTokenExpiry = new Date(
        Date.now() + 10 * 60 * 1000
      );

      await db.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: newResetPasswordToken,
          resetPasswordTokenExpiry: newResetPasswordTokenExpiry,
        },
      });

      const resetLink =
        `${process.env.BASE_URL}/api/v1/auth/resetPassword/${newResetPasswordToken}`;

      const mail = passwordResetMailTemplate({
        name: user.name,
        resetLink,
      });

      await sendMail({
        to: user.email,
        subject: "LeetLabs Password Reset Link",
        htmlMessage: mail,
      });

      return res.status(400).json({
        success: false,
        message:
          "Token expired. A new password reset email has been sent to your email address.",
      });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
        refreshToken: null,
      },
    });

    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

// Google OAuth
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESSTOKEN_SECRET,
      { expiresIn: process.env.ACCESSTOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.REFRESHTOKEN_SECRET,
      { expiresIn: process.env.REFRESHTOKEN_EXPIRY }
    );

    await db.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.redirect(`${process.env.FRONTEND_URL}/profile`);
  } catch (error) {
    console.error("Google Callback Error:", error);

    return res.redirect(
      `${process.env.FRONTEND_URL}/login?error=auth_failed`
    );
  }
};

// GitHub OAuth
export const githubAuth = passport.authenticate("github", {
  scope: ["user:email"],
});

export const githubCallback = async (req, res) => {
  try {
    const user = req.user;

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESSTOKEN_SECRET,
      { expiresIn: process.env.ACCESSTOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.REFRESHTOKEN_SECRET,
      { expiresIn: process.env.REFRESHTOKEN_EXPIRY }
    );

    await db.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.redirect(`${process.env.FRONTEND_URL}/profile`);
  } catch (error) {
    console.error("GitHub Callback Error:", error);

    return res.redirect(
      `${process.env.FRONTEND_URL}/login?error=auth_failed`
    );
  }
};
