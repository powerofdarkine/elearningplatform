"use client";

import { File, PlayCircle, HelpCircle, Trophy, CheckCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { attemptAssessment } from "@/actions/attempt-assessment"; 

interface CourseContentViewProps {
  course: any;
  reportString: string;
}

export const CourseContentView = ({ course, reportString }: CourseContentViewProps) => {
  const [activeTab, setActiveTab] = useState<"Course" | "Grade">("Course");
  const [isPending, startTransition] = useTransition();

  // FIX: Removed 'async' from the startTransition callback
  const onAttempt = (assessmentId: number) => {
    startTransition(() => {
        attemptAssessment(assessmentId, course.CourseID)
            .then((result) => {
                if (result.success) {
                    alert(result.success);
                } else {
                    alert(result.error);
                }
            })
            .catch(() => {
                alert("Something went wrong during the attempt.");
            });
    });
  };

  // Parse the Grade String
  const gradeItems = reportString.split(',').map((item) => {
    const cleanItem = item.trim();
    if (cleanItem.startsWith("Final Score")) {
        const parts = cleanItem.split(':');
        return { name: "Final Score", score: parts[1]?.trim(), isFinal: true };
    }
    // Parse "Name(Weight%): Score"
    const match = cleanItem.match(/^(.+)\(([\d.]+)%\):\s*([\d.]+)$/);
    if (match) {
        return { name: match[1], weight: match[2], score: match[3], isFinal: false };
    }
    // Fallback for items with no score
    const matchNoScore = cleanItem.match(/^(.+)\(([\d.]+)%\):\s*$/);
    if(matchNoScore) {
       return { name: matchNoScore[1], weight: matchNoScore[2], score: "Not graded", isFinal: false }; 
    }
    return { name: cleanItem, score: "", isFinal: false };
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{course.courseName}</h1>
        <p className="text-sm text-slate-500 mt-2">{course.Description}</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-x-6 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("Course")}
          className={`pb-3 text-sm font-medium transition ${
            activeTab === "Course" 
              ? "border-b-2 border-sky-700 text-sky-800" 
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Course Content
        </button>
        <button
          onClick={() => setActiveTab("Grade")}
          className={`pb-3 text-sm font-medium transition ${
            activeTab === "Grade" 
              ? "border-b-2 border-sky-700 text-sky-800" 
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Grades & Competencies
        </button>
      </div>

      {/* TAB 1: COURSE CONTENT */}
      {activeTab === "Course" && (
        <div className="space-y-6">
          {/* Lessons Section */}
          <div className="border rounded-md p-4 bg-white">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <PlayCircle className="text-sky-600" /> Lessons & Resources
            </h2>
            <div className="space-y-3">
              {course.lesson.map((lesson: any) => (
                <div key={lesson.LessonID} className="p-3 bg-slate-50 rounded-md border">
                  <h3 className="font-medium text-slate-800 mb-2">{lesson.LessonTitle}</h3>
                  <div className="flex flex-col gap-2 pl-2">
                    {lesson.lesson_resource.map((res: any) => (
                      <a 
                        key={res.ResourceID} 
                        href={res.Storage_URL} 
                        target="_blank" 
                        className="flex items-center gap-2 text-sm text-sky-600 hover:underline"
                      >
                        <File size={14} />
                        {res.FileName || res.Resource_Type}
                      </a>
                    ))}
                    {lesson.lesson_resource.length === 0 && (
                        <p className="text-xs text-slate-400 italic">No resources available</p>
                    )}
                  </div>
                </div>
              ))}
              {course.lesson.length === 0 && <p className="text-slate-500">No lessons available.</p>}
            </div>
          </div>

          {/* Assessments Section */}
          <div className="border rounded-md p-4 bg-white">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <HelpCircle className="text-emerald-600" /> Quizzes & Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.assessment_method.map((assessment: any) => {
                    const isQuiz = !!assessment.quiz;
                    const title = isQuiz 
                        ? `Quiz (Pass: ${assessment.quiz.Passing_score})` 
                        : `Project: ${assessment.project?.Name || 'Unnamed'}`;
                    
                    return (
                        <div key={assessment.AssessmentID} className="p-4 border rounded-md hover:shadow-sm transition bg-slate-50">
                            <h4 className="font-medium">{title}</h4>
                            <p className="text-xs text-slate-500 mt-1">
                                Weight: {Number(assessment.Weight_Ratio) * 100}%
                            </p>
                            
                            <button 
                                onClick={() => onAttempt(assessment.AssessmentID)}
                                disabled={isPending}
                                className="mt-3 text-xs bg-sky-700 text-white px-3 py-2 rounded-md hover:bg-sky-800 disabled:opacity-50 transition flex items-center gap-1"
                            >
                                {isPending ? "Submitting..." : "Start Attempt"}
                            </button>
                        </div>
                    );
                })}
                {course.assessment_method.length === 0 && <p className="text-slate-500">No assessments available.</p>}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GRADES */}
      {activeTab === "Grade" && (
        <div className="border rounded-md bg-white overflow-hidden">
            <div className="bg-slate-100 p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                    <Trophy className="text-amber-500" /> Grade Report
                </h3>
            </div>
            <div className="divide-y">
                {gradeItems.map((item, idx) => (
                    <div key={idx} className={`flex justify-between p-4 ${item.isFinal ? 'bg-sky-50 font-bold text-sky-900' : ''}`}>
                        <span>
                            {item.name} 
                            {!item.isFinal && <span className="text-slate-400 text-xs ml-2">({item.weight}%)</span>}
                        </span>
                        <span className={item.score === "Not graded" ? "text-slate-400 italic" : "font-medium"}>
                            {item.score || "N/A"}
                        </span>
                    </div>
                ))}
            </div>
            {gradeItems.length === 0 && (
                <div className="p-6 text-center text-slate-500">
                    No grades recorded yet.
                </div>
            )}
        </div>
      )}
    </div>
  );
};