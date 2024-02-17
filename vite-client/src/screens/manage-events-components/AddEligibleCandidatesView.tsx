import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  EligibleCandidatesSchema,
  validationEligibleCandidateSchema,
} from "@/validationSchemas/EligibleCadidatesSchema";
import { EventSchema } from "@/validationSchemas/EventSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
interface AddEligibleCandidatesViewProps {
  eventDetails?: EventSchema;
  setIsEligibleCandidateAdded: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddEligibleCandidatesView: FC<AddEligibleCandidatesViewProps> = ({
  eventDetails,
  setIsEligibleCandidateAdded,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const add_eligible_candidate_form = useForm<EligibleCandidatesSchema>({
    resolver: zodResolver(validationEligibleCandidateSchema),
    defaultValues: {
      branch: "1",
      currentAcademicYear: "1",
    },
  });
  const onEligibleCandidateFormSubmit: SubmitHandler<
    EligibleCandidatesSchema
  > = async (data: EligibleCandidatesSchema) => {
    try {
      // Assuming eventDetails is not null and contains the required information
      if (!eventDetails) {
        toast({
          title: "Event details not available",
        });
        return;
      }

      // Include lastEdited and eventCode in the request payload
      const requestData = {
        eventCode: String(eventDetails.eventCode),
        ...data,
        lastEdited: new Date(), // Assuming lastEdited should be the current date
      };

      // Make the API request
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/eligible-candidates/add`,
        requestData
      );
      // Reset the form and show success toast
      add_eligible_candidate_form.reset({
        name: "",
        email: "",
        mobileNumber: "",
        branch: "1",
        currentAcademicYear: "1",
      });
      // toast({
      //   title: "You submitted the following values:",
      //   description: (
      //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //       <code className="text-white">
      //         {JSON.stringify(requestData, null, 2)}
      //       </code>
      //     </pre>
      //   ),
      // });
      setDialogOpen(false);
      toast({
        title: `${JSON.stringify(response.data.message, null, 2)}`,
      });

      setIsEligibleCandidateAdded(true);
    } catch (error) {
      // Handle errors (e.g., show an error toast)
      console.error("Error submitting form:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorMessage =
          axiosError.response?.data?.error || "Unknown error";
        toast({
          title: errorMessage,
          variant: "destructive",
        });
      } else {
        // Handle other types of errors
        console.error("Unexpected error:", error);
        toast({
          title: "Unexpected error:",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger className="pr-2 pb-2">
          <Button>Add Eligible Candidate</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
            <DialogDescription>
              Eligible Candidates for {eventDetails?.name} event
            </DialogDescription>
          </DialogHeader>
          <Form {...add_eligible_candidate_form}>
            <form
              onSubmit={add_eligible_candidate_form.handleSubmit(
                onEligibleCandidateFormSubmit
              )}
              className="space-y-2"
            >
              <div className="space-y-2">
                <FormField
                  control={add_eligible_candidate_form.control}
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
                  control={add_eligible_candidate_form.control}
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
                  control={add_eligible_candidate_form.control}
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
                  control={add_eligible_candidate_form.control}
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
                  control={add_eligible_candidate_form.control}
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

              <Button
                type="submit"
                disabled={add_eligible_candidate_form.formState.isSubmitting}
                className="w-full"
              >
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddEligibleCandidatesView;
