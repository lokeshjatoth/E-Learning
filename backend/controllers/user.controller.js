import zod from "zod";
import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";


const registerSchema = zod.object({
    name: zod.string().min(1, "Name is required"),
    email: zod.string().email("Invalid email"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
})
export const register = async(req, res)=>{
    try{
        
        const obj = registerSchema.safeParse(req.body);
        
        if(!obj.success){
            return res.status(400).json({
                message: "Invalid inputs", 
                error: obj.error.errors
            });
        }
        
        
        const email  = obj.data.email;
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        
        const hashedPassword = await bcrypt.hash(obj.data.password, 10);
        obj.data.password = hashedPassword;

        const newUser = await User.create(obj.data);
        generateToken(res, newUser, `Welcome to E-Learning ${newUser.name}`);
        
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register",
            error: error.message
        });
    }
}

const loginSchema = zod.object({
    email: zod.string().email("Invalid email"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
})
export const login = async (req, res) =>{
    try{
        
        const obj = loginSchema.safeParse(req.body);
        
        if(!obj.success){
            return res.status(400).json({
                message: "Invalid inputs", 
                error: obj.error.errors
            });
        }

        const email = obj.data.email;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not Registered",

            })
        }

        const isMatch = await bcrypt.compare(obj.data.password, user.password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            })
        }

        generateToken(res, user, `Welcome back ${user.name}`);


    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login",
            error: error.message
        });
    }
}

export const logout = async (req, res) =>{
    try{
        return res.status(200).clearCookie("token").json({
            success: true,
            message: "Logged out successfully"
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to logout",
            error: error.message
        });
    }
}

export const getUserProfile = async (req, res) => {
    try{
        const userId = req.id;
        const user = await User.findById(userId)
        .select("-password") 
        .populate({
            path: "enrolledCourses", 
            populate: {
                path: "creator", 
                select: "name photoUrl", 
            },
        });

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load user",
            error: error.message
        });
    }
}



export const updateProfile = async (req, res) => {
    try{
        const userId = req.id;
        const { name } = req.body;
        const profilePhoto = req.file;
        if(!name && !profilePhoto){
            return res.status(400).json({
                success: false,
                message: "Name or Profile photo is required"
            });
        }

        

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"    
            });
        }

        let photoUrl = user.photoUrl; 

        if (profilePhoto) {
            if (user.photoUrl) {
                const publicId = user.photoUrl.split("/image/upload/")[1].replace(/^v\d+\//, "").split(".")[0];
                deleteMedia(publicId);
            }
            const cloudResponse = await uploadMedia(profilePhoto.path);
            photoUrl = cloudResponse.secure_url;
        }

        const updatedData = {};
        if (name) updatedData.name = name; 
        if (profilePhoto) updatedData.photoUrl = photoUrl;
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new: true}).select("-password");

        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully"
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load user",
            error: error.message
        });
    }
}