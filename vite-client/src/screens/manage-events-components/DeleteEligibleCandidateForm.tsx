import { CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { branchText } from "../constants";
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
import { FC } from "react";
import { EligibleCandidatesSchema } from "@/validationSchemas/EligibleCadidatesSchema";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Eraser } from "lucide-react";

interface DeleteEligibleCandidateFormProps {
  deletingEligibleCandidate: EligibleCandidatesSchema;
  setIsOperationInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteEligibleCandidateForm: FC<DeleteEligibleCandidateFormProps> = ({
  deletingEligibleCandidate,
  setIsOperationInProgress,
}) => {
  const handleDelete = async (
    deletingEligibleCandidate: EligibleCandidatesSchema
  ) => {
    try {
      setIsOperationInProgress(true);

      // Make the API call with the modified data
      const response = await axios.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/eligible-candidate/delete?uniqueCertCode=${
          deletingEligibleCandidate.uniqueCertificateCode
        }`,
        { currentDate: new Date() }
      );
      if (response.data.success) {
        toast({
          title: response.data.message,
        });
      } else {
        toast({
          title: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      // Handle error
      console.error("Error deleting eligible Candidate:", error);
      // Show error toast
      toast({
        title: "Error deleting eligible candidate",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          <Eraser className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permanant Delete Candidate</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanantly delete this Candidate?
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[100px] rounded-md border p-3">
          <CardDescription>
            Name: {deletingEligibleCandidate.name}
          </CardDescription>
          <CardDescription>
            Email: {deletingEligibleCandidate.email}
          </CardDescription>
          <CardDescription>
            Branch: {branchText[Number(deletingEligibleCandidate.branch)]}
          </CardDescription>
        </ScrollArea>
        <DialogFooter>
          <Button
            variant="destructive"
            className="hover:bg-red-600 w-full"
            onClick={async () => handleDelete(deletingEligibleCandidate)}
          >
            Permanant Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEligibleCandidateForm;
