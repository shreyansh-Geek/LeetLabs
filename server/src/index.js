import express from 'express'
import dotenv from 'dotenv'
import session from "express-session";
import passport from "./utils/passport.js";
import authRoutes from './routes/auth.routes.js'
import problemRoutes from './routes/problem.routes.js'
import executeCodeRoutes from "./routes/executeCode.routes.js"
import submissionRoutes from "./routes/submission.routes.js"
import sheetRoutes from "./routes/sheet.routes.js"
import noteRoutes from "./routes/note.routes.js";
import aiDiscussionRoutes from './routes/aiDiscussion.routes.js';
import glossaryRoutes from './routes/glossary.routes.js';
import blogRoutes from "./routes/blog.routes.js";
import contributeRoutes from './routes/contribute.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import cors from 'cors'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
dotenv.config()
const app = express()
app.use(cookieParser());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World, this is the LeetLabs server!🔥')
})

const allowedOrigins = [
  'http://localhost:5173',     // dev server
  'http://localhost:4173',     // build preview
  'https://www.leetlabs.in'    // production
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., curl, mobile apps) or if origin is in allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Increase payload size limit to 10MB
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/problems", problemRoutes)
app.use("/api/v1/execute-code" , executeCodeRoutes)
app.use("/api/v1/submissions", submissionRoutes)
app.use('/api/v1/sheets', sheetRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/ai-discussions', aiDiscussionRoutes);
app.use('/api/v1/glossary', glossaryRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use('/api/v1/contribute', contributeRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.listen(process.env.PORT|| 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`)   
})