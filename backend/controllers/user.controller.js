import { Notification } from "../model/notification.model.js";
import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from 'cloudinary';

//get single user profile
export const getProfile= async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.status(200).json(user)
    } catch (error) {
        console.log(`This error is from get profile route. The error is: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// follow and un follow users
export const followUnFollowUsers = async(req, res) => {
    try {
        const {id}=req.params
        const userToModify = await User.findById(id)
        if (!userToModify) return res.status(404).json({ error: 'User not found' })
        const currentUser = await User.findById(req.user._id)
        if (!currentUser) return res.status(401).json({ error: 'Unauthorized(this error is from followUnFollowUsers controller)' })
        if (id == req.user._id) {
            return res.status(400).json({ error: 'You cannot follow yourself' })
        }
        const isFollowing = currentUser.following.includes(id)
        if (isFollowing) {
            //un follow
            await User.findByIdAndUpdate(id, {$pull:{followers:req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$pull:{following:id}})
            //send notifications
            const notification = new Notification({
                type: 'follow',
                from: req.user._id,
                to: id
            })
            await notification.save()
            res.status(200).json({ message: 'User un followed' })
        } else {
            //follow
            await User.findByIdAndUpdate(id, {$push:{followers:req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$push:{following:id}})
            res.status(200).json({ message: 'User followed' })
        }
    } catch (error) {
        console.log(`This error is from SignUp controller. The error is: ${error}`);
        res.status(500).json({error:"Internal Server Error"})
    }
}

//get suggested users exclude already followed users and self account
export const getSuggestedUsers = async(req, res) => {
    try {
        const currentUser = await User.findById(req.user._id)
        if (!currentUser) return res.status(401).json({ error: 'Unauthorized' })
        const following = currentUser.following
        following.push(req.user._id)
        
        const notFollowing = currentUser.followers.filter(follower => !following.includes(follower._id))
        
        const randomUsers = await User.aggregate([
            { $match: { _id: { $nin: following } } },
            { $sample: { size: 3 } }
        ])
        if (!randomUsers) return res.status(404).json({ error: 'No users found' })
            randomUsers.forEach((user)=>(user.password = null))
        res.status(200).json(randomUsers)
    } catch (error) {
        console.log(`This error is from getSuggestedUsers controller. The error is: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// update user with change username, fullName,email,bio and link
export const updateUserProfile = async(req, res) => {
    try {
        const { username, fullName, email, bio, link } = req.body

        //validate username, email
        const usernameRegex = /^[a-zA-Z0-9]+$/
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ msg: 'Invalid username. Username must contain only alphanumeric characters' })
        }
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: 'Invalid email format' })
        }

        // verify fullNAme
        const fullNameRegex = /^[a-zA-Z\s]+$/
        if (!fullNameRegex.test(fullName)) {
            return res.status(400).json({ msg: 'Invalid full name. Full name must contain only alphabetic characters and spaces' })
        }
        // check if change username and email that already exist or not
        const existingUser = await User.findOne({ $or: [{ username }, { email }] })
        if (existingUser && existingUser._id.toString()!== req.user._id.toString()) {
            return res.status(400).json({ msg: 'Username or email already exists' })
        }
        const user = await User.findByIdAndUpdate(req.user._id, { username, fullName, email, bio, link }, { new: true })
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.status(200).json(user)
    } catch (error) {
        console.log(`This error is from updateUserProfile controller. The error is: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//update profile Image
export const updateProfileImage = async(req, res) => {
    try {
        const userId= req.user._id
        const user= await User.findById(userId)
        const {profileImg,coverImg}= req.body
        if (profileImg) {
            if (user.profileImg) {
                 await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg)
            return profileImg = uploadedResponse.secure_url
        }
        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0])
           }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg)
            return coverImg = uploadedResponse.secure_url
        }
        await User.findByIdAndUpdate(userId, { profileImg, coverImg }, {new: true} )
        res.status(200).json("success")
    } catch (error) {
        console.log(`This error is from updateProfileImage controller. The error is: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//change new password
export const changePassword = async(req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword ||!newPassword) {
            return res.status(400).json({ error: 'All fields are required' })
        }
        const user = await User.findById(req.user._id)
        if (!user) return res.status(404).json({ error: 'User not found' })
        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) return res.status(401).json({ error: 'Incorrect current password' })
        //validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ msg: 'Invalid password. Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        await User.findByIdAndUpdate(req.user._id, { password: hashedPassword }, {new:true} )
        res.status(200).json({message:"new password changed successfully"})

    } catch (error) {
        console.log(`This error is from changePassword controller. The error is: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
