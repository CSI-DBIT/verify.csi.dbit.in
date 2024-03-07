import { Skeleton } from "@/components/ui/skeleton";

export const CertificateScreenSkeleton = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-3">
      <Skeleton className="h-[400px] w-[1000px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[800px]" />
        <Skeleton className="h-4 w-[800px]" />
      </div>
    </div>
  );
};
