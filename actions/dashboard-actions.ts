"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const STUDENT_ID = 24; 

// 1. LEAVE COURSE (Triggers 'tr_amountdue_after_enroll_delete')
export const leaveCourse = async (courseId: number) => {
  try {
    await db.$executeRaw`CALL sp_enroll_delete(${STUDENT_ID}, ${courseId})`;
    revalidatePath("/dashboard");
    revalidatePath("/search");
    return { success: "Left course successfully." };
  } catch (error: any) {
    console.error("Leave Error:", error);
    const msg = error?.message || "";
    // If you have a trigger preventing leaving after payment, catch it here
    if (msg.includes("payment already exists")) return { error: "Cannot leave: Payment already exists." };
    
    return { error: "Failed to leave course." };
  }
};

// 2. TRANSFER COURSE (Triggers 'tr_check_prerequisite_update' & 'tr_amountdue_after_enroll_update')
export const transferCourse = async (oldCourseId: number, newCourseId: number) => {
  try {
    await db.$executeRaw`CALL sp_enroll_update_transfer(${STUDENT_ID}, ${oldCourseId}, ${newCourseId}, NOW())`;
    revalidatePath("/dashboard");
    revalidatePath("/search");
    return { success: "Transferred successfully." };
  } catch (error: any) {
    console.error("Transfer Error:", error);
    const msg = error?.message || "";
    
    // Catch Trigger Error: Prerequisite missing for NEW course
    if (msg.includes("prerequisite")) {
        return { error: "Cannot transfer: You lack prerequisites for the new course." };
    }
    if (msg.includes("older than")) return { error: "Cannot transfer: Enrollment is older than 10 days." };
    
    return { error: "Failed to transfer course." };
  }
};

export const getAvailableCoursesForTransfer = async (currentCourseId: number) => {
    const courses = await db.course.findMany({
        where: {
            CourseID: { not: currentCourseId }
        },
        orderBy: { courseName: 'asc' }
    });
    return courses;
}