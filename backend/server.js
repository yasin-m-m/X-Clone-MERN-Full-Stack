import express from 'express';
import dotenv from 'dotenv'
import { connectDb } from './db/connectDb.js';
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import cookieParser from 'cookie-parser';
dotenv.config()


const app = express();
const PORT= process.env.PORT || 8000


app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
    connectDb()
})
