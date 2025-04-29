import jwt from "jsonwebtoken";
import { db } from "../utils/db.js";
import cookieParser from "cookie-parser";
export const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
      if (!refreshToken) {
        return res.status(401).json({
          status: false,
          message: "Unauthorized access",
        });
      } else {
        const refreshDecoded = jwt.verify(
          refreshToken,
          process.env.REFRESHTOKEN_SECRET
        );
        console.log(refreshDecoded);

        const user = await db.user.findUnique({
          where: { id: refreshDecoded.id },
          select: {
            id: true,
            image: true,
            name: true,
            email: true,
            role: true,
          },
        });

        if (!user) {
          return res.status(401).json({
            status: false,
            message: "Unauthorized access",
          });
        }

        const newAccessToken = jwt.sign(
            { id: user.id,
              role: user.role
             },
            process.env.ACCESSTOKEN_SECRET,
            { expiresIn: process.env.ACCESSTOKEN_EXPIRY }
          );
          const newRefreshToken = jwt.sign(
            { id: user.id,
              role: user.role
             },
            process.env.REFRESHTOKEN_SECRET,
            {
              expiresIn: process.env.REFRESHTOKEN_EXPIRY,
            }
          );
    
          user.refreshToken = newRefreshToken;
          await db.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
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
    
          // res.cookie("jwtToken", jwtToken, cookieOptions);
          res.cookie("accessToken", newAccessToken, accessCookieOptions);
          res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);
    
          req.user = refreshDecoded;
          next();
      }
    } else {
      const accessDecoded = jwt.verify(
        accessToken,
        process.env.ACCESSTOKEN_SECRET
      );

      const user = await db.user.findUnique({
        where: { id: accessDecoded.id },
        select: {
          id: true,
          image: true,
          name: true,
          email: true,
          role: true,
        },
      });
      
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Unauthorized access",
        });
      }

      const newAccessToken = jwt.sign(
        { id: user.id,
          role: user.role
         },
        process.env.ACCESSTOKEN_SECRET,
        { expiresIn: process.env.ACCESSTOKEN_EXPIRY }
      );
      const newRefreshToken = jwt.sign(
        { id: user.id,
          role: user.role
         },
        process.env.REFRESHTOKEN_SECRET,
        {
          expiresIn: process.env.REFRESHTOKEN_EXPIRY,
        }
      );

      user.refreshToken = newRefreshToken;
      await db.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
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

      // res.cookie("jwtToken", jwtToken, cookieOptions);
      res.cookie("accessToken", newAccessToken, accessCookieOptions);
      res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

      req.user = accessDecoded;
      next();
    }
  } catch (error) {
    console.error("Error in isAuthenticated middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.user.id },
      select: {
        role: true,
      }
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(401).json({
        success: false,
        message: "Access Denied! Admins Only Allowed",
      });
    }

    next();
  } catch (error) {
    console.error("Error in checkAdmin middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error in checking admin role" });
  }
};