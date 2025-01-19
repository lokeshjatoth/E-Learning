import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi"
import { useNavigate, useParams } from "react-router-dom"
import { Loader2 } from "lucide-react"


const MEDIA_API = `${import.meta.env.VITE_BASE_URL}/api/v1/media/`;
const LectureTab = () => {

    const [lectureTitle, setLectureTitle] = useState("");
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const params = useParams();
    const {courseId, lectureId} = params;
    const {data: lectureData} = useGetLectureByIdQuery({lectureId});
    const navigate = useNavigate();

    const [editLecture, {data, isLoading, error, isSuccess}] = useEditLectureMutation();
    const [removeLecture, {data: removeData ,isLoading: removeLoading, error: removeError, isSuccess: removeSuccess}] = useRemoveLectureMutation();

    const fileChangeHandler = async(e) =>{
        const file = e.target.files[0];
        if(file){
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(true);
            try{
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress:({loaded, total}) =>{
                        setUploadProgress(Math.round((loaded * 100) / total));
                    }
                })

                if(res.data.success){
                    setUploadVideoInfo({videoUrl: res.data.data.url, publicId: res.data.data.public_id});
                    toast.success(res.data.message);    
                }
            } catch(error){
                toast.error("video upload failed ", error.message);
            } finally{
                setMediaProgress(false);
            }
        }
    }

    const editLectureHandler = async() => {
        const lectureData = {
            lectureTitle,
            videoInfo: uploadVideoInfo,
            courseId,
            lectureId,
            isPreviewFree: isFree,
        }
        editLecture(lectureData);
    }

    const removeLectureHandler = async() => {
        await removeLecture({courseId, lectureId});
    }

    useEffect(()=>{
        if(lectureData){
            setLectureTitle(lectureData.lecture.lectureTitle);
            setUploadVideoInfo({videoUrl: lectureData.lecture.videoUrl, publicId: lectureData.lecture.publicId});
            setIsFree(lectureData.lecture.isPreviewFree);
        }
    }, [lectureData]);

    useEffect(() => {
        if(isSuccess){
            toast.success(data.message);
        }
        if(error){
            toast.error(error.data.message);
        }
    }, [isSuccess, error, data]);

    useEffect(()=>{
        if(removeSuccess){
            toast.success(removeData.message);
            navigate(-1);
        }
        if(removeError){
            toast.error(removeError.data.message);
        }
    }, [removeSuccess, removeError, removeData, navigate]);

  return (
    <div>
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>
                        Make changes and click save when done.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="destructive" onClick={removeLectureHandler} disabled={removeLoading}>{
                        removeLoading ? <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Removing...
                        </> : "Remove Lecture"
                    }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        placeholder="Ex. Introduction to Javascript" 
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                    />
                </div>
                <div className="">
                    <Label>Video<span className="text-red-500">*</span></Label>
                    <Input
                        type="file"
                        accept="video/*"
                        onChange={fileChangeHandler}
                        placeholder="Ex. Introduction to Javascript"
                        className="w-fit cursor-pointer"
                    />    
                </div>
                <div className="flex items-center space-x-2 my-5">
                    <Switch id="airplane-mode" checked={isFree} onCheckedChange={setIsFree}/>
                    <Label htmlFor="airplane-mode">Is this video FREE?</Label>
                </div>
                {
                    mediaProgress && (
                        <div className="my-4">
                            <Progress value={uploadProgress} />
                            <p>{uploadProgress}% uploaded</p>
                        </div>
                    )
                }
                <div className="mt-4">
                    <Button disabled={isLoading} onClick={editLectureHandler}>
                        {isLoading ? <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                        </> : "update Lecture"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default LectureTab