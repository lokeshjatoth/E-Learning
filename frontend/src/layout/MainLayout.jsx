import Navbar from "@/components/Navbar"
import { Outlet } from "react-router-dom"



const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
        <Navbar/>
        <div className="pt-16 flex-1">
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout