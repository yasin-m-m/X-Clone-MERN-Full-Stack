import { v2 as cloudinary } from 'cloudinary';
import { Post } from '../model/post.model.js';
import { Notification } from '../model/notification.model.js';
import { User } from '../model/user.model.js';

export const createPost =async(req,res,next)=>{
try {
    const {text} = req.body;
    let {image}= req.body
    if (!text &&!image) {
        return res.status(400).json({error: 'Text or Image field is required'})
    }
    if (image) {
        const uploadedResponse = await cloudinary.uploader.upload(image)
         image=uploadedResponse.secure_url
    }
    const newPost = new Post({
        user: req.user._id.toString(),
        text,
        image,
    })
    await newPost.save()
    res.status(201).json(newPost)

    
} catch (error) {
    console.log(`This error is from createPost controller. The error is: ${error}`);
    res.status(500).json({error:"Internal Server Error"})
}
} 
export const likePost =async(req,res,next)=>{
try {
    const userId = req.user._id
    const user = await User.findById(userId)
    const postId = req.params.id
    const post = await Post.findById(postId)
    if (!post) {
        return res.status(404).json({error: 'Post not found'})
    }
    //like and unlike 

    const userLikedPost = post.likes.includes(userId)
    if (userLikedPost) {
        await Post.updateOne({_id:postId}, {$pull:{likes:userId}})
        await User.updateOne({_id:userId}, {$pull:{likedPost:postId}})
        await post.save()
        await user.save()
        const updatedLikes = post.likes.filter((id)=>id.toString()!==userId.toString())
        res.status(200).json(updatedLikes)
    } else {
        post.likes.push(userId)
        await User.updateOne({_id:userId}, {$push:{likedPost:postId}})
        await post.save()

        //send notification
        const id = post.user
    
            const notification = Notification({
                type: 'like',
                from: req.user._id,
                to: id
            })
            
            await notification.save()
            return res.status(201).json(post.likes)
        
    }
   
} catch (error) {
    console.log(`This error is from likePost controller. The error is: ${error}`);
    res.status(500).json({error:"Internal Server Error"})
}
} 
export const commentPost =async(req,res,next)=>{
try {
    const {text} = req.body

    const postId = req.params.id

    const post = await Post.findById(postId)
 
    const userId = req.user._id
   
    if (!text) {
        return res.status(400).json({error: 'Comment field is required'})
    }
    post.comments.push({
        text,
        user:userId
    })
    
    await post.save()
    //send notification
    const id = post.user

        const notification = Notification({
            type: 'comment',
            from: req.user._id,
            to: id
        })
        
        await notification.save()
        res.status(201).json({post, notification})
    
    
    
   
} catch (error) {
    console.log(`This error is from comment controller. The error is: ${error}`);
    res.status(500).json({error:"Internal Server Error"})
}
} 
export const deletePost =async(req,res,next)=>{
try {
    const id=req.params.id
    const post = await Post.findById(id)
    if (!post) {
        return res.status(404).json({error: 'Post not found'})
    }
    if (String(post.user)!== String(req.user._id)) {
        return res.status(403).json({error: 'You are not authorized to delete this post'})
    }
    if (post.image) {
        const imageId =post.image.split('/').pop().split('.')[0]
        await cloudinary.destroy(imageId)
    }
    await Post.findByIdAndDelete(id)
    res.status(200).json({message: 'Post deleted successfully'})
} catch (error) {
    console.log(`This error is from createPost controller. The error is: ${error}`);
    res.status(500).json({error:"Internal Server Error"})
}
} 

export const getAllPosts = async(req, res) =>{
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: 'user',
            select: ['-password', "-email", "-followers", "-following", "-bio", "-link"]
        }).populate({
            path: "comments.user",
            select: ['-password', "-email", "-followers", "-following", "-bio", "-link"]
        }).populate({
            path: "likes.user",
            select: ['-password', "-email", "-followers", "-following", "-bio", "-link"]
        })
        if (posts.length <= 0) {
            return res.status(404).json({error: 'No posts found'})
        }
        res.status(200).json(posts)
    } catch (error) {
        console.log(`This error is from getAllPosts controller. The error is: ${error}`);
        res.status(500).json({error:"Internal Server Error"})
    }
}
//get liked posts for any user
export const getLikedPosts = async (req, res) => {
    try{
        const userId = req.params.id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }
        const likedPosts = user.likedPost
        const posts = await Post.find({ _id: { $in: likedPosts } }).sort({ createdAt: -1 }).populate({
            path: 'user',
            select: ['-password', "-email", "-followers", "-following", "-bio", "-link"]
        }).populate({
            path: "comments.user",
            select: ['-password', "-email", "-followers", "-following", "-bio", "-link"]
        }).populate({
            path: "likes.user",
            select: ['-password', "-email", "-followers", "-following", "-bio", "-link"]
        })
        if (posts.length <= 0) {
            return res.status(404).json({error: 'No liked posts found'})
        }
        res.status(200).json(posts)
    } catch {
        console.log(`This error is from getLikedPosts controller. The error is: ${error}`);
        res.status(500).json({error:"Internal Server Error"})
    }
}

//get following post
export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }
        const following = user.following
        const posts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 }).populate({
            path: 'user',
            select: ['-password', "-email", "-followers", "-following", "-bio", "-link"]
        }).populate({
            path: "comments.user",
            select: ['-password', "-email", "-followers", "-following", "-bio", "-link"]
        }).populate({
            path: "likes.user",
            select: ['-password', "-email", "-followers", "-following", "-bio", "-link"]
        })
        res.status(200).json(posts)
    } catch (error) {
        console.log(`This error is from getFollowingPosts controller. The error is: ${error}`);
        res.status(500).json({error:"Internal Server Error"})
    }
}

//get users post
export const getUsersPosts = async (req, res) => {
    try {
        const username = req.params.username
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }
        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
            path: 'user',
            select: ['-password', "-email", "-followers", "-following", "-bio", "-link"]
        }).populate({
            path: "comments.user",
            select: ['-password', "-email", "-followers", "-following", "-bio", "-link"]
        }).populate({
            path: "likes.user",
            select: ['-password', "-email", "-followers", "-following", "-bio", "-link"]
        })
        if (posts.length <= 0) {
            return res.status(404).json({error: 'No posts found'})
        }
        res.status(200).json(posts)

    } catch (error) {
        console.log(`This error is from getUsersPosts controller. The error is: ${error}`);
        res.status(500).json({error:"Internal Server Error"})
        
    }
}

