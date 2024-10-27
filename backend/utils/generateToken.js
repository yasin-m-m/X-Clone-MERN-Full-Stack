import jwt from 'jsonwebtoken';

export const generateToken=(userId, res)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: '15d' })
    res.cookie('jwt', token, {
        maxAge: 15*24*60*60*1000,
        httpOnly: true, // for safety purpose. It prevents xss attacks 
        sameSite:"strict", // for safety purpose. It prevents CSRF attacks
        secure: process.env.NODE_ENV !== "development"
    })
}