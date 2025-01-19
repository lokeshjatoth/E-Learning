import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({});


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
});

export const uploadMedia = async (file) => {
    try{
        const result = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
            folder: "LMS"
        });
        return result;
    } catch(error){
        console.log(error);
    }
}

export const deleteMedia = async (id) => {
    try{
        
        const result = await cloudinary.uploader.destroy(id);
        return result;
    } catch(error){
        console.log(error);
    }
}

export const deleteVideo = async (id) => {
    try{
        const result = await cloudinary.uploader.destroy(id, {resource_type: "video"});
        return result;
    } catch(error){
        console.log(error);
    }
}