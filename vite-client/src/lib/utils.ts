import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// toast({
//   title: `${eventId}`,
//   description: (
//     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//       <code className="text-white">
//         {JSON.stringify(candidateEmails, null, 2)}
//       </code>
//     </pre>
//   ),
// });
export const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString);

  // Check if date is valid
  if (!(date instanceof Date)) {
    console.error("Invalid date:", dateString);
    return "Invalid Date";
  }

  // Format date in local format
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
