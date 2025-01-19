import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup, 
  SelectLabel
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useCreateCourseMutation } from "@/features/api/courseApi"
import { toast } from "sonner"



const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [createCourse, { data, error,isLoading, isSuccess }] = useCreateCourseMutation();
  
  const navigate = useNavigate();

  const createCourseHandler = async () => {
    if (!courseTitle || !category) {
      toast.error("Both course title and category are required!");
      return;
    }
    await createCourse({ courseTitle, category });
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created successfully");
      navigate(-1);
    }
    if (error) {
      toast.error("Failed to create the course");
    }
  }, [isSuccess, error, data, navigate]);
  return (
    <div className="flex-1 mx-10">
        <div className="mb-4">
            <h1 className="text-xl font-bold">Lets add course, add some basic details for your new course</h1>
            <p className="text-sm">Please fill in the required fields to create a new course.</p>
        </div>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Enter course title"
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={(value)=>setCategory(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Next JS">Next JS</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Frontend Development">
                    Frontend Development
                  </SelectItem>
                  <SelectItem value="Fullstack Development">
                    Fullstack Development
                  </SelectItem>
                  <SelectItem value="MERN Stack Development">
                    MERN Stack Development
                  </SelectItem>
                  <SelectItem value="Javascript">Javascript</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Docker">Docker</SelectItem>
                  <SelectItem value="MongoDB">MongoDB</SelectItem>
                  <SelectItem value="HTML">HTML</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 items-center">
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
            <Button disabled={isLoading} onClick={createCourseHandler}>
              {
                isLoading ? (<>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  please wait...
                </>) : ("Create")
              }
            </Button>
          </div>
        </div>
    </div>
  )
}

export default AddCourse