import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import problemRoutes from './routes/problem.routes.js'
import executeCodeRoutes from "./routes/executeCode.routes.js"
import submissionRoutes from "./routes/submission.routes.js"
import sheetRoutes from "./routes/sheet.routes.js"
import cookieParser from 'cookie-parser'
dotenv.config()
const app = express()
app.use(cookieParser());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World, this is the LeetLabs server!🔥')
})

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/problems", problemRoutes)
app.use("/api/v1/execute-code" , executeCodeRoutes)
app.use("/api/v1/submissions", submissionRoutes)
app.use('/api/v1/sheets', sheetRoutes);

app.listen(process.env.PORT|| 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`)   
})