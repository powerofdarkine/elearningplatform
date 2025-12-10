// "use client";

// import { 
//   FcEngineering, FcFilmReel, FcMultipleDevices, FcMusic, 
//   FcOldTimeCamera, FcSalesPerformance, FcSportsMode, FcApproval, 
//   FcGlobe, FcCalculator, FcDatabase, FcCommandLine
// } from "react-icons/fc";
// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import qs from "query-string";
// import { cn } from "@/lib/utils";

// interface CategoriesProps {
//   items: { id: string; name: string }[];
// }

// // 1. FIX STATIC ICON: Cast FcApproval to 'any' to fix Line 81 error
// const PopularIcon = FcApproval as any;

// // 2. FIX DYNAMIC ICONS: Keep this as 'Record<string, any>'
// const iconMap: Record<string, any> = {
//   "Music": FcMusic,
//   "Photography": FcOldTimeCamera,
//   "Fitness": FcSportsMode,
//   "Accounting": FcSalesPerformance,
//   "Computer Science": FcMultipleDevices,
//   "Filming": FcFilmReel,
//   "Engineering": FcEngineering,
//   "History": FcGlobe,
//   "Math": FcCalculator,
//   "Database": FcDatabase,
//   "Programming": FcCommandLine,
//   "Data Science": FcMultipleDevices,
//   "Web": FcGlobe,
//   "Cloud": FcDatabase,
//   "Design": FcOldTimeCamera
// };

// export const Categories = ({ items }: CategoriesProps) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const currentCategoryNames = searchParams.get("categoryId")?.split(',') || [];
//   const isPopular = searchParams.get("popular") === "true";
//   const currentTitle = searchParams.get("title");

//   const onClick = (id: string | "POPULAR") => {
//     let newCategoryNames = [...currentCategoryNames];
//     let newIsPopular = isPopular;

//     if (id === "POPULAR") {
//       newIsPopular = !isPopular;
//     } else {
//       if (newCategoryNames.includes(id)) {
//         newCategoryNames = newCategoryNames.filter((cat) => cat !== id);
//       } else {
//         newCategoryNames.push(id);
//       }
//     }

//     const url = qs.stringifyUrl({
//       url: pathname,
//       query: {
//         title: currentTitle,
//         categoryId: newCategoryNames.length > 0 ? newCategoryNames.join(',') : null,
//         popular: newIsPopular ? "true" : null,
//       },
//     }, { skipNull: true, skipEmptyString: true });

//     router.push(url);
//   };

//   return (
//     <div className="flex items-center gap-x-2 overflow-x-auto pb-4 pt-2">
//       {/* 3. USE THE CASTED ICON VARIABLE HERE */}
//       <button
//         onClick={() => onClick("POPULAR")}
//         className={cn(
//           "flex items-center gap-x-1 py-2 px-3 text-sm font-[500] border border-slate-200 rounded-full transition flex-shrink-0 bg-white hover:border-sky-700 hover:text-sky-800",
//           isPopular && "border-sky-700 bg-sky-100 text-sky-800"
//         )}
//         type="button"
//       >
//         <PopularIcon size={20} />
//         <div className="truncate">Most Popular</div>
//       </button>

//       {items.map((item) => {
//         const Icon = iconMap[item.name];
//         const isSelected = currentCategoryNames.includes(item.id);

//         return (
//           <button
//             key={item.id}
//             onClick={() => onClick(item.id)}
//             className={cn(
//               "flex items-center gap-x-1 py-2 px-3 text-sm font-[500] border border-slate-200 rounded-full transition flex-shrink-0 bg-white hover:border-sky-700 hover:text-sky-800",
//               isSelected && "border-sky-700 bg-sky-100 text-sky-800"
//             )}
//             type="button"
//           >
//             {Icon && <Icon size={20} />}
//             <div className="truncate">{item.name}</div>
//           </button>
//         );
//       })}
//     </div>
//   );
// };

"use client";

import { 
  FcEngineering, FcFilmReel, FcMultipleDevices, FcMusic, 
  FcOldTimeCamera, FcSalesPerformance, FcSportsMode, FcApproval, 
  FcGlobe, FcCalculator, FcDatabase, FcCommandLine
} from "react-icons/fc";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import qs from "query-string";
import { cn } from "@/lib/utils";

interface CategoriesProps {
  items: { id: string; name: string }[];
}

// 1. DEFINE THIS VARIABLE to fix the Red Error Line
const PopularIcon = FcApproval as any;

// 2. Dynamic Icons map
const iconMap: Record<string, any> = {
  "Music": FcMusic,
  "Photography": FcOldTimeCamera,
  "Fitness": FcSportsMode,
  "Accounting": FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
  "Filming": FcFilmReel,
  "Engineering": FcEngineering,
  "History": FcGlobe,
  "Math": FcCalculator,
  "Database": FcDatabase,
  "Programming": FcCommandLine,
  "Data Science": FcMultipleDevices,
  "Web": FcGlobe,
  "Cloud": FcDatabase,
  "Design": FcOldTimeCamera
};

export const Categories = ({ items }: CategoriesProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoryNames = searchParams.get("categoryId")?.split(',') || [];
  const isPopular = searchParams.get("popular") === "true";
  const currentTitle = searchParams.get("title");

  const onClick = (id: string | "POPULAR") => {
    let newCategoryNames = [...currentCategoryNames];
    let newIsPopular = isPopular;

    if (id === "POPULAR") {
      newIsPopular = !isPopular;
    } else {
      if (newCategoryNames.includes(id)) {
        newCategoryNames = newCategoryNames.filter((cat) => cat !== id);
      } else {
        newCategoryNames.push(id);
      }
    }

    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        title: currentTitle,
        categoryId: newCategoryNames.length > 0 ? newCategoryNames.join(',') : null,
        popular: newIsPopular ? "true" : null,
      },
    }, { skipNull: true, skipEmptyString: true });

    router.push(url);
  };

  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-4 pt-2">
      <button
        onClick={() => onClick("POPULAR")}
        className={cn(
          "flex items-center gap-x-1 py-2 px-3 text-sm font-[500] border border-slate-200 rounded-full transition flex-shrink-0 bg-white hover:border-sky-700 hover:text-sky-800",
          isPopular && "border-sky-700 bg-sky-100 text-sky-800"
        )}
        type="button"
      >
        {/* 3. USE THE VARIABLE HERE instead of <FcApproval /> */}
        <PopularIcon size={20} />
        <div className="truncate">Most Popular</div>
      </button>

      {items.map((item) => {
        const Icon = iconMap[item.name];
        const isSelected = currentCategoryNames.includes(item.id);

        return (
          <button
            key={item.id}
            onClick={() => onClick(item.id)}
            className={cn(
              "flex items-center gap-x-1 py-2 px-3 text-sm font-[500] border border-slate-200 rounded-full transition flex-shrink-0 bg-white hover:border-sky-700 hover:text-sky-800",
              isSelected && "border-sky-700 bg-sky-100 text-sky-800"
            )}
            type="button"
          >
            {Icon && <Icon size={20} />}
            <div className="truncate">{item.name}</div>
          </button>
        );
      })}
    </div>
  );
};