import bcrypt from 'bcryptjs';
import { User } from '../model/user.model.js';

export const signUp =async(req,res)=>{
    try {

        const {userName, fullName, password, email } = req.body
        if (!userName || !fullName || !password || !email) {
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
        const userNameRegex = /^[a-zA-Z0-9]+$/
        if(!userNameRegex.test(userName)){
            return res.status(400).json({msg: 'Invalid username. Username must contain only alphanumeric characters'})
        }

        // validate full name
        const fullNameRegex = /^[a-zA-Z\s]+$/
        if(!fullNameRegex.test(fullName)){
            return res.status(400).json({msg: 'Invalid full name. Full name must contain only alphabets and spaces'})
        }
        
        // check if user already exists
        const isEmail = await User.findOne({email})
        const isUserName = await User.findOne({userName})
        if(isEmail && isUserName){
            return res.status(400).json({msg: 'User already exists'})
        }
        // hash password using bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10)

        // create new user
        const newUser = new User({userName, fullName, password: hashedPassword, email})
        if (newUser) {
            await newUser.save()
            res.status(201).json({message: 'User created successfully',newUser})
        } else {
            res.status(400).json({error: 'Failed to create user'})
        }
        
        
       
    } catch (error) {
        console.log(`This error is from SignUp controller. The error is: ${error}`);
        
    }
}
export const logIn =async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(`This error is from logIn controller. The error is: ${error}`);
        
    }
}
export const logOut =async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(`This error is from logOut controller. The error is: ${error}`);
        
    }
}