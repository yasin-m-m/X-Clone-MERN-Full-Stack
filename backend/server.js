import express from 'express';
import dotenv from 'dotenv'
import { connectDb } from './db/connectDb.js';
dotenv.config()


const app = express();
const PORT= process.env.PORT || 8000

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
    connectDb()
})
