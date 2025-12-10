"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const STUDENT_ID = 24; // Hardcoded for now

// 1. LEAVE COURSE ACTION
export const leaveCourse = async (courseId: number) => {
  try {
    // Call sp_enroll_delete(pStudentID, pCourseID)
    await db.$executeRaw`CALL sp_enroll_delete(${STUDENT_ID}, ${courseId})`;
    revalidatePath("/dashboard");
    revalidatePath("/search");
    return { success: "Left course successfully." };
  } catch (error: any) {
    console.error("Leave Error:", error);
    return { error: error?.message || "Failed to leave course." };
  }
};

// 2. TRANSFER COURSE ACTION
export const transferCourse = async (oldCourseId: number, newCourseId: number) => {
  try {
    // Call sp_enroll_update_transfer(pStudentID, pOldCourseID, pNewCourseID, pNewEnrollmentDate)
    await db.$executeRaw`CALL sp_enroll_update_transfer(${STUDENT_ID}, ${oldCourseId}, ${newCourseId}, NOW())`;
    revalidatePath("/dashboard");
    revalidatePath("/search");
    return { success: "Transferred successfully." };
  } catch (error: any) {
    console.error("Transfer Error:", error);
    // Extract nice error message if possible
    const msg = error?.message || "Failed to transfer.";
    if (msg.includes("older than")) return { error: "Cannot transfer: Enrollment is older than 10 days." };
    if (msg.includes("prerequisite")) return { error: "Cannot transfer: Prerequisites not met." };
    
    return { error: "Failed to transfer course." };
  }
};

// Helper to get all OTHER courses for the transfer dropdown
export const getAvailableCoursesForTransfer = async (currentCourseId: number) => {
    const courses = await db.course.findMany({
        where: {
            CourseID: { not: currentCourseId }
        },
        orderBy: { courseName: 'asc' }
    });
    return courses;
}