import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
    },
    viewed: {
        type: Boolean,
        default: false
    }
});

const courseProgressSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        
    }, 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    completedLectures: [
        lectureProgressSchema
    ],
    completed:{type: Boolean, default: false},
    
}, {timestamps: true});

export const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);