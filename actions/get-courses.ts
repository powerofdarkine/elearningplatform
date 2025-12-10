// import { db } from "@/lib/db";
// import { Category, Course } from "@prisma/client";

// type GetCoursesParams = {
//   title?: string;
//   categoryId?: string;
//   isPopular?: boolean;
// };

// // Helper: Fixes "BigInt" crash
// function safeSerialize(obj: any): any {
//   return JSON.parse(JSON.stringify(obj, (key, value) =>
//     typeof value === 'bigint' ? value.toString() : value
//   ));
// }

// const getCourseImage = (categoryName: string) => {
//   const map: Record<string, string> = {
//     "Music": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
//     "Photography": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
//     "Fitness": "https://images.unsplash.com/photo-1517836357463-baa25543e2a0?w=800&q=80",
//     "Accounting": "https://images.unsplash.com/photo-1554224155-98406858d0cb?w=800&q=80",
//     "Computer Science": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
//     "Filming": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
//     "Engineering": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
//     "Programming": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
//     "Data Science": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
//     "Web": "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
//     "History": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80",
//     "Math": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
//     "Database": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
//     "Cloud": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
//     "Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
//   };
//   return map[categoryName] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
// }

// export const getCourses = async ({
//   title,
//   categoryId,
//   isPopular
// }: GetCoursesParams) => {
//   try {
//     const studentId = 24; 
//     let popularCourseIds: number[] = [];

//     // --- MOST POPULAR LOGIC ---
//     if (isPopular) {
//       const rawResult = await db.$queryRawUnsafe(`CALL sp_get_popular_courses(2, NULL)`);
//       const sanitizedResult = safeSerialize(rawResult);

//       let rows: any[] = [];
      
//       if (Array.isArray(sanitizedResult)) {
//         // Flatten to handle [[Row1, Row2], Packet] structure
//         const flatResults = sanitizedResult.flat(2);
        
//         // Filter for objects that look like our data (have 'f0' OR 'CourseID')
//         rows = flatResults.filter((item: any) => 
//           item && (item.f0 !== undefined || item.CourseID !== undefined)
//         );
//       }

//       // UPDATE: Map 'f0' as the CourseID
//       popularCourseIds = rows.map((r: any) => r.f0 || r.CourseID);

//       if (popularCourseIds.length === 0) {
//         return { courses: [], categories: [] };
//       }
//     }

//     const categoryNames = categoryId ? categoryId.split(',') : undefined;

//     // --- MAIN QUERY ---
//     const courses = await db.course.findMany({
//       where: {
//         courseName: {
//           contains: title,
//         },
//         // CATEGORY LOGIC: Union (OR)
//         ...(categoryNames && {
//           Category: {
//             some: {
//               ACategory: { in: categoryNames }
//             }
//           }
//         }),
//         // POPULAR LOGIC: Intersection (AND)
//         ...(isPopular && {
//           CourseID: {
//             in: popularCourseIds
//           }
//         })
//       },
//       include: {
//         Category: true,
//         Lesson: true,
//       },
//       orderBy: {
//         courseName: 'asc'
//       }
//     });

//     const categories = await db.category.findMany({
//       distinct: ['ACategory'],
//       select: { ACategory: true },
//       orderBy: { ACategory: 'asc' }
//     });

//     const enrollments = await db.enroll.findMany({
//       where: { StudentID: studentId }
//     });

//     const formattedCourses = courses.map((course) => {
//       const isEnrolled = enrollments.some(e => e.CourseID === course.CourseID);
//       const categoryName = course.Category[0]?.ACategory || "General";

//       return {
//         id: course.CourseID.toString(),
//         title: course.courseName,
//         imageUrl: getCourseImage(categoryName),
//         chaptersLength: course.Lesson.length,
//         price: Number(course.Price),
//         progress: isEnrolled ? 50 : null,
//         category: categoryName,
//         isEnrolled: isEnrolled
//       };
//     });

//     const formattedCategories = categories.map((c) => ({
//       id: c.ACategory,
//       name: c.ACategory
//     }));

//     return {
//       courses: formattedCourses,
//       categories: formattedCategories
//     };

//   } catch (error) {
//     console.error("[GET_COURSES_ERROR]", error);
//     return { courses: [], categories: [] };
//   }
// };

import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client"; // Note: lowercase import if needed, or check generated types

type GetCoursesParams = {
  title?: string;
  categoryId?: string;
  isPopular?: boolean;
};

function safeSerialize(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

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

export const getCourses = async ({
  title,
  categoryId,
  isPopular
}: GetCoursesParams) => {
  try {
    const studentId = 24; 
    let popularCourseIds: number[] = [];

    // 1. Popular Logic
    if (isPopular) {
      const rawResult = await db.$queryRawUnsafe(`CALL sp_get_popular_courses(2, NULL)`);
      const sanitizedResult = safeSerialize(rawResult);
      let rows: any[] = [];
      if (Array.isArray(sanitizedResult)) {
        const flatResults = sanitizedResult.flat(2);
        rows = flatResults.filter((item: any) => 
          item && (item.f0 !== undefined || item.CourseID !== undefined)
        );
      }
      popularCourseIds = rows.map((r: any) => r.f0 || r.CourseID);
      if (popularCourseIds.length === 0) return { courses: [], categories: [] };
    }

    const categoryNames = categoryId ? categoryId.split(',') : undefined;

    // 2. Main Query - UPDATED FIELD NAMES
    const courses = await db.course.findMany({
      where: {
        courseName: {
          contains: title,
        },
        ...(categoryNames && {
          category: { // FIX: Lowercase 'c'
            some: {
              ACategory: { in: categoryNames }
            }
          }
        }),
        ...(isPopular && {
          CourseID: {
            in: popularCourseIds
          }
        })
      },
      include: {
        category: true, // FIX: Lowercase 'c'
        lesson: true,   // FIX: Lowercase 'l'
      },
      orderBy: {
        courseName: 'asc'
      }
    });

    const categories = await db.category.findMany({
      distinct: ['ACategory'],
      select: { ACategory: true },
      orderBy: { ACategory: 'asc' }
    });

    const enrollments = await db.enroll.findMany({
      where: { StudentID: studentId }
    });

    const formattedCourses = courses.map((course: any) => {
      const isEnrolled = enrollments.some(e => e.CourseID === course.CourseID);
      // FIX: Access lowercase properties
      const categoryName = course.category[0]?.ACategory || "General"; 

      return {
        id: course.CourseID.toString(),
        title: course.courseName,
        imageUrl: getCourseImage(categoryName),
        chaptersLength: course.lesson.length, // FIX: Lowercase 'l'
        price: Number(course.Price),
        progress: isEnrolled ? 50 : null,
        category: categoryName,
        isEnrolled: isEnrolled
      };
    });

    const formattedCategories = categories.map((c) => ({
      id: c.ACategory,
      name: c.ACategory
    }));

    return {
      courses: formattedCourses,
      categories: formattedCategories
    };

  } catch (error) {
    console.error("[GET_COURSES_ERROR]", error);
    return { courses: [], categories: [] };
  }
};