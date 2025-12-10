"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");
  const isPopular = searchParams.get("popular");
  const currentTitle = searchParams.get("title");

  // FIX: Initialize with the current URL value so refresh doesn't clear it
  const [value, setValue] = useState(currentTitle || "");
  
  const debouncedValue = useDebounce(value, 500); 

  useEffect(() => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        categoryId: currentCategoryId,
        popular: isPopular,
        title: debouncedValue,
      }
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  }, [debouncedValue, currentCategoryId, isPopular, router, pathname]);

  return (
    <div className="relative w-full md:w-[300px] mb-6 pt-5">
      <Search className="h-4 w-4 absolute top-8 left-3 text-slate-600" />
      <input 
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full pl-9 rounded-full bg-slate-100 border-none focus-visible:ring-slate-200 py-2 text-sm text-slate-600 outline-none placeholder:text-slate-500"
        placeholder="Search for a course"
      />
    </div>
  );
};

// export const SearchInput = () => {
//   return (
//     <div>
//       This is a search input placeholder.
//     </div>
//   )
// }
