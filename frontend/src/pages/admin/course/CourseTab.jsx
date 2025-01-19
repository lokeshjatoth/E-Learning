import LoadingSpinner from "@/components/LoadingSpinner";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup, 
    SelectLabel
  } from "@/components/ui/select"
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";


const CourseTab = () => {
    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
    });
    const params = useParams();
    const courseId = params.courseId;
    const {data: courseByIdData, isLoading: courseByIdLoading, refetch} = useGetCourseByIdQuery(courseId, {refetchOnMountOrArgChange: true});
    const [editCourse, {data, error, isSuccess,isLoading}] = useEditCourseMutation()
    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const navigate = useNavigate();

    const [publishCOurse] = usePublishCourseMutation();
    
    
    
    useEffect(()=>{
        if(courseByIdData?.course){
            const course = courseByIdData?.course;
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: ""
            });
        }    
    }, [courseByIdData])
    const changeEventHandler = (e) =>{
        const {name, value} = e.target;
        setInput({...input, [name]: value})
    }

    const selectCategoryHandler = (value) => {
        setInput({...input, category: value})
    }

    const selectCourseLevelHandler = (value) => {
        setInput({...input, courseLevel: value})
    }

    const selectThumbnail = (e) =>{
        const file = e.target.files[0];
        if(file){ 
            setInput({...input, courseThumbnail: file});
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setPreviewThumbnail(fileReader.result);
            }
            fileReader.readAsDataURL(file);
        }

    }

    const updateHandler = async() =>{
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle.trim());
        formData.append("subTitle", input.subTitle.trim());
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);
        formData.append("courseThumbnail", input.courseThumbnail);

        await editCourse({formData, courseId});
    }

    const publishStatusHandler = async(action) => {
        try{
            const response = await publishCOurse({courseId, query: action});
            if(response.data){
                refetch();
                toast.success(response.data.message);
            } 
        } catch(error){
            toast.error(error.data?.message || "Failed to publish course");
        }
    }

    useEffect(() => {
        if(isSuccess){
            toast.success(data?.message || "Course updated successfully");
        }
        if(error){
            toast.error(error.data?.message||"Failed to update course");
        }
    }, [isSuccess, error, data]);

    if(courseByIdLoading) return <LoadingSpinner/>;
  return (
    <Card>
        <CardHeader className="flex justify-between flex-row">
            <div>
                <CardTitle>Basic Course information</CardTitle>
                <CardDescription>{"Make changes to your courses here. Click save when you're done"}.</CardDescription>
            </div>
            <div className="space-x-2">
                <Button variant="outline" disabled={courseByIdData?.course?.lectures?.length === 0} onClick={()=>publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}>
                    {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
                </Button>
                <Button>Remove Course</Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4 mt-5">
                <div className="">
                    <Label>Title</Label>
                    <Input 
                        type="text"
                        name="courseTitle"
                        value={input.courseTitle}
                        onChange={changeEventHandler}
                        placeholder="Ex. FullStack Developer"
                    />
                </div>
                <div>
                    <Label>Subtitle</Label>
                    <Input 
                        type="text"
                        name="subTitle"
                        value={input.subTitle}
                        onChange={changeEventHandler}
                        placeholder="Ex. Become a fullStack developer from zero to hero in 2 months"
                    />
                </div>
                <div>
                    <Label>Description</Label>
                    <RichTextEditor input={input} setInput={setInput}/>
                </div>
                <div className="flex items-center gap-5">
                <div>
                    <Label>Category</Label>
                    <Select onValueChange={selectCategoryHandler}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Category" />
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
                <div>
                    <Label>Course Level</Label>
                    <Select onValueChange={selectCourseLevelHandler}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Course Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Course Level</SelectLabel>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Price</Label>
                    <Input
                        type="number"
                        name="coursePrice"
                        value={input.coursePrice}
                        onChange={changeEventHandler}
                        placeholder="199"
                        className="w-fit"
                    />
                </div>
                </div>
                <div>
                    <Label>Thumbnail</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        className="w-fit"
                        onChange={selectThumbnail}
                    />
                    {
                        previewThumbnail && (
                            <img src={previewThumbnail} alt="course thumbnail" className="w-56 h-56 object-cover rounded-lg" />
                        )
                    }
                </div>
                <div>
                    <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button disabled={isLoading} onClick={updateHandler}>
                        {
                            isLoading ? (<>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Please wait...
                            </>) : ("Save")
                        }
                    </Button>
                    
                </div>
            </div>
        </CardContent>
    </Card>
  )
}

export default CourseTab