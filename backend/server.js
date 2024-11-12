import express from 'express';
import dotenv from 'dotenv'
import { connectDb } from './db/connectDb.js';
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import notificationRoute from './routes/notification.route.js'
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary'
import cors from 'cors'
import path from 'path'
dotenv.config()

const app = express();
const PORT= process.env.PORT || 8000
const __dirname = path.resolve()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})


app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))
app.use(express.json(
    {
        limit: '5mb'
    }
))
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/post', postRoute)
app.use('/api/notification', notificationRoute)

if (process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname,'/frontend/dist')))
    app.use('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'/frontend/dist/index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
    connectDb()
})
