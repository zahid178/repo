import Post from "../models/posts.model.js";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";

import bcrypt from "bcrypt";

export const activeCheck = async (req, res) => {
    return res.status(200).json({message: "RUNNING"})
}

export const createPost = async (req, res) => {
    const { token} = req.body;
    try{
       const user = await User.findOne({ token: token});
       if(!user) {
           return res.status(404).json({ message: "User not found"})
       }
       const post = new Post({
        userId: user._id,
        body: req.body.body,
        media: req.file != undefined ? req.file.filename: "",
        fileType : req.file != undefined ? req.file.mimetype.split("/")[1] : ""
       })
       await post.save();
       return res.status(200).json({ message: "Post Created"})
    } 
    catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

 export const getAllPosts = async (req, res) => {
    try{
      const posts = await Post.find().populate('userId', 'name username email profilePicture')
      return res.json({ posts })
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
 }

export const deletePost = async (req, res) => {
    const { token, post_id} = req.body;
    try{
        const user = await User
        .findOne({ token: token})
        .select("_id")
        if(!user) {
            return res.status(404).json({ message:"User not found" })
        }
       const post = await Post.findOne({ _id: post_id});
       if(!post) {
            return res.status(404).json({ message: "Post not found"})
       }
       if(post.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized"})
       }
       await Post.deletePost({ _id: post_id});
       return res.json({ message: "Post deleted"})
} catch(error) {
    return res.status(500).json({ message: error.message })
 }
}

export const commentPost = async (req, res) => {
    const {token, post_id, commentBody} = req.body;
    try{
        const user = await User.findOne({ token : token}).select("_id");
       if(!user) {
        return res.status(404).json({ message:"User not found" })
       }
       const post = await Post.findOne({
        _id: post_id
       });
       if(!post) {
        return res.status(404).json({ message:"Post not found" })
       }
       const comment = new Comment({
        userId: user._id,
        postId: post_id,
        commentBody: commentBody
       });
       await comment.save();
       return res.status(200).json({ message: "Comment Added" })
    }
    catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

export const get_comments_by_post = async(req, res) => {
    const { post_id } = req.params;
    try{
     const post = await Post.findOne({ _id: post_id});
     if(!post) {
         return res.status(404).json({ message: "Post not found"})
     }
     return res.json({ comments: post.comments})
    }

  catch(error) {
    return res.status(500).json({ message: error.message })
 }
}

export const delete_comment_of_user = async (req, res) => {
    const { token, comment_id} = req.body;
    try{
      const user = await User
      .findONe({ token: token})
      .select("_id");
      if(!user) {
        return res.status(404).json({ message: "User not found"})
      }
      const comment = await Comment.findOne({ "_id" : comment_id })
      if(!comment) {
        return res.status(404).json({ message: "Comment not found"})
      }
      if(comment.userId.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized"})
      }
      await Comment.deleteOne({ "_id" : comment_id })
      res.json({ message: "Comment deleted"})
    }catch(error) {
    return res.status(500).json({ message: error.message })
 }
}

export const icrement_likes = async (req, res) => {
    const {post_id} = req.body;
  try{
       const post = await Post.findOne({ _id: post_id });
       if(!post) {
        return res.status(404).json({ message: "Post not found"})
       }
       post.likes = post.likes + 1;
       await post.save();
       return res.json({ message: "Likes incremented"})
   }catch(error) {
    return res.status(500).json({ message: "Likes not incremented"})
 }  
}