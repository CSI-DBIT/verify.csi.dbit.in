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
} from "@radix-ui/react-popover";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface EditMemberFormProps {
  editingMember: MemberDetailsSchema | null;
}

const EditMemberForm: FC<EditMemberFormProps> = ({ editingMember }) => {
  console.log("EditMemberForm rendering", editingMember);

  const editMemberForm = useForm<MemberDetailsSchema>({
    resolver: zodResolver(validationMemberDetailSchema),
    defaultValues: editingMember
      ? {
          name: editingMember.name,
          email: editingMember.email,
          studentId: editingMember.studentId.toString(),
          branch: editingMember.branch.toString(),
          duration: editingMember.duration.toString(),
          startDate: new Date(editingMember.startDate),
        }
      : undefined,
  });

  const onEditMemberSubmit: SubmitHandler<MemberDetailsSchema> = async (
    data: MemberDetailsSchema
  ) => {
    console.log("submmiting edit form", data);
    toast({
      title: "You submitted the following values:",
      description: <pre>{JSON.stringify(data, null, 2)}</pre>,
    });
    // try {
    //   const response = await axios.post(
    //     "http://localhost:5000/api/edit/member-details",
    //     data
    //   );
    //   toast({
    //     title: "You submitted the following values:",
    //     description: (
    //       <div>{JSON.stringify(response.data.message, null, 2)}</div>
    //     ),
    //   });
    //   setIsMemberAdded(true);
    // } catch (error) {
    //   // Handle errors (e.g., show an error toast)
    //   console.error("Error submitting form:", error);
    //   toast({
    //     title: "Error",
    //     description:
    //       "There was an error submitting the form. Please try again.",
    //     variant: "destructive",
    //   });
    // }
  };

  return (
    <Form {...editMemberForm}>
      <form
        onSubmit={editMemberForm.handleSubmit(onEditMemberSubmit)}
        className="space-y-3"
      >
        <FormField
          control={editMemberForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter member name" {...field} />
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
                <Input placeholder="Enter member email" {...field} />
              </FormControl>
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
                <Input placeholder="Enter member's student ID" {...field} disabled/>
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
              <FormLabel>Member Branch</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Member Branch..." />
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
          control={editMemberForm.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership Duration</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
};
export default EditMemberForm;
