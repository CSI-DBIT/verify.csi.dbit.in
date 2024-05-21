import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { cn } from "@/lib/utils";
import {
  MemberDetailsSchema,
  validationMemberDetailSchema,
} from "@/validationSchemas/MemberDetailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, Pencil } from "lucide-react";
import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface EditMemberFormProps {
  editingMember: MemberDetailsSchema;
  setIsOperationInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditMemberForm: FC<EditMemberFormProps> = ({
  editingMember,
  setIsOperationInProgress,
}) => {
  console.log("EditMemberForm rendering", editingMember);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const editMemberForm = useForm<MemberDetailsSchema>({
    resolver: zodResolver(validationMemberDetailSchema),
    defaultValues: editingMember
      ? {
          name: editingMember.name,
          email: editingMember.email,
          mobileNumber: editingMember.mobileNumber.toString(),
          gender: editingMember.gender.toString(),
          studentId: editingMember.studentId.toString(),
          branch: editingMember.branch.toString(),
          currentAcademicYear: editingMember.currentAcademicYear.toString(),
          currentSemester: editingMember.currentSemester.toString(),
          duration: editingMember.duration.toString(),
          startDate: new Date(editingMember.startDate),
        }
      : undefined,
  });

  const onEditMemberSubmit: SubmitHandler<MemberDetailsSchema> = async (
    editedMemberDetails: MemberDetailsSchema
  ) => {
    try {
      setIsOperationInProgress(true);
      const editedMemberDetailsWithLastEdited = {
        ...editedMemberDetails,
        lastEdited: new Date(),
      };
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/member/edit?studentId=${
          editingMember.studentId
        }&email=${editingMember.email}`,
        editedMemberDetailsWithLastEdited
      );

      if (response.data.success) {
        toast({
          title: response.data.message,
          variant: "default",
        });
        setIsDialogOpen(false);
      } else {
        toast({
          title: response.data.message,
          variant: "destructive",
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      // Handle errors from the API call (e.g., show an error toast)
      console.error("Error submitting form:", error);
      toast({
        title: "Error updating member details",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsDialogOpen(false);
    } finally {
      setIsOperationInProgress(false);
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
          <div className="flex gap-2 justify-center items-center">
            <Pencil className="h-4 w-4" />
            <span>Edit</span>
          </div>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Member Details</DialogTitle>
          <DialogDescription>
            Edit member details and submit the form
          </DialogDescription>
        </DialogHeader>
        <Form {...editMemberForm}>
          <form
            onSubmit={editMemberForm.handleSubmit(onEditMemberSubmit)}
            className="space-y-3"
          >
            <ScrollArea className="h-[500px] p-4">
              <div className="space-y-2">
                <FormField
                  control={editMemberForm.control}
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
                  control={editMemberForm.control}
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
                  control={editMemberForm.control}
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
                  control={editMemberForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Male</SelectItem>
                          <SelectItem value="2">Female</SelectItem>
                          <SelectItem value="3">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editMemberForm.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Student ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editMemberForm.control}
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
                  control={editMemberForm.control}
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
                <FormField
                  control={editMemberForm.control}
                  name="currentSemester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Semester</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Current Semester..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Sem 1</SelectItem>
                          <SelectItem value="2">Sem 2</SelectItem>
                          <SelectItem value="3">Sem 3</SelectItem>
                          <SelectItem value="4">Sem 4</SelectItem>
                          <SelectItem value="5">Sem 5</SelectItem>
                          <SelectItem value="6">Sem 6</SelectItem>
                          <SelectItem value="7">Sem 7</SelectItem>
                          <SelectItem value="8">Sem 8</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editMemberForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Membership Duration</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Membership Duration..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">One year</SelectItem>
                          <SelectItem value="2">Two Year</SelectItem>
                          <SelectItem value="3">Three year</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editMemberForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <Button className="w-full" type="submit">
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default EditMemberForm;
