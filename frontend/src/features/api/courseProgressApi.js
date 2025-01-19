import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_API = `${import.meta.env.VITE_BASE_URL}/api/v1/progress/`;

export const courseProgressApi = createApi({
    reducerPath: 'courseProgressApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: BASE_API,
        credentials: 'include' 
    }),
    endpoints: (builder) => ({
        getCourseProgress: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: 'GET'
            })
        }),
        updateLectureProgress: builder.mutation({
            query: ({courseId, lectureId}) => ({
                url: `/${courseId}/lecture/${lectureId}/view`,
                method: 'POST'
            })
        }),
        markAsCompleted: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}/complete`,
                method: 'POST'
            })
        }),
        markAsInCompleted: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}/incomplete`,
                method: 'POST'
            })
        }),
    }),
});

export const {
    useGetCourseProgressQuery,
    useUpdateLectureProgressMutation,
    useMarkAsCompletedMutation,
    useMarkAsInCompletedMutation
} = courseProgressApi;