import express from 'express';
import dotenv from 'dotenv'
import { connectDb } from './db/connectDb.js';
import authRoute from './routes/auth.route.js'
dotenv.config()


const app = express();
const PORT= process.env.PORT || 8000


app.use(express.json())


app.use('/api/auth', authRoute)
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
    connectDb()
})
