import express from 'express';
import dotenv from 'dotenv'
import { connectDb } from './db/connectDb.js';
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import notificationRoute from './routes/notification.route.js'
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary'
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})
const app = express();
const PORT= process.env.PORT || 8000


app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/post', postRoute)
app.use('/api/notification', notificationRoute)
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
    connectDb()
})
