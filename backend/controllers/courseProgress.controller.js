import { CourseProgress } from "../models/courseProgress.model.js";
import { Course } from "../models/course.model.js";
import { PurchaseCourse } from "../models/purchaseCourse.model.js";


export const getCourseProgress = async (req, res) => {
    try {
        const {courseId} = req.params;
        const userId = req.id;

        const hasAccess = await PurchaseCourse.findOne({
                userId,
                courseId
              });
        if (!hasAccess) {
            return res.status(403).json({ error: "Access Denied" });
        }

        let courseProgress = await CourseProgress.findOne({courseId, userId}).populate("courseId");

        const courseDetails = await Course.findById(courseId).populate("lectures");

        if(!courseDetails){
            return res.status(404).json({
                message: "Course not found"
            })
        }

        if(!courseProgress){
            return res.status(200).json({
                data:{
                    courseDetails,
                    progress:[],
                    completed: false
                }
            })
        }

        return res.status(200).json({
            data:{
                courseDetails,
                progress: courseProgress.completedLectures,
                completed: courseProgress.completed
            }
        })
    } catch (error) {
        console.log(error);
    }
}



export const updateLectureProgress = async (req, res) => {
    try {
        const {courseId, lectureId} = req.params;
        const userId = req.id;

        let courseProgress = await CourseProgress.findOne({courseId, userId}).populate("courseId");

        if(!courseProgress){
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed: false,
                completedLectures: [],
            })
        }

        const lectureIndex = courseProgress.completedLectures.findIndex(lecture => lecture.lectureId.toString() === lectureId);
        
        if(lectureIndex === -1){
            courseProgress.completedLectures.push({
                lectureId,
                viewed: true
            });
        }else{
            courseProgress.completedLectures[lectureIndex].viewed = true;
        }

        const lectureProgressLength = courseProgress.completedLectures.filter(lecture => lecture.viewed).length;

        const course = await Course.findById(courseId);


        if(lectureProgressLength === course.lectures.length){
            courseProgress.completed = true;
        }

        await courseProgress.save();

        return res.status(200).json({
            message: "Lecture progress updated successfully"
        })

    } catch (error) {
        console.log(error);
    }
}

export const markAsCompleted = async (req, res) => {
    try {
        const {courseId} = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId, userId});

        if(!courseProgress){
            return res.status(404).json({
                message: "Course progress not found"
            })
        }

        courseProgress.completedLectures.map((lectureProgress) => lectureProgress.viewed = true);

        courseProgress.completed = true;

        await courseProgress.save();
        
        return res.status(200).json({
            message: "Course marked as completed successfully"
        })
    } catch (error) {
        console.log(error);
    }
}

export const markAsInCompleted = async (req, res) => {
    try {
        const {courseId} = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId, userId});

        if(!courseProgress){
            return res.status(404).json({
                message: "Course progress not found"
            })
        }

        courseProgress.completedLectures.map((lectureProgress) => lectureProgress.viewed = false);

        courseProgress.completed = false;

        await courseProgress.save();
        
        return res.status(200).json({
            message: "Course marked as Incompleted successfully"
        })
    } catch (error) {
        console.log(error);
    }
}