import { db } from "@/lib/db";

// Helper for BigInt crash prevention
function safeSerialize(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

export const getCourseContent = async (courseId: number) => {
  try {
    const userId = 24; // Hardcoded Student ID

    // 1. Fetch Course Structure (Lessons & Assessments) via Prisma
    // Note: Using lowercase model names to match your schema
    const course = await db.course.findUnique({
      where: {
        CourseID: courseId
      },
      include: {
        lesson: {
          include: {
            lesson_resource: true
          },
          orderBy: {
            LessonID: 'asc'
          }
        },
        assessment_method: {
          include: {
            quiz: true,
            project: true
          },
          orderBy: {
            AssessmentID: 'asc'
          }
        }
      }
    });

    if (!course) return null;

    // 2. Fetch Grade Report using your Stored Function
    // fn_course_score_report(pStudentID, pCourseID)
    const rawReport = await db.$queryRawUnsafe(
      `SELECT fn_course_score_report(${userId}, ${courseId}) as report`
    );
    const serializedReport = safeSerialize(rawReport);

    let reportString = "";
    if (Array.isArray(serializedReport) && serializedReport.length > 0) {
        // Extract string from result (e.g., "Quiz 1(20%): 8.5, Final Score: ...")
        reportString = serializedReport[0].report || "";
    }

    return {
      course,
      reportString
    };

  } catch (error) {
    console.log("[GET_COURSE_CONTENT]", error);
    return null;
  }
};