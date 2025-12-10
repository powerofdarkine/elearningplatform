"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const enrollInCourse = async (courseId: number) => {
  // Hardcoded Student ID (Adam Baker from your seed data)
  const studentId = 24; 

  try {
    // Call the Stored Procedure defined in task 2.1.sql
    // sp_enroll_create(pStudentID, pCourseID, pEnrollmentDate)
    await db.$executeRaw`CALL sp_enroll_create(${studentId}, ${courseId}, ${new Date()})`;

    revalidatePath("/search");
    return { success: "Enrolled successfully!" };
  } catch (error: any) {
    // The trigger tr_check_prerequisite raises a specific error message.
    // We catch it here to display to the user.
    const errorMessage = error?.message || "";
    
    if (errorMessage.includes("prerequisite")) {
      return { error: "Cannot enroll: You have not completed all prerequisite courses." };
    }
    
    if (errorMessage.includes("Duplicate enrollment")) {
      return { error: "You are already enrolled in this course." };
    }

    if (errorMessage.includes("Instructor cannot enroll")) {
      return { error: "Instructors cannot enroll in their own courses." };
    }
    
    console.error("Enrollment error:", error);
    return { error: "Something went wrong. Please try again." };
  }
};