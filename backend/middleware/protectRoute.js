import jwt from "jsonwebtoken"
import { User } from "../model/user.model.js"

export const protectRoute =async(req,res,next) =>{
    try {
        const token = req.cookies.jwt
        
        if(!token){
            return res.status(400).json({error: 'You are not authenticated'})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
       
        const user = await User.findById(decoded.id).select('-password')
        if (!user) {
            return res.status(400).json({error: 'User not found'})
        }
        req.user = user;
        next()
    } catch (error) {
        console.log(`This error is from protected route middleware. The error is: ${error}`);
        res.status(500).json({error:"Internal Server Error"})
    }
}