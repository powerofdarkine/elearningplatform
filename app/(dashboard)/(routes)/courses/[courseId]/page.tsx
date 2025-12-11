import { getCourseContent } from "@/actions/get-course-content";
import { CourseContentView } from "./_components/course-content-view.tsx";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string }
}) => {
  
  // Ensure ID is valid
  if (!params.courseId) {
    return redirect("/");
  }

  const data = await getCourseContent(parseInt(params.courseId));

  if (!data) {
    return (
        <div className="p-6 text-center">
            <h2 className="text-xl font-bold">Course Not Found</h2>
            <p className="text-slate-500">This course does not exist or you do not have permission to view it.</p>
        </div>
    );
  }

  return (
    <div className="h-full w-full bg-white">
        <CourseContentView 
            course={data.course} 
            reportString={data.reportString} 
        />
    </div>
  );
}

export default CourseIdPage;