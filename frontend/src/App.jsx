

import { createBrowserRouter } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import HeroSection from './pages/student/HeroSection'
import MainLayout from './layout/MainLayout'
import { RouterProvider } from 'react-router-dom'
import Courses from './pages/student/Courses'
import MyLearning from './pages/student/MyLearning'
import Profile from './pages/student/Profile'
import Sidebar from './pages/admin/lecture/Sidebar'
import Dashboard from './pages/admin/lecture/Dashboard'
import CourseTable from './pages/admin/course/CourseTable'
import AddCourse from './pages/admin/course/AddCourse'
import EditCourse from './pages/admin/course/EditCourse'
import CreateLecture from './pages/admin/lecture/CreateLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import CourseDetail from './pages/student/CourseDetail'
import CourseProgress from './pages/student/CourseProgress'
import SearchPage from './pages/student/SearchPage'
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from './components/ProtectedRoutes'
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute'



const appRouter = createBrowserRouter([
  {
    path:"/",
    element: <MainLayout/>,
    children:[
      {
        path: "/",
        element:(
          <>
            <HeroSection/>
            <Courses/>
          </>
        )
      },
      {
        path:"login",
        element: <AuthenticatedUser><Login/></AuthenticatedUser> 
      }, 
      {
        path:"my-learning",
        element: <ProtectedRoute><MyLearning/></ProtectedRoute>
      },
      {
        path:"profile",
        element: <ProtectedRoute><Profile/></ProtectedRoute> 
      },
      {
        path:"course-detail/:courseId",
        element: <ProtectedRoute><CourseDetail/></ProtectedRoute>
      },
      {
        path:"course-progress/:courseId",
        element: <ProtectedRoute>
                  <PurchaseCourseProtectedRoute>
                    <CourseProgress/>
                  </PurchaseCourseProtectedRoute> 
                </ProtectedRoute>
      },
      {
        path:"course/search",
        element: <ProtectedRoute><SearchPage/></ProtectedRoute>
      },

      //admin routes
      {
        path:"admin",
        element: <AdminRoute><Sidebar/></AdminRoute> ,
        children: [
          {
            path:"dashboard",
            element: <Dashboard/>
          },
          {
            path:"courses",
            element: <CourseTable/>
          },
          {
            path:"courses/create",
            element: <AddCourse/>
          }, 
          {
            path:"courses/:courseId",
            element: <EditCourse/>
          },
          {
            path:"courses/:courseId/lecture",
            element: <CreateLecture/>
          },
          {
            path:"courses/:courseId/lecture/:lectureId",
            element: <EditLecture/>
          },
        ]
      }
    ]
  }
])

function App() {
  

  return (
    <main>
      <RouterProvider router={appRouter}/>
      
    </main>
    
  )
}

export default App
