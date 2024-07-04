import { Skeleton } from "@/components/ui/skeleton";

const memberScreenSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Skeleton className="w-[200px] h-[70px] rounded-xl" />

      <div className="flex items-center gap-2">
        <Skeleton className="w-1/3 h-[250px] rounded-xl" />
        <Skeleton className="w-2/3 h-[250px] rounded-xl" />
        <Skeleton className="w-1/3 h-[250px] rounded-xl" />
      </div>

      <Skeleton className="h-[50px] w-[300px]" />
      <Skeleton className="h-[250px] w-full" />
    </div>
  );
};

export default memberScreenSkeleton;
