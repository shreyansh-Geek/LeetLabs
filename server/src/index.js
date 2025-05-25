import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import problemRoutes from './routes/problem.routes.js'
import executeCodeRoutes from "./routes/executeCode.routes.js"
import submissionRoutes from "./routes/submission.routes.js"
import sheetRoutes from "./routes/sheet.routes.js"
import noteRoutes from "./routes/note.routes.js";
import aiDiscussionRoutes from './routes/aiDiscussion.routes.js';
import glossaryRoutes from './routes/glossary.routes.js';
import blogRoutes from "./routes/blog.routes.js";
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

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

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

app.listen(process.env.PORT|| 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`)   
})