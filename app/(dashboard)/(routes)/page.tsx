import { getDashboardCourses } from "@/actions/get-dashboard";
import { DashboardCourseCard } from "../_components/dashboard-course-card";
import { CircleDollarSign } from "lucide-react";

// Helper for images
const getCourseImage = (categoryName: string) => {
    const map: Record<string, string> = {
      "Music": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
      "Photography": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
      "Fitness": "https://images.unsplash.com/photo-1517836357463-baa25543e2a0?w=800&q=80",
      "Accounting": "https://images.unsplash.com/photo-1554224155-98406858d0cb?w=800&q=80",
      "Computer Science": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      "Filming": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
      "Engineering": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
      "History": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80",
      "Math": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
      "Database": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
      "Cloud": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    };
    return map[categoryName] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
}

export default async function Dashboard() {
  const userId = 24; 
  const { completedCourses, coursesInProgress, preferenceString, totalAmountDue } = await getDashboardCourses(userId);
  
  const preferences = preferenceString.split(',').map(p => {
    const match = p.trim().match(/^(.+) \(([\d.]+)%\)$/);
    if (match) {
        return { label: match[1], percentage: parseFloat(match[2]) };
    }
    return null;
  }).filter(Boolean) as { label: string, percentage: number }[];

  const allCourses = [...coursesInProgress, ...completedCourses];

  return (
    <div className="p-6 space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Statistics */}
        {preferences.length > 0 ? (
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                <h3 className="font-semibold text-slate-700 mb-2">Interest Overview</h3>
                {preferences.map((pref, idx) => (
                    <div key={idx} className="w-full">
                        <div className="flex justify-between text-xs font-medium mb-1 text-slate-600">
                            <span>{pref.label}</span>
                            <span>{pref.percentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full rounded-full" 
                                style={{ 
                                    width: `${pref.percentage}%`,
                                    backgroundColor: idx % 2 === 0 ? '#0369a1' : '#10b981' 
                                }} 
                            />
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-center text-slate-400 text-sm">
                No learning stats available yet.
            </div>
        )}

        {/* Fee Card */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center items-center gap-2 text-center h-full">
            <div className="p-4 bg-emerald-100 rounded-full mb-2">
                <CircleDollarSign className="h-10 w-10 text-emerald-700" />
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">Total Fee Due</p>
                <h2 className="text-3xl font-bold text-slate-800 mt-1">
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(totalAmountDue)}
                </h2>
            </div>
        </div>

      </div>

      <h2 className="text-xl font-semibold text-slate-800">My Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allCourses.map((course) => (
          <DashboardCourseCard
            key={course.CourseID}
            id={course.CourseID.toString()}
            title={course.courseName}
            imageUrl={getCourseImage(course.category?.[0]?.ACategory || "General")}
            chaptersLength={course.chaptersLength}
            progress={course.progress || 0}
            category={course.category?.[0]?.ACategory || "General"}
            isPaid={course.isPaid} // <--- PASS THE PROP
          />
        ))}
      </div>
      
      {allCourses.length === 0 && (
          <div className="text-center text-muted-foreground mt-10">
              You are not enrolled in any courses.
          </div>
      )}
    </div>
  );
}