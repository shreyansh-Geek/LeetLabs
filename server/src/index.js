import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
dotenv.config()
const app = express()
app.use(cookieParser());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World, this is the LeetLabs server!🔥')
})

app.use("/api/v1/auth", authRoutes)

app.listen(process.env.PORT|| 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`)   
})