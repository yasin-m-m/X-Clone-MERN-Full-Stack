import bcrypt from 'bcryptjs';
import { User } from '../model/user.model.js';
import jwt from "jsonwebtoken";

export const signUp =async(req,res)=>{
    try {

        const {username, fullName, password, email } = req.body
        if (!username || !fullName || !password || !email) {
         return res.status(400).json({error: 'All fields are required'})
        }
        // validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return res.status(400).json({error: 'Invalid email'})
        }
        // validate password 
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
        if(!passwordRegex.test(password)){
            return res.status(400).json({error: 'Invalid password. Password must contain at least 6 characters, including uppercase, lowercase, numbers, and special characters'})
        }
        // validate username
        const usernameRegex = /^[a-zA-Z0-9]+$/
        if(!usernameRegex.test(username)){
            return res.status(400).json({msg: 'Invalid username. Username must contain only alphanumeric characters'})
        }

        // validate full name
        const fullNameRegex = /^[a-zA-Z\s]+$/
        if(!fullNameRegex.test(fullName)){
            return res.status(400).json({msg: 'Invalid full name. Full name must contain only alphabets and spaces'})
        }
        
        // check if user already exists
        const isEmail = await User.findOne({email})
        const isUsername = await User.findOne({username})
        if(isEmail && isUsername){
            return res.status(400).json({msg: 'User already exists'})
        }
        // hash password using bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10)

        // create new user
        const newUser = await User.create({username, fullName, password: hashedPassword, email})
        const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES})
        
        const options={
            expires: new Date(
                Date.now()+process.env.COOKIE_EXPIRES_TIME*24*60*60*1000
            ),
            httpOnly: true
        }
        res.status(201).cookie('jwt',token,options).json({
            success: true,
            data: newUser,
            token
        })
        
        
       
    } catch (error) {
        console.log(`This error is from SignUp controller. The error is: ${error}`);
        res.status(500).json({error:"Internal Server Error"})
        
    }
}
export const logIn =async(req,res)=>{
    try {
        const {username, password } = req.body
        if (!username || !password) {
         return res.status(400).json({error: 'All fields are required'})
        }
        const user = await User.findOne({username: username})
        if(!user){
            return res.status(401).json({error: 'User not found'}) 
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({error: 'Invalid credentials'}) 
        }
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES})
            const options={
            expires: new Date(
            Date.now()+process.env.COOKIE_EXPIRES_TIME*24*60*60*1000
        ),
            httpOnly: true
    }
    res.status(200).cookie('jwt',token,options).json({
        success: true,
        data: user,
        token
    })
    } catch (error) {
        console.log(`This error is from logIn controller. The error is: ${error}`);
        res.status(500).json({error:"Internal Server Error"})
        
    }
}
export const logOut =async(req,res)=>{
    try {
        res.cookie('jwt','',{
            expires: new Date(Date.now()),
            httpOnly: true
        }).status(200).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.log(`This error is from logOut controller. The error is: ${error}`);
        res.status(500).json({error:"Internal Server Error"})
        
    }
}

export const getMe=async(req,res)=>{
    try {
        const user =await User.findById(req.user.id).select('-password')
        res.status(200).json(user)
    } catch (error) {
        console.log(`This error is from logOut controller. The error is: ${error}`);
        res.status(500).json({error:"Internal Server Error"})
    }
}