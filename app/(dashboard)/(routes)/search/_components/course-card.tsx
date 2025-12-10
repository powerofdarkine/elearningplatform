"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useTransition } from "react";
import { enrollInCourse } from "@/actions/enroll";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
  isEnrolled: boolean;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
  isEnrolled
}: CourseCardProps) => {
  const [isPending, startTransition] = useTransition();

  const onEnroll = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop navigation to course page
    e.stopPropagation();

    startTransition(async () => {
      // Call server action
      const result = await enrollInCourse(parseInt(id));
      
      if (result.error) {
        alert(result.error); // Simple alert for errors (like prerequisites)
      } else {
        alert(result.success); // Success message
      }
    });
  };

  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full bg-white flex flex-col">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt={title}
            src={imageUrl}
          />
        </div>
        <div className="flex flex-col pt-2 flex-grow">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">
            {category}
          </p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <BookOpen size={16} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          
          {isEnrolled && progress !== null ? (
            // SHOW PROGRESS IF ENROLLED
            <div className="w-full mt-auto">
               <div className="h-2 w-full bg-slate-200 rounded-full">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${progress}%` }}
                  />
               </div>
               <p className="text-xs text-emerald-500 font-medium mt-1">
                 {progress}% Complete
               </p>
            </div>
          ) : (
            // SHOW PRICE AND ENROLL BUTTON IF NOT ENROLLED
            <div className="mt-auto flex items-center justify-between">
              <p className="text-md md:text-sm font-medium text-slate-700">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(price)}
              </p>
              
              <button 
                onClick={onEnroll}
                disabled={isPending}
                className="bg-sky-700 text-white text-xs px-3 py-2 rounded-md hover:bg-sky-800 disabled:opacity-50 transition"
              >
                {isPending ? "Enrolling..." : "Enroll"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};