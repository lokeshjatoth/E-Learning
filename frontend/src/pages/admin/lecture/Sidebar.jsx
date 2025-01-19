import { ChartNoAxesColumn, SquareLibrary } from "lucide-react"
import { Link, Outlet } from "react-router-dom"


const Sidebar = () => {
    return (
      <div className="flex min-h-screen">
        <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 bg-[#f0f0f0] dark:bg-gray-800 p-5 sticky top-[4rem] h-[calc(100vh-4rem)]">
          <div className="space-y-4">
            <Link to="dashboard" className="flex items-center gap-2">
              <ChartNoAxesColumn size={22} />
              <h1>Dashboard</h1>
            </Link>
            <Link to="courses" className="flex items-center gap-2">
              <SquareLibrary size={22} />
              <h1>Courses</h1>
            </Link>
          </div>
        </div>
        <div className="flex-1 p-5">
          <Outlet />
        </div>
      </div>
    );
  };
  

export default Sidebar