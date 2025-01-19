import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params?.courseId;
  const [lectureTitle, setLectureTitle] = useState("");

  const [createLecture, { data, error, isLoading, isSuccess }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error, data, refetch]);
  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="text-xl font-bold">
          {"Let's add lecture, add some basic details for your new lecture"}
        </h1>
        <p className="text-sm">
          Please fill in the required fields to create a new lecture.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="courseTitle"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Enter Lecture title Name"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                please wait...
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {lectureLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Lectures loading...
            </div>
          ) : lectureError ? (
            <p>Failed to load lectures</p>
          ) : lectureData?.lectures?.length === 0 ? (
            <p>No lecture available</p>
          ) : (
            lectureData?.lectures?.map((lecture, index) => (
                <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index}/>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
