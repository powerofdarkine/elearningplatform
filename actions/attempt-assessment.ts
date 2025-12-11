"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const attemptAssessment = async (assessmentId: number, courseId: number) => {
  const studentId = 24; // Hardcoded Student ID

  // SIMULATION: Generate a random score between 5.0 and 10.0
  const randomScore = (Math.random() * (10 - 5) + 5).toFixed(2);

  try {
    // We use 'upsert' here. 
    // Logic: If the student has already attempted this quiz, UPDATE the score.
    // If it's their first time, INSERT (CREATE) a new record.
    await db.attempt_in.upsert({
      where: {
        StudentID_AssessmentID: {
          StudentID: studentId,
          AssessmentID: assessmentId,
        }
      },
      update: {
        Score: randomScore,
        Attempt_Date: new Date(),
        Feedback: "Re-attempted via Quick Grader"
      },
      create: {
        StudentID: studentId,
        AssessmentID: assessmentId,
        Score: randomScore,
        Feedback: "Simulated Attempt (Good Job!)", // Mock feedback
        Attempt_Date: new Date()
      }
    });

    // Refresh the page so the Grade tab updates immediately
    revalidatePath(`/courses/${courseId}`);
    
    return { success: `Assessment submitted! You scored: ${randomScore}` };
  } catch (error) {
    console.error("Attempt Error:", error);
    return { error: "Failed to submit assessment." };
  }
};