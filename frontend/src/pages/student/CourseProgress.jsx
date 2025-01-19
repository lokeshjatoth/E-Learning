import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { useGetCourseProgressQuery, useMarkAsCompletedMutation, useMarkAsInCompletedMutation, useUpdateLectureProgressMutation } from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";


const CourseProgress = () => {
    
    const param = useParams();
    const courseId = param.courseId;

    const {data, isLoading, isError, refetch} = useGetCourseProgressQuery(courseId);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [updateLectureProgress] = useUpdateLectureProgressMutation();
    const [markAsCompleted, {data: markAsCompletedData, isSuccess: markAsCompletedSuccess}] = useMarkAsCompletedMutation();
    const [markAsInCompleted, {data: markAsInCompletedData, isSuccess: markAsInCompletedSuccess}] = useMarkAsInCompletedMutation();
    useEffect(() => {
        if(markAsCompletedSuccess){
            toast.success(markAsCompletedData.message);
        }
    }, [markAsCompletedSuccess, markAsCompletedData]);

    useEffect(() => {
        if(markAsInCompletedSuccess){
            toast.success(markAsInCompletedData.message);
        }
    }, [markAsInCompletedSuccess, markAsInCompletedData]);


    
    
    
    
    if(isLoading) return <p>Loading...</p>
    if(isError) return <p>Failed to load course Progress {isError.message}</p>
    

    const {courseDetails, progress, completed} = data.data;
    const {courseTitle} = courseDetails;

    const initialLecture = courseDetails?.lectures[0];

    const isLectureCompleted = (lectureId) =>{
        return progress?.some((prog) => prog.lectureId === lectureId && prog.viewed);
    }

    const handleSelectLecture = (lecture) => {
        setCurrentLecture(lecture);
    }

    const handleLectureProgress = async (lectureId) => {
        await updateLectureProgress({courseId, lectureId});
        refetch();
    }

    const handleCompleteCourse = async () => {
        await markAsCompleted(courseId);
        refetch();
    }

    const handleIncompleteCourse = async () => {
        await markAsInCompleted(courseId);
        refetch();
    }
    
    
  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
        <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">{courseTitle}</h1>
            <Button onClick={completed ? handleIncompleteCourse : handleCompleteCourse} variant={completed ? "outline" : "default"}>{completed ? <div className="flex items-center gap-2"><CheckCircle/> <span>Completed</span></div> : "Mark as Complete"}</Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
                <div>
                    <video
                        src={currentLecture?.videoUrl || initialLecture?.videoUrl}
                        controls
                        className="w-full h-auto md:rounded-lg"
                        onEnded={() => handleLectureProgress(currentLecture?._id || initialLecture?._id)}
                    />
                </div>
                {/* Display current watching lecture title */}
                <div className="mt-3">
                    <h3 className="font-medium text-lg">{`Lecture ${courseDetails?.lectures.findIndex((l) => l._id === (currentLecture?._id || initialLecture?._id)) + 1} : ${currentLecture?.lectureTitle || initialLecture?.lectureTitle}`}</h3>
                </div>
            </div>
            <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
                <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
                <div className="flex-1 overflow-auto">
                    {
                        courseDetails?.lectures.map((lecture, index)=>(
                            <Card key={index} className={`mb-3 hover:cursor-pointer transition transform hover:shadow-lg ${lecture._id === (currentLecture?._id || initialLecture?._id) ? "bg-gray-100 text-black" : ""}`} onClick={() => handleSelectLecture(lecture)}>
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center">
                                        {
                                            isLectureCompleted(lecture._id) ? <CheckCircle2 className="text-green-500 mr-2" size={24}/> : <CirclePlay className="text-gray-500 mr-2" size={24}/>
                                        }
                                        <div>
                                            <CardTitle className="font-medium text-lg">{lecture.lectureTitle}</CardTitle>
                                        </div>
                                    </div>
                                    {
                                        isLectureCompleted(lecture._id) && (
                                            <Badge className="bg-green-200 hover:bg-green-300 text-green-600" variant="outline">Completed</Badge>
                                        )
                                    }
                                    
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default CourseProgress