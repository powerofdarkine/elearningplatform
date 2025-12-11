import { db } from "@/lib/db";
import { category, course } from "@prisma/client"; 

type DashboardCourse = course & {
  category: category[];
  chaptersLength: number;
  progress: number | null;
  isPaid: boolean; // <--- NEW FIELD
};

type DashboardData = {
  completedCourses: DashboardCourse[];
  coursesInProgress: DashboardCourse[];
  preferenceString: string;
  totalAmountDue: number;
};

function safeSerialize(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

export const getDashboardCourses = async (userId: number): Promise<DashboardData> => {
  try {
    // 1. Get Enrolled Course IDs from Stored Procedure
    const rawSpResult = await db.$queryRawUnsafe(`CALL sp_get_enrolled_courses(${userId})`);
    const serializedSpResult = safeSerialize(rawSpResult);

    let enrolledCourseIds: number[] = [];

    if (Array.isArray(serializedSpResult)) {
        const flatRows = serializedSpResult.flat(2);
        const validRows = flatRows.filter((item: any) => 
            item && (item.CourseID || item.courseID || item.courseId || item.f0)
        );
        enrolledCourseIds = validRows.map((r: any) => 
            Number(r.CourseID || r.courseID || r.courseId || r.f0)
        );
    }

    // 2. Fetch Total Fee
    const feeResult: any = await db.$queryRaw`
      SELECT Total_Amount_Due FROM End_user WHERE End_userID = ${userId}
    `;
    const totalAmountDue = feeResult[0]?.Total_Amount_Due ? Number(feeResult[0].Total_Amount_Due) : 0;

    if (enrolledCourseIds.length === 0) {
        return {
          completedCourses: [],
          coursesInProgress: [],
          preferenceString: "",
          totalAmountDue: totalAmountDue
        };
    }

    // 3. NEW: Check Payment Status for these courses
    // We look for records in the 'paid_for' table matching this student and these courses
    const paidRecords = await db.paid_for.findMany({
      where: {
        StudentID: userId,
        CourseID: {
          in: enrolledCourseIds
        }
      },
      select: {
        CourseID: true
      }
    });
    
    // Create a Set for fast lookup (O(1))
    const paidCourseIds = new Set(paidRecords.map(p => p.CourseID));

    // 4. Fetch Full Course Details
    const courses = await db.course.findMany({
      where: {
        CourseID: { in: enrolledCourseIds }
      },
      include: {
        category: true,
        lesson: true,
      }
    });

    // 5. Map to Dashboard Format with isPaid status
    const dashboardCourses = courses.map((course: any) => {
        return {
            ...course,
            progress: 50, 
            chaptersLength: course.lesson.length,
            category: course.category,
            // Check if this course ID exists in our paid set
            isPaid: paidCourseIds.has(course.CourseID) 
        } as DashboardCourse;
    });

    const completedCourses = dashboardCourses.filter((course) => course.progress === 100);
    const coursesInProgress = dashboardCourses.filter((course) => (course.progress ?? 0) < 100);

    // 6. Fetch Preferences
    const prefResult = await db.$queryRawUnsafe(`SELECT fn_student_category_preferences(${userId}) as prefs`);
    const serializedPref = safeSerialize(prefResult);
    
    let preferenceString = "";
    if (Array.isArray(serializedPref)) {
        const flatPref = serializedPref.flat(2);
        const firstItem = flatPref[0];
        if (firstItem) {
            preferenceString = Object.values(firstItem)[0] as string || "";
        }
    }

    return {
      completedCourses,
      coursesInProgress,
      preferenceString,
      totalAmountDue
    };

  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES_ERROR]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
      preferenceString: "",
      totalAmountDue: 0
    }
  }
};