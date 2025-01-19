import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn, userLoggedOut } from '../authSlice';



const BASE_API = `${import.meta.env.VITE_BASE_URL}/api/v1/user/`


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: BASE_API,
        credentials: 'include' 
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: 'register',
                method: 'POST',
                body: inputData
            }), 
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try{
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user: result.data.user}));
                } catch(error){
                    console.log("Register Failed : ",error);
                }
            }
        }),
        loginUser: builder.mutation({
            query: (inputData) => ({
                url: 'login',
                method: 'POST',
                body: inputData
            }),
            async onQueryStarted(args, {queryFulfilled, dispatch}){
                try{
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user: result.data.user}));
                } catch(error){
                    console.log("Login Failed : ",error);
                }
            }
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: 'logout', 
                method: 'POST',
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                    dispatch(userLoggedOut()); 
                } catch (error) {
                    console.log("Logout Failed:", error);
                }
            },
        }),
        loadUser: builder.query({
            query:()=>({
                url: "profile",
                method: "GET",
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}){
                try{
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user: result.data.user}));
                } catch(error){
                    console.log(error);
                }
            }
        }),
        updateUser: builder.mutation({
            query: (inputData) => ({
                url: 'profile/update',
                method: 'PUT',
                body: inputData,
                credentials: 'include'
            })
        }), 
        
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation,
    
} = authApi;