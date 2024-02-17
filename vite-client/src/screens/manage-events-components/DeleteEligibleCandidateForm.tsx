import { CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { branchText } from "../constants";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { FC } from "react";
import { EligibleCandidatesSchema } from "@/validationSchemas/EligibleCadidatesSchema";

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
      await axios.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/eligible-candidate/delete?uniqueCertCode=${
          deletingEligibleCandidate.uniqueCertificateCode
        }`,
        { lastDeleted: new Date() }
      );

      // Show success toast
      toast({
        title: "Eligible Candidate deleted successfully",
        variant: "default",
      });
    } catch (error) {
      // Handle error
      console.error("Error deleting eligible Candidate:", error);
      // Show error toast
      toast({
        title: "Error deleting eligible candidate",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Eligible Candidate</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this Candidate?
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
          variant="outline"
          className="hover:bg-red-600 w-full"
          onClick={async () => handleDelete(deletingEligibleCandidate)}
        >
          Confirm Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteEligibleCandidateForm;
