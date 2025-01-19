import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useGetCreatorCoursesQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
  


const CourseTable = () => {
  const { data, isLoading } = useGetCreatorCoursesQuery();
  const navigate = useNavigate();

  if(isLoading) return <div>Loading...</div>;
  return (
    <div>
        <Button onClick={() => navigate("create")}>Create a new course</Button>
        <Table>
            <TableCaption>A list of your recent courses.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {data?.courses?.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="font-medium">{course?.coursePrice ? `₹${course.coursePrice}` : "NA"}</TableCell>
                <TableCell><Badge>{course?.isPublished ? "Published" : "Draft"}</Badge></TableCell>
                <TableCell>{course?.courseTitle}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => navigate(`${course._id}`)}><Edit/></Button>
                </TableCell>
                </TableRow>
            ))}
                
            </TableBody>
        </Table>

    </div>
  )
}

export default CourseTable