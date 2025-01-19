import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import LectureTab from "./LectureTab";


const EditLecture = () => {
    const navigate = useNavigate();
  return (
    <div>
        <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" className="rounded-full" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16}/>
                </Button>
                <h1 className="font-bold text-xl">Update Your Lecture</h1>
            </div>
        </div>
        <LectureTab/>
    </div>
    
  )
}

export default EditLecture