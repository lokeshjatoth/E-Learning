
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useGetPurchaseStatusQuery, usePaymentMutation, useVerificationMutation } from "@/features/api/courseApi";

import { BadgeInfo, Loader2, Lock, PlayCircle } from "lucide-react"
import { useEffect } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";



const CourseDetail = () => {
    const params = useParams();
    const courseId = params?.courseId;
    const [payment, {isLoading}] = usePaymentMutation();
    const [verification, {data, isError, isSuccess}] = useVerificationMutation();
    const {data: getPurchaseStatusData, isLoading: getPurchaseStatusLoading, isError: getPurchaseStatusError, refetch} = useGetPurchaseStatusQuery(courseId);
    const navigate = useNavigate();

    

    const course = getPurchaseStatusData?.course;
    const purchased = getPurchaseStatusData?.purchased;

    
    const purchaseHandler = async (e) => {
        e.preventDefault();
        
        try {
            const response = await payment(courseId); // API call to create an order
    
            const options = {
                key: response?.key, // Razorpay Key ID
                amount: response?.amount, // Amount in subunits
                currency: "INR",
                name: "E-Learning",
                description: "Test Transaction",
                image: "https://e-learning/your_logo",
                order_id: response?.data?.order?.id, // Backend-provided order ID
                prefill: {
                    name: "Gaurav Kumar",
                    email: "gaurav.kumar@example.com",
                    contact: "9000090000",
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#3399cc",
                },
                // Successful payment handler
                handler: function (response) {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
                    verification({ razorpay_payment_id, razorpay_order_id, razorpay_signature, courseId });
                },
            };
    
            const rzp1 = new window.Razorpay(options);
    
            // Event for failed payments
            rzp1.on('payment.failed', function (response) {
                console.error("Payment Failed Event Triggered:", response);
                alert(response.error.description || "Payment failed. Please try again.");
            });
    
            // Event for modal closure
            rzp1.on('modal.closed', function () {
                console.warn("Payment modal closed.");
                alert("Payment was not completed. Please try again.");
            });
    
            // Open Razorpay modal
            rzp1.open();
        } catch (error) {
            console.error("Error in purchaseHandler:", error);
            alert("An error occurred while initializing the payment. Please try again.");
        }
    }

    const handleContinueCourse = () =>{
        if(purchased){
            navigate(`/course-progress/${courseId}`);
        }
    }
    
    useEffect(() => { 
        if(isSuccess){
            toast.success(data?.message);
            refetch();
        }
        if(isError){
            toast.error(data?.message);
        }
    }, [isError, isSuccess, data, refetch]);
    
    if(getPurchaseStatusLoading) return <h1>Loading...</h1>
    if(getPurchaseStatusError) return <h1>Something went wrong</h1>
    

  return (
    <div className="space-y-5">
        <div className="bg-[#2D2F31] text-white">
            <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
                <h1 className="font-bold text-2xl md:text-3xl">{course?.courseTitle}</h1>
                <p className="text-base md:text-lg">Course Sub-title</p>
                <p>Created By <span className="text-[#FFD700] underline italic">{course?.creator?.name}</span></p>
                <div className="flex items-center gap-2 text-sm">
                    <BadgeInfo size={16}/>
                    <p>Last updated on {course?.updatedAt.split("T")[0]}</p>
                </div>
                <p>Students enrolled: {course?.enrolledStudents.length}</p>
            </div>
        </div>
        <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
            <div className="w-full lg:w-1/2 space-y-5">
                <h1 className="font-bold text-xl md:text-2xl">Description</h1>
                <p className="text-sm" dangerouslySetInnerHTML={{__html: course?.description}}/>
                <Card>
                    <CardHeader>
                        <CardTitle>Course Content</CardTitle>
                        <CardDescription>
                            {course?.lectures.length} lectures
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {
                            course?.lectures.map((lecture, index)=>(
                                <div key={index} className="flex items-center gap-3 text-sm">
                                    <span>
                                        {lecture.isPreviewFree ? <PlayCircle size={14}/> : <Lock size={14}/>}
                                    </span>
                                    <p>{lecture.lectureTitle}</p>
                                </div>
                            ))
                        }
                    </CardContent>
                </Card>
            </div>
            <div className="w-full lg:w-1/3">
                <Card>
                    <CardContent className="p-4 flex flex-col">
                        <div className="w-full aspect-video mb-4">
                            <ReactPlayer url={course?.lectures[0]?.videoUrl} controls width="100%" height="100%"/> 
                            {/* player */}
                        </div>
                        <h1>{course?.lectures[0]?.lectureTitle}</h1>
                        <Separator className="my-2"/>
                        <h1 className="text-lg font-semibold md:text-xl">{course?.coursePrice}₹</h1>
                    </CardContent>
                    <CardFooter className="flex justify-center p-4">
                        {
                            purchased ? <Button className="bg-green-500 hover:bg-green-600 font-bold" onClick={handleContinueCourse}>Continue Learning</Button> : <Button className="bg-purple-500 hover:bg-purple-600 font-bold" onClick={purchaseHandler}>{
                                isLoading ? <>
                                    <Loader2 className="mr-2 animate-spin"/>
                                    Please Wait...
                                </> : "Buy Now"
                            }</Button>
                        }
                        
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
  )
}

export default CourseDetail