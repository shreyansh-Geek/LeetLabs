// utils/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { db } from "./db.js";
import { UserRole } from "../generated/prisma/index.js";
import dotenv from "dotenv";

dotenv.config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await db.user.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          user = await db.user.create({
            data: {
              email: profile.emails[0].value,
              name: profile.displayName,
              image: profile.photos[0]?.value,
              isemailVerified: true,
                role: UserRole.CODER,
              password: "",
              googleId: profile.id,
            },
          });
        } else if (!user.googleId) {
          user = await db.user.update({
            where: { id: user.id },
            data: { googleId: profile.id },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find user by githubId first
        let user = await db.user.findUnique({
          where: { githubId: profile.id },
        });

        // If no user found by githubId, try email or create new user
        if (!user) {
          const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : `${profile.id}@github.com`;
          user = await db.user.findUnique({
            where: { email },
          });

          if (!user) {
            user = await db.user.create({
              data: {
                email,
                name: profile.displayName || profile.username,
                image: profile.photos[0]?.value,
                isemailVerified: true,
                role: UserRole.CODER,
                password: "",
                githubId: profile.id,
              },
            });
          } else if (!user.githubId) {
            user = await db.user.update({
              where: { id: user.id },
              data: { githubId: profile.id },
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;