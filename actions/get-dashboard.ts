// import { db } from "@/lib/db";
// import { Category, Course } from "@prisma/client";

// type DashboardCourse = Course & {
//   Category: Category[];
//   chaptersLength: number;
//   progress: number | null;
// };

// type DashboardData = {
//   completedCourses: DashboardCourse[];
//   coursesInProgress: DashboardCourse[];
//   preferenceString: string;
// };

// function safeSerialize(obj: any): any {
//   return JSON.parse(JSON.stringify(obj, (key, value) =>
//     typeof value === 'bigint' ? value.toString() : value
//   ));
// }

// export const getDashboardCourses = async (userId: number): Promise<DashboardData> => {
//   try {
//     // ------------------------------------------------------------------
//     // 1. Call Stored Procedure to determine WHICH courses to show
//     // ------------------------------------------------------------------
//     const rawSpResult = await db.$queryRawUnsafe(`CALL sp_get_enrolled_courses(${userId})`);
//     const serializedSpResult = safeSerialize(rawSpResult);

//     let enrolledCourseIds: number[] = [];

//     if (Array.isArray(serializedSpResult)) {
//         const flatRows = serializedSpResult.flat(2);
        
//         // Robustly find IDs regardless of property name (CourseID, f0, etc.)
//         const validRows = flatRows.filter((item: any) => 
//             item && (item.CourseID || item.courseID || item.courseId || item.f0)
//         );
        
//         enrolledCourseIds = validRows.map((r: any) => 
//             Number(r.CourseID || r.courseID || r.courseId || r.f0)
//         );
//     }

//     if (enrolledCourseIds.length === 0) {
//         return {
//           completedCourses: [],
//           coursesInProgress: [],
//           preferenceString: "" 
//         };
//     }

//     // ------------------------------------------------------------------
//     // 2. Fetch Full Details (Images, Categories) for those specific IDs
//     // ------------------------------------------------------------------
//     const courses = await db.course.findMany({
//       where: {
//         CourseID: {
//           in: enrolledCourseIds
//         }
//       },
//       include: {
//         Category: true,
//         Lesson: true,
//       }
//     });

//     // ------------------------------------------------------------------
//     // 3. Map to Dashboard Format
//     // ------------------------------------------------------------------
//     const dashboardCourses = courses.map((course) => {
//         return {
//             ...course,
//             progress: 50, // Mock progress (replace with real calculation if needed)
//             chaptersLength: course.Lesson.length
//         } as DashboardCourse;
//     });

//     const completedCourses = dashboardCourses.filter((course) => course.progress === 100);
//     const coursesInProgress = dashboardCourses.filter((course) => (course.progress ?? 0) < 100);

//     // ------------------------------------------------------------------
//     // 4. Fetch Category Preferences (Statistics)
//     // ------------------------------------------------------------------
//     const prefResult = await db.$queryRawUnsafe(`SELECT fn_student_category_preferences(${userId}) as prefs`);
//     const serializedPref = safeSerialize(prefResult);
    
//     let preferenceString = "";
//     if (Array.isArray(serializedPref)) {
//         const flatPref = serializedPref.flat(2);
//         const firstItem = flatPref[0];
//         if (firstItem) {
//             // Grab the first value found (ignoring key name)
//             preferenceString = Object.values(firstItem)[0] as string || "";
//         }
//     }

//     return {
//       completedCourses,
//       coursesInProgress,
//       preferenceString,
//     };

//   } catch (error) {
//     console.log("[GET_DASHBOARD_COURSES_ERROR]", error);
//     return {
//       completedCourses: [],
//       coursesInProgress: [],
//       preferenceString: ""
//     }
//   }
// };


import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client"; // Use lowercase types if generated

// Helper: Fixes "BigInt" crash
function safeSerialize(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

// Reuse image helper
const getCourseImage = (categoryName: string) => {
  const map: Record<string, string> = {
    "Music": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    "Photography": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    "Fitness": "https://images.unsplash.com/photo-1517836357463-baa25543e2a0?w=800&q=80",
    "Accounting": "https://images.unsplash.com/photo-1554224155-98406858d0cb?w=800&q=80",
    "Computer Science": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    "Filming": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    "Engineering": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    "Programming": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    "Data Science": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    "Web": "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
    "History": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80",
    "Math": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    "Database": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
    "Cloud": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    "Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
  };
  return map[categoryName] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
}

export const getDashboardCourses = async (userId: number) => {
  try {
    // 1. Call Stored Procedure
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

    if (enrolledCourseIds.length === 0) {
        return { completedCourses: [], coursesInProgress: [], preferenceString: "" };
    }

    // 2. Fetch Full Course Details (UPDATED FIELD NAMES)
    const courses = await db.course.findMany({
      where: {
        CourseID: { in: enrolledCourseIds }
      },
      include: {
        category: true, // FIX: Lowercase 'c'
        lesson: true,   // FIX: Lowercase 'l'
      }
    });

    // 3. Map to Dashboard Format
    const dashboardCourses = courses.map((course: any) => {
        return {
            ...course,
            progress: 50, 
            chaptersLength: course.lesson.length, // FIX: Lowercase 'l'
            // Add Category array property back for the UI card if needed
            Category: course.category, 
        };
    });

    const completedCourses = dashboardCourses.filter((course) => course.progress === 100);
    const coursesInProgress = dashboardCourses.filter((course) => (course.progress ?? 0) < 100);

    // 4. Fetch Category Preferences
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
    };

  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES_ERROR]", error);
    return { completedCourses: [], coursesInProgress: [], preferenceString: "" }
  }
};