
import jwt from "jsonwebtoken";
import { db } from "../utils/db.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

const accessCookieOptions = {
  ...cookieOptions,
  maxAge: 24 * 60 * 60 * 1000,
};

const refreshCookieOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const clearAuthCookies = (res) => {
  const baseOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };

  for (const sameSite of ["lax", "none", "strict"]) {
    res.clearCookie("accessToken", {
      ...baseOptions,
      sameSite,
    });

    res.clearCookie("refreshToken", {
      ...baseOptions,
      sameSite,
    });
  }
};

const unauthorized = (res) => {
  clearAuthCookies(res);

  return res.status(401).json({
    status: false,
    message: "Unauthorized access",
  });
};

export const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    // First, try the access token.
    if (accessToken) {
      try {
        const decoded = jwt.verify(
          accessToken,
          process.env.ACCESSTOKEN_SECRET
        );

        const user = await db.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            role: true,
            refreshToken: true,
          },
        });

        // Reject sessions revoked by logout or password reset.
        if (!user || !user.refreshToken) {
          return unauthorized(res);
        }

        const nowInSeconds = Math.floor(Date.now() / 1000);
const secondsRemaining =
  typeof decoded.exp === "number"
    ? decoded.exp - nowInSeconds
    : 0;

if (secondsRemaining > 5 * 60) {
  req.user = {
    ...decoded,
    id: user.id,
    role: user.role,
  };

  return next();
}

// Access token is near expiry (5 minutes or less).
// Fall through to the existing refresh-token validation below.

      } catch (error) {
        if (!(error instanceof jwt.TokenExpiredError)) {
          if (
            error instanceof jwt.JsonWebTokenError ||
            error instanceof jwt.NotBeforeError
          ) {
            return unauthorized(res);
          }

          throw error;
        }

        // Expired access token: validate the refresh token below.
      }
    }

    // The access token is missing or expired.
    if (!refreshToken) {
      return unauthorized(res);
    }

    let refreshDecoded;

    try {
      refreshDecoded = jwt.verify(
        refreshToken,
        process.env.REFRESHTOKEN_SECRET
      );
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError ||
        error instanceof jwt.NotBeforeError
      ) {
        return unauthorized(res);
      }

      throw error;
    }

    const user = await db.user.findUnique({
      where: { id: refreshDecoded.id },
      select: {
        id: true,
        role: true,
        refreshToken: true,
      },
    });

    // Only accept the refresh token stored for this user.
    if (!user || user.refreshToken !== refreshToken) {
      return unauthorized(res);
    }

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESSTOKEN_SECRET,
      { expiresIn: process.env.ACCESSTOKEN_EXPIRY }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.REFRESHTOKEN_SECRET,
      { expiresIn: process.env.REFRESHTOKEN_EXPIRY }
    );

    // Save the replacement refresh token before issuing new cookies.
    await db.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.cookie("accessToken", newAccessToken, accessCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    req.user = {
      id: user.id,
      role: user.role,
    };

    return next();
  } catch (error) {
    console.error(
      "Error in isAuthenticated middleware:",
      error.message
    );

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const user = await db.user.findUnique({
      where: { id: req.user.id },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access Denied! Admins Only Allowed",
      });
    }

    return next();
  } catch (error) {
    console.error(
      "Error in checkAdmin middleware:",
      error.message
    );

    return res.status(500).json({
      message: "Internal Server Error in checking admin role",
    });
  }
};
