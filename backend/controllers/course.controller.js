import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = async (req, res)=>{
    try{
        
        const {courseTitle, category} = req.body;
        if(!courseTitle || !category){
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const course = await Course.create({courseTitle, category, creator: req.id});

        return res.status(200).json({
            message: "Course created successfully",
            course
        })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course",
        })
    }
}


export const getCreatorCourses = async (req, res)=>{
    try {
        const courses = await Course.find({creator: req.id});
        if(!courses){
            return res.status(404).json({
                courses:[],
                message: "No courses found"
            })
        }
        return res.status(200).json({
            message: "Admin courses fetched successfully",
            courses
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Failed to get Admin courses",
        })
    }
}

export const editCourse = async (req, res)=>{
    try{
        const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(req.params.courseId);
        if(!course){
            return res.status(404).json({
                message: "Course not found"
            })
        }

        let coursePhoto;
        if(thumbnail){
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/image/upload/")[1].replace(/^v\d+\//, "").split(".")[0];
                await deleteMedia(publicId);
            }
            coursePhoto = await uploadMedia(thumbnail.path);
            
        }

        const updatedData = {courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail: coursePhoto.secure_url};

        course = await Course.findByIdAndUpdate(req.params.courseId, updatedData, {new: true});

        return res.status(200).json({
            message: "Course updated successfully",
            course
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Failed to edit course",
        })
    }
}

export const getCourseById = async (req, res)=>{
    try{
        const course = await Course.findById(req.params.courseId);
        if(!course){
            return res.status(404).json({
                message: "Course not found"
            })
        }
        return res.status(200).json({
            message: "Course fetched successfully",
            course
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Failed to get course by id",
        })
    }
}


export const createLecture = async (req, res)=>{
    try{
        const {lectureTitle} = req.body;
        const {courseId} = req.params;
        
        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message: "Course not found"
            })
        }

        const lecture = await Lecture.create({lectureTitle});
        course.lectures.push(lecture._id);
        await course.save();
        return res.status(201).json({
            message: "Lecture created successfully",
            lecture
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Failed to create lecture",
        })
    }
}

export const getCourseLectures = async (req, res)=>{
    try{
        const course = await Course.findById(req.params.courseId).populate("lectures");
        if(!course){
            return res.status(404).json({
                message: "Course not found"
            })
        }
        return res.status(200).json({
            message: "Course lectures fetched successfully",
            lectures: course.lectures
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Failed to get course lectures",
        })
    }
}

export const editLecture = async (req, res)=>{
    try{
        const {lectureTitle, videoInfo, isPreviewFree} = req.body;
        const {courseId, lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message: "Lecture not found"
            })
        }

        if(lectureTitle) lecture.lectureTitle = lectureTitle;
        if(videoInfo.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if(videoInfo.publicId) lecture.publicId = videoInfo.publicId;
        if(isPreviewFree) lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        const course = await Course.findById(courseId);
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(200).json({
            message: "Lecture updated successfully",
            lecture
        })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Failed to edit lecture",
        })
    }
}

export const removeLecture = async (req, res)=>{
    try {
        const {lectureId, courseId} = req.params;

        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message: "Course not found"
            })
        }

        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message: "Lecture not found"
            })
        }

        if(lecture.publicId){
            await deleteMedia(lecture.publicId);
        }

        course.lectures.pull(lecture._id);
        await course.save();
        await Lecture.findByIdAndDelete(lectureId);

        return res.status(200).json({
            message: "Lecture deleted successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove lecture",
        })
    }
}

export const getLectureById = async (req, res)=>{
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message: "Lecture not found"
            })
        }
        return res.status(200).json({
            lecture
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lecture by id",
        })
    }
}

export const togglePublishCourse = async (req, res)=>{
    try {
        const {courseId} = req.params;
        const {publish} = req.query;

        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message: "Course not found"
            })
        }

        course.isPublished = publish === "true" ? true : false;
        await course.save();
        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message: `Course ${statusMessage} successfully`,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to toggle publish course",
        })
    }
}

export const searchCourse = async (req, res) => {
    try {
        const { query = "", categories = [], sortByPrice = "" } = req.query;

        // Normalize `categories` to always be an array
        const parsedCategories = Array.isArray(categories)
            ? categories
            : typeof categories === "string"
            ? categories.split(",")
            : [];

        // Build search criteria
        const searchCriteria = {
            isPublished: true,
            ...(query && {
                $or: [
                    { courseTitle: { $regex: query, $options: "i" } },
                    { subTitle: { $regex: query, $options: "i" } },
                    { category: { $regex: query, $options: "i" } },
                ],
            }),
        };

        if (parsedCategories.length > 0) {
            searchCriteria.category = { $in: parsedCategories };
        }

        // Sorting options
        const sortOptions = {};
        if (sortByPrice === "low") {
            sortOptions.coursePrice = 1;
        } else if (sortByPrice === "high") {
            sortOptions.coursePrice = -1;
        }

        // Query the database
        const courses = await Course.find(searchCriteria)
            .populate({ path: "creator", select: "name photoUrl" })
            .sort(sortOptions);


        return res.status(200).json({
            success: true,
            courses: courses || [],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while searching courses",
            error: error.message,
        });
    }
};



export const getPublishedCourses = async (req, res)=>{
    try {
        const courses = await Course.find({isPublished: true}).populate({path: "creator", select: "name photoUrl"});
        if(!courses){
            return res.status(404).json({
                message: "No published courses found"
            })
        }
        return res.status(200).json({
            courses
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get published courses",
        })
    }
}