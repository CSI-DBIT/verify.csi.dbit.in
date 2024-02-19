// import { CardDescription } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { branchText, durationText } from "../constants";
// import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";
// import {
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import { toast } from "@/components/ui/use-toast";
// import { FC } from "react";

// interface DeleteMemberFormProps {
//   deletingMember: MemberDetailsSchema;
//   setIsOperationInProgress: React.Dispatch<React.SetStateAction<boolean>>;
// }
// const DeleteMemberForm: FC<DeleteMemberFormProps> = ({
//   deletingMember,
//   setIsOperationInProgress,
// }) => {
//   const handleDelete = async (deletingMember: MemberDetailsSchema) => {
//     try {
//       setIsOperationInProgress(true);
//       await axios.put(
//         `${import.meta.env.VITE_SERVER_URL}/api/member/delete?studentId=${
//           deletingMember.studentId
//         }`
//       );
//       // Show success toast
//       toast({
//         title: "Member deleted successfully",
//         variant: "default",
//       });
//     } catch (error) {
//       // Handle error
//       console.error("Error deleting member:", error);
//       // Show error toast
//       toast({
//         title: "Error deleting member",
//         description: error.message || "An unexpected error occurred",
//         variant: "destructive",
//       });
//     }
//   };
//   return (
//     <DialogContent>
//       <DialogHeader>
//         <DialogTitle>Delete Member</DialogTitle>
//         <DialogDescription>
//           Are you sure you want to delete this member?
//         </DialogDescription>
//       </DialogHeader>
//       <ScrollArea className="h-[100px] rounded-md border p-3">
//         <CardDescription>Name: {deletingMember.name}</CardDescription>
//         <CardDescription>Email: {deletingMember.email}</CardDescription>
//         <CardDescription>
//           Student id: {deletingMember.studentId}
//         </CardDescription>
//         <CardDescription>
//           Branch: {branchText[Number(deletingMember.branch)]}
//         </CardDescription>
//         <CardDescription>
//           Duration: {durationText[Number(deletingMember.duration)]}
//         </CardDescription>
//         <CardDescription>
//           Start Date: {deletingMember.startDate.toString()}
//         </CardDescription>
//       </ScrollArea>
//       <DialogFooter>
//         <Button
//           variant="outline"
//           className="hover:bg-red-600"
//           onClick={async () => handleDelete(deletingMember)}
//         >
//           Confirm Delete
//         </Button>
//       </DialogFooter>
//     </DialogContent>
//   );
// };

// export default DeleteMemberForm;
import { CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  branchText,
  currentAcademicYearText,
  currentSemesterText,
  durationText,
  genderText,
} from "../constants";
import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { FC, useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface DeleteMemberFormProps {
  deletingMember: MemberDetailsSchema;
  setIsOperationInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteMemberForm: FC<DeleteMemberFormProps> = ({
  deletingMember,
  setIsOperationInProgress,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const handleDelete = async (deletingMember: MemberDetailsSchema) => {
    try {
      setIsOperationInProgress(true);

      // Make the API call with the modified data
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/member/delete?studentId=${
          deletingMember.studentId
        }`,
        {
          currentDate: new Date(),
          email: deletingMember.email,
          mobileNumber: deletingMember.mobileNumber,
        }
      );

      // Show success toast
      toast({
        title: "Member deleted successfully",
        variant: "default",
      });
      setIsDialogOpen(false);
    } catch (error) {
      // Handle error
      console.error("Error deleting member:", error);
      // Show error toast
      toast({
        title: "Error deleting member",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this member?
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[100px] rounded-md border p-3">
          <CardDescription>Name: {deletingMember.name}</CardDescription>
          <CardDescription>Email: {deletingMember.email}</CardDescription>
          <CardDescription>
            Mobile Number: {deletingMember.mobileNumber}
          </CardDescription>
          <CardDescription>
            Gender: {genderText[Number(deletingMember.gender)]}
          </CardDescription>
          <CardDescription>
            Student id: {deletingMember.studentId}
          </CardDescription>
          <CardDescription>
            Branch: {branchText[Number(deletingMember.branch)]}
          </CardDescription>
          <CardDescription>
            Current Academic Year:{" "}
            {
              currentAcademicYearText[
                Number(deletingMember.currentAcademicYear)
              ]
            }
          </CardDescription>
          <CardDescription>
            Current Semester:{" "}
            {currentSemesterText[Number(deletingMember.currentSemester)]}
          </CardDescription>
          <CardDescription>
            Duration: {durationText[Number(deletingMember.duration)]}
          </CardDescription>
          <CardDescription>
            Start Date: {deletingMember.startDate.toString()}
          </CardDescription>
        </ScrollArea>
        <DialogFooter>
          <Button
            variant="outline"
            className="hover:bg-red-600 w-full"
            onClick={async () => handleDelete(deletingMember)}
          >
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMemberForm;
