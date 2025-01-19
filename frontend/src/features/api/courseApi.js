import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = `${import.meta.env.VITE_BASE_URL}/api/v1/course`

export const courseApi = createApi({
    reducerPath: 'courseApi',
    tagTypes: ['Refetch_Creator_Courses', 'Refetch_Lectures'],
    baseQuery: fetchBaseQuery({ 
        baseUrl: COURSE_API,
        credentials: 'include' 
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({courseTitle, category}) => ({
                url: '',
                method: 'POST',
                body: {courseTitle, category}
            }),
            invalidatesTags: ['Refetch_Creator_Courses']
        }),
        getCreatorCourses: builder.query({
            query: () => ({
                url: '',
                method: 'GET'
            }),
            providesTags: ['Refetch_Creator_Courses']
        }), 
        editCourse: builder.mutation({
            query: ({formData, courseId}) => ({
                url: `/${courseId}`,
                method: 'PUT',
                body: formData
            })
        }), 
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: 'GET'
            })
        }),
        createLecture: builder.mutation({
            query: ({lectureTitle, courseId}) => ({
                url: `/${courseId}/lecture`,
                method: 'POST',
                body: {lectureTitle}
            })
        }),
        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: 'GET',
            }),
            providesTags: ['Refetch_Lectures']
        }),
        editLecture: builder.mutation({
            query: ({lectureTitle, videoInfo, isPreviewFree, courseId, lectureId}) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: 'PUT',
                body: {lectureTitle, videoInfo, isPreviewFree}
            })
        }),
        removeLecture: builder.mutation({
            query: ({courseId, lectureId}) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Refetch_Lectures']
        }),
        getLectureById: builder.query({
            query: ({lectureId}) => ({
                url: `/lecture/${lectureId}`,
                method: 'GET'
            })
        }),
        publishCourse: builder.mutation({
            query: ({courseId, query}) => ({
                url: `/${courseId}?publish=${query}`,
                method: 'PATCH',
            })
        }), 
        getPublishedCourses: builder.query({
            query: () => ({
                url: '/published-courses',
                method: 'GET'
            })
        }),
        payment: builder.mutation({
            query: (courseId) => ({
                url: `payment/${courseId}`,
                method: 'POST'
            })
        }), 
        verification: builder.mutation({
            query: ({razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId}) => ({
                url: `/payment/${courseId}/verification`,
                method: 'POST',
                body: {razorpay_order_id, razorpay_payment_id, razorpay_signature}
            }),
            invalidatesTags: ['Refetch_Lectures']
        }),
        getPurchaseStatus: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/details`,
                method: 'GET'
            })
        }),
        getAllPurchasedCourses: builder.query({
            query: () => ({
                url: '/purchasedCourses',
                method: 'GET'
            })
        }),
        getSearchedCourse: builder.query({
            query: ({searchQuery, categories, sortByPrice}) => {
                let queryString= `/search?query=${encodeURIComponent(searchQuery)}`

                if( categories && categories.length > 0 ) {
                    const categoryString = categories.map(encodeURIComponent).join(',')
                    queryString += `&categories=${categoryString}`
                }

                if( sortByPrice ) {
                    queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`
                }

                return {
                    url: queryString,
                    method: 'GET'
                }
                
            }
        }),
    })
})

export const { 
    useCreateCourseMutation,
    useGetCreatorCoursesQuery,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    useCreateLectureMutation,
    useGetCourseLectureQuery,
    useEditLectureMutation, 
    useRemoveLectureMutation,
    useGetLectureByIdQuery,
    usePublishCourseMutation,
    useGetPublishedCoursesQuery,
    usePaymentMutation,
    useVerificationMutation,
    useGetPurchaseStatusQuery,
    useGetAllPurchasedCoursesQuery,
    useGetSearchedCourseQuery
} = courseApi