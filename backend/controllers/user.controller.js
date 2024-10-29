import { User } from "../model/user.model.js";

//get single user profile
export const getProfile= async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.json(user)
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