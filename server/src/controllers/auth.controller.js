import bcrypt from "bcryptjs";
import { db } from "../utils/db.js";
import { UserRole } from "../generated/prisma/index.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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
    const user = await db.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        role: UserRole.USER,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "User not created/registered",
      });
    }

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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESSTOKEN_SECRET,
      {
        expiresIn: process.env.ACCESSTOKEN_EXPIRY,
      }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
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
