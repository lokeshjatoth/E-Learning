/* eslint-disable react/prop-types */
import { useGetPurchaseStatusQuery } from "@/features/api/courseApi";
import { useParams, useNavigate } from "react-router-dom";

const PurchaseCourseProtectedRoute = ({children}) => {
    const {courseId} = useParams();
    const {data, isLoading} = useGetPurchaseStatusQuery(courseId);
    const navigate = useNavigate();

    if(isLoading) return <p>Loading...</p>

    return data?.purchased ? children : (navigate(-1), null);
}
export default PurchaseCourseProtectedRoute;