import { Categories } from "./_components/categories";
import { CourseCard } from "./_components/course-card";
import { getCourses } from "@/actions/get-courses";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
    popular: string;
  }
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { courses, categories } = await getCourses({
    title: searchParams.title,
    categoryId: searchParams.categoryId,
    isPopular: searchParams.popular === "true"
  });

  return (
    <>
      {/* Added top padding (pt-6) since search bar is gone */}
      <div className="p-6 pt-6 space-y-4">
        
        {/* Categories Section */}
        <div className="px-1">
           <Categories items={categories} />
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courses.map((item) => (
            <CourseCard
              key={item.id}
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl}
              chaptersLength={item.chaptersLength}
              price={item.price}
              progress={item.progress}
              category={item.category}
              isEnrolled={item.isEnrolled}
            />
          ))}
        </div>
        
        {courses.length === 0 && (
          <div className="text-center text-sm text-muted-foreground mt-10">
            No courses found
          </div>
        )}
      </div>
    </>
  );
}

export default SearchPage;