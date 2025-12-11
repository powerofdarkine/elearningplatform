"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const enrollInCourse = async (courseId: number) => {
  const studentId = 24; 

  try {
    // This CALL will trigger 'tr_check_prerequisite' inside the DB
    await db.$executeRaw`CALL sp_enroll_create(${studentId}, ${courseId}, NOW())`;

    revalidatePath("/search");
    revalidatePath("/dashboard");
    return { success: "Enrolled successfully!" };
  } catch (error: any) {
    const errorMessage = error?.message || "";
    
    // Catch Trigger Error: Prerequisite missing
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