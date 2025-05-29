import bcrypt from "bcryptjs";
import { db } from "../utils/db.js";
import { UserRole } from "../generated/prisma/index.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import passport from "../utils/passport.js";
import { sendMail } from "../utils/mailer.js";
import {
  registrationMailTemplate, passwordResetMailTemplate} from "../utils/mailTemplates.js";

export const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const userExists = await db.user.findUnique({ where: { email: email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);


    const user = await db.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        role: UserRole.USER,
        verificationToken: verificationToken,
        verificationTokenExpiry: verificationTokenExpiry,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "User not created/registered",
      });
    }

    const verificationLink = `${process.env.BASE_URL}/api/v1/auth/verifyUser/${verificationToken}`;

    const template = registrationMailTemplate({ name, verificationLink });

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
        image: user?.image,
      },
    });
  } catch (error) {
    console.log("Registration Error: ", error);
    return res.status(500).json({ error: error.message });
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
      // Token expired -> Generate new token
      const newVerificationToken = crypto.randomBytes(32).toString("hex");
      const newVerificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10mins

      await db.user.update({
        where: { id: user.id },
        data: {
          verificationToken: newVerificationToken,
          verificationTokenExpiry: newVerificationTokenExpiry,
        },
      });

      const verificationLink = `${process.env.BASE_URL}/api/v1/auth/verifyUser/${newVerificationToken}`;
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

    // Token valid -> Verify user
    await db.user.update({
      where: { id: user.id },
      data: {
        isemailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    // Redirect to frontend login page
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
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await db.user.findUnique({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isemailVerified) {  
      return res.status(400).json({  
          message: "Please verify your email before logging in."  
      });  
  }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user.id,
        role: user.role
       },
      process.env.ACCESSTOKEN_SECRET,
      {
        expiresIn: process.env.ACCESSTOKEN_EXPIRY,
      }
    );
    const refreshToken = jwt.sign(
      { id: user.id,
        role: user.role
       },
      process.env.REFRESHTOKEN_SECRET,
      {
        expiresIn: process.env.REFRESHTOKEN_EXPIRY,
      }
    );

    // Update refresh token in the database
    await db.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken },
    });

    const accessCookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    };

    const refreshCookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user?.image,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ error: "Failed to log out" });
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
        image: user?.image,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await db.user.findUnique({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetPasswordToken,
        resetPasswordTokenExpiry: resetPasswordTokenExpiry,
      },
    });
    const resetLink = `${process.env.BASE_URL}/api/v1/auth/resetPassword/${resetPasswordToken}`;
    const mail = passwordResetMailTemplate({
      name: user.name,
      resetLink: resetLink,
    });
    await sendMail({
      to: user.email,
      subject: "LeetLabs Reset Password Link",
      htmlMessage: mail,
    });
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const resetPassword = async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { newpassword } = req.body;

  if (!resetPasswordToken) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!newpassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await db.user.findFirst({
      where: { resetPasswordToken: resetPasswordToken },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    
    if (user.resetPasswordTokenExpiry  < new Date()) {
      // Token expired -> Generate new token
      const newResetPasswordToken = crypto.randomBytes(32).toString("hex");
      const newResetPasswordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10mins

      await db.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: newResetPasswordToken,
          resetPasswordTokenExpiry: newResetPasswordTokenExpiry,
        },
      });

      const resetLink = `${process.env.BASE_URL}/api/v1/auth/resetPassword/${newResetPasswordToken}`;
      const mail = passwordResetMailTemplate({
        name: user.name,
        resetLink,
      });

      await sendMail({
        to: user.email,
        subject: "New Verification Email - LeetLabs",
        htmlMessage: mail,
      });

      return res.status(400).json({
        success: false,
        message:
          "Token expired. A new verification email has been sent to your email address.",
      });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    });
    return res.status(200).json({ message: "Password reset successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

// OAuth Routes
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

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.FRONTEND_URL}/profile`);
  } catch (error) {
    console.error("Google Callback Error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

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

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.FRONTEND_URL}/profile`);
  } catch (error) {
    console.error("GitHub Callback Error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};