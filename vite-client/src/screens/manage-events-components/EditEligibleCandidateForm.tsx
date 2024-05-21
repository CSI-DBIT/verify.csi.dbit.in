import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  EligibleCandidatesSchema,
  validationEligibleCandidateSchema,
} from "@/validationSchemas/EligibleCadidatesSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface EditEligibleCandidateFormProps {
  eventCode: String;
  editingEligibleCandidate: EligibleCandidatesSchema;
  setIsOperationInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditEligibleCandidateForm: FC<EditEligibleCandidateFormProps> = ({
  eventCode,
  editingEligibleCandidate,
  setIsOperationInProgress,
}) => {
  const editEligibleCandidateForm = useForm<EligibleCandidatesSchema>({
    resolver: zodResolver(validationEligibleCandidateSchema),
    defaultValues: editingEligibleCandidate
      ? {
          name: editingEligibleCandidate.name,
          email: editingEligibleCandidate.email,
          mobileNumber: editingEligibleCandidate.mobileNumber.toString(),
          branch: editingEligibleCandidate.branch.toString(),
          currentAcademicYear:
            editingEligibleCandidate.currentAcademicYear.toString(),
          uniqueCertificateCode: editingEligibleCandidate.uniqueCertificateCode,
        }
      : undefined,
  });

  const onEditEligibleCandidateFormSubmit: SubmitHandler<
    EligibleCandidatesSchema
  > = async (editingEligibleCandidate: EligibleCandidatesSchema) => {
    try {
      setIsOperationInProgress(true);
      const editingeligibleCandidateWithLastEdited = {
        ...editingEligibleCandidate,
        currentDate: new Date(),
      };
      console.log("editingEligibleCandidate: ", editingEligibleCandidate);
      const response = await axios.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/eligible-candidate/edit?uniqueCertCode=${
          editingEligibleCandidate.uniqueCertificateCode
        }&eventCode=${eventCode}`,
        editingeligibleCandidateWithLastEdited
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
      // Handle errors (e.g., show an error toast)
      console.error("Error editing eligible candidate:", error);
      toast({
        title: "Error editing Eligible Candidate",
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
          edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Eligible Candidates</DialogTitle>
          <DialogDescription>
            Edit eligible candidates details
          </DialogDescription>
        </DialogHeader>
        <Form {...editEligibleCandidateForm}>
          <form
            onSubmit={editEligibleCandidateForm.handleSubmit(
              onEditEligibleCandidateFormSubmit
            )}
            className="space-y-3"
          >
            <div className="space-y-2">
              <FormField
                control={editEligibleCandidateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editEligibleCandidateForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editEligibleCandidateForm.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Mobile Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editEligibleCandidateForm.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="select member branch..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">
                          Information Technology
                        </SelectItem>
                        <SelectItem value="2">Computer Science</SelectItem>
                        <SelectItem value="3">
                          Electronics and Telecommunication
                        </SelectItem>
                        <SelectItem value="4">Mechanical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editEligibleCandidateForm.control}
                name="currentAcademicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Academic Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Current Academic Year..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">FE</SelectItem>
                        <SelectItem value="2">SE</SelectItem>
                        <SelectItem value="3">TE</SelectItem>
                        <SelectItem value="4">BE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full" type="submit">
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default EditEligibleCandidateForm;
