import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.get('/', (req, res) => {
    res.send('Hello World, this is the LeetLabs server!')
})

app.listen(process.env.PORT|| 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`)   
})