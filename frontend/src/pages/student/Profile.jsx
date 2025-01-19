import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Course from "./Course"
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi"
import { useEffect, useState } from "react"
import { toast } from "sonner"

  


const Profile = () => {
    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const {data, isLoading, refetch} = useLoadUserQuery();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [updateUser, {data:updateUserData, isLoading:updateIsLoading, error, isSuccess}] = useUpdateUserMutation();
    
    
    
    
    const onChangeHandler = (e) => {
        const file = e.target.files[0];
        if(file) setProfilePhoto(file);
    }
    
    const updateUserHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("profilePhoto", profilePhoto);
        await updateUser(formData);
    };

    useEffect(() => {
        if (isSuccess) {
            refetch();
            setName(""); 
            setProfilePhoto(null); 
            setIsDialogOpen(false);
            toast.success(updateUserData?.message || "Profile Updated Successfully");
        } else if (error) {
            toast.error(error?.data?.message || "An error occurred");
        }
    }, [isSuccess, error, updateUserData, refetch]);

    if(isLoading) return <h1>Profile Loading...</h1>
    

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 md:px-0">
        <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
            <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 md:w-32 md:h-32 mb-4">
                    <AvatarImage src={data?.user?.photoUrl ||"https://github.com/shadcn.png"} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <div className="w-full md:w-auto text-center md:text-left">
                <div className="mb-2">
                    <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                        Name: 
                        <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">{data?.user?.name}</span>
                    </h1>
                </div>
                <div className="mb-2">
                    <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                        Email: 
                        <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">{data?.user?.email}</span>
                    </h1>
                </div>
                <div className="mb-2">
                    <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                        Role: 
                        <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">{data?.user?.role.toUpperCase()}</span>
                    </h1>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger><Button size="sm" className="mt-2">Edit Profile</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            {"Make changes to your profile here. Click save when you're done."}
                        </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Name</Label>
                                <Input className="col-span-3"
                                onChange={(e) => setName(e.target.value)} type="text" placeholder="Name"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Profile Photo</Label>
                                <Input onChange={onChangeHandler} className="col-span-3" type="file" 
                                accept="image/*"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button disabled={updateIsLoading} onClick={updateUserHandler}>
                                {updateIsLoading ? <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait...
                                </> : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
        <div>
            <h1 className="font-medium text-lg">{"Courses you're enrolled in"}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
                {
                    data?.user?.enrolledCourses.length === 0 ? <h1>{"You haven't enrolled in any course"}</h1> : (
                        data?.user?.enrolledCourses.map((course) => <Course course={course} key={course._id}/>)
                    )
                }
            </div>
        </div>
    </div>
  )
}

export default Profile