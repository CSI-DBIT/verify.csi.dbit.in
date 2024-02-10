import { CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { branchText, durationText } from "./constants";
import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";

const DeleteMemberForm = ({
  deletingMember,
}: {
  deletingMember: MemberDetailsSchema;
}) => {
  return (
    <div className="p-2">
      <ScrollArea className="h-[100px] rounded-md border p-4">
        <CardDescription>Name: {deletingMember?.name}</CardDescription>
        <CardDescription>Email: {deletingMember?.email}</CardDescription>
        <CardDescription>
          Student id: {deletingMember?.studentId}
        </CardDescription>
        <CardDescription>
          Branch: {branchText[Number(deletingMember?.branch)]}
        </CardDescription>
        <CardDescription>
          Duration: {durationText[Number(deletingMember?.duration)]}
        </CardDescription>
        <CardDescription>
          Start Date: {deletingMember?.startDate.toString()}
        </CardDescription>
      </ScrollArea>
    </div>
  );
};

export default DeleteMemberForm;
