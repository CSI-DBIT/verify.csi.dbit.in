import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
interface AddMemberViewProps {
  setIsMemberAdded: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddMemberView: FC<AddMemberViewProps> = ({ setIsMemberAdded }) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger className="pr-2 pb-2">
          <Button>Add Member</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new member</DialogTitle>
            <DialogDescription>
              Add single member by providing the required fields
            </DialogDescription>
          </DialogHeader>
          <AddMemberForm setIsMemberAdded={setIsMemberAdded} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddMemberView;
interface AddMemberViewProps {
  setIsMemberAdded: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddMemberForm: FC<AddMemberViewProps> = ({ setIsMemberAdded }) => {
  const add_member_form = useForm<MemberDetailsSchema>({
    resolver: zodResolver(validationMemberDetailSchema),
    defaultValues: {
      branch: "1",
      currentAcademicYear: "1",
      currentSemester: "1",
      duration: "1",
      startDate: new Date(),
    },
  });

  const onMemberFormSubmit: SubmitHandler<MemberDetailsSchema> = async (
    data: MemberDetailsSchema
  ) => {
    try {
      console.log("btn press");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/member/add`,
        data
      );
      add_member_form.reset({
        name: "",
        email: "",
        studentId: "",
        branch: "1",
        currentAcademicYear: "1",
        currentSemester: "1",
        duration: "1",
        startDate: new Date(),
      });

      toast({
        title: `${JSON.stringify(response.data.message, null, 2)}`,
      });
      setIsMemberAdded(true);
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
    <Form {...add_member_form}>
      <form
        onSubmit={add_member_form.handleSubmit(onMemberFormSubmit)}
        className="space-y-2"
      >
        <ScrollArea className="h-[500px] p-4">
          <div className="space-y-2">
            <FormField
              control={add_member_form.control}
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
              control={add_member_form.control}
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
              control={add_member_form.control}
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
              control={add_member_form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Gender</FormLabel>
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
              control={add_member_form.control}
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
              control={add_member_form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member Branch</FormLabel>
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
                      <SelectItem value="1">Information Technology</SelectItem>
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
              control={add_member_form.control}
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
              control={add_member_form.control}
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
              control={add_member_form.control}
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
              control={add_member_form.control}
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
        <Button type="submit" disabled={add_member_form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
