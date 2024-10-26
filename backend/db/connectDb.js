import mongoose from 'mongoose'
export const connectDb =async()=>{
    try {
         await mongoose.connect(process.env.DB_URI);
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error(`error connecting to MongoDB. The error is ${error}`);
        process.exit(1);
    }

}