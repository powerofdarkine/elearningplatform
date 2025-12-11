"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, LogOut, ArrowRightLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { leaveCourse, transferCourse, getAvailableCoursesForTransfer } from "@/actions/dashboard-actions";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"; 

interface DashboardCourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  progress: number;
  category: string;
  isPaid: boolean; // <--- NEW PROP
}

export const DashboardCourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  progress,
  category,
  isPaid // <--- Destructure it
}: DashboardCourseCardProps) => {
  const [isPending, startTransition] = useTransition();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferOptions, setTransferOptions] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  useEffect(() => {
    if (isTransferOpen) {
        getAvailableCoursesForTransfer(parseInt(id)).then(setTransferOptions);
    }
  }, [isTransferOpen, id]);

  const onLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to leave this course?")) return;

    startTransition(() => {
      leaveCourse(parseInt(id))
        .then((res) => {
          if (res.error) alert(res.error);
          else alert(res.success);
        })
        .catch(() => alert("Something went wrong"));
    });
  };

  const onTransfer = () => {
    if (!selectedCourseId) return;
    
    startTransition(() => {
       transferCourse(parseInt(id), parseInt(selectedCourseId))
         .then((res) => {
           if (res.error) alert(res.error);
           else {
             alert(res.success);
             setIsTransferOpen(false);
           }
         })
         .catch(() => alert("Something went wrong"));
    });
  };

  return (
    <>
    <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full bg-white flex flex-col relative">
      <Link href={`/courses/${id}`} className="block relative w-full aspect-video rounded-md overflow-hidden">
        <Image fill className="object-cover" alt={title} src={imageUrl} />
        
        {/* --- NEW PAYMENT STATUS BADGE --- */}
        <div className="absolute top-2 right-2 z-10">
            {isPaid ? (
                <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <CheckCircle size={12} /> PAID
                </div>
            ) : (
                <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <AlertCircle size={12} /> UNPAID
                </div>
            )}
        </div>
        {/* -------------------------------- */}

      </Link>
      
      <div className="flex flex-col pt-2 grow"> 
        <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
          {title}
        </div>
        <p className="text-xs text-muted-foreground">{category}</p>
        
        <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
          <div className="flex items-center gap-x-1 text-slate-500">
            <BookOpen size={16} />
            <span>{chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}</span>
          </div>
        </div>

        <div className="w-full mb-4">
            <div className="h-2 w-full bg-slate-200 rounded-full">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-emerald-500 font-medium mt-1">{Math.round(progress)}% Complete</p>
        </div>

        <div className="mt-auto flex gap-x-2">
            <button 
                onClick={(e) => { e.preventDefault(); setIsTransferOpen(true); }}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-x-1 bg-white border border-sky-700 text-sky-700 text-xs px-2 py-2 rounded-md hover:bg-sky-50 transition"
            >
                <ArrowRightLeft size={14} /> Transfer
            </button>

            <button 
                onClick={onLeave}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-x-1 bg-sky-700 text-white text-xs px-2 py-2 rounded-md hover:bg-sky-800 transition"
            >
                <LogOut size={14} /> Leave
            </button>
        </div>
      </div>
    </div>

    <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Course</DialogTitle>
        </DialogHeader>
        <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Select new course:</label>
            <select 
                className="w-full p-2 border rounded-md"
                onChange={(e) => setSelectedCourseId(e.target.value)}
                value={selectedCourseId}
            >
                <option value="">-- Select a course --</option>
                {transferOptions.map(c => (
                    <option key={c.CourseID} value={c.CourseID}>{c.courseName}</option>
                ))}
            </select>
        </div>
        <DialogFooter>
            <button onClick={() => setIsTransferOpen(false)} className="px-4 py-2 text-sm border rounded-md mr-2">Cancel</button>
            <button 
                onClick={onTransfer} 
                disabled={isPending || !selectedCourseId}
                className="px-4 py-2 text-sm bg-sky-700 text-white rounded-md disabled:opacity-50"
            >
                {isPending ? "Transferring..." : "Confirm Transfer"}
            </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};