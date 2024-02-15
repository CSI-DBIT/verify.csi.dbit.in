import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
  EventSchema,
  validationEventSchema,
} from "@/validationSchemas/EventSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface AddEventFormProps {}
const AddEventForm: FC<AddEventFormProps> = () => {
  const addEventForm = useForm<EventSchema>({
    resolver: zodResolver(validationEventSchema),
    defaultValues: {},
  });
  const onAddEventFormSubmit: SubmitHandler<EventSchema> = async (
    data: EventSchema
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/event/add`,
        data
      );
      addEventForm.reset({
        name: "",
      });

      toast({
        title: `${JSON.stringify(response.data.message, null, 2)}`,
      });
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
    <Form {...addEventForm}>
      <form
        onSubmit={addEventForm.handleSubmit(onAddEventFormSubmit)}
        className="space-y-2"
      >
        <ScrollArea className="h-[500px] p-4">
          <div className="space-y-2">
            <FormField
              control={addEventForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Event Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addEventForm.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Talks</SelectItem>
                      <SelectItem value="2">Competitions</SelectItem>
                      <SelectItem value="3">Workshops</SelectItem>
                      <SelectItem value="4">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addEventForm.control}
              name="typeOfEvent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Event Type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Technical</SelectItem>
                      <SelectItem value="2">Non Technical</SelectItem>
                      <SelectItem value="3">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addEventForm.control}
              name="isMemberOnly"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Is Member Only</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={addEventForm.control}
              name="academicYearAllowed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year Allowed</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Academic Year..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">All</SelectItem>
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
              control={addEventForm.control}
              name="branchesAllowed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branches Allowed</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Branches..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">All</SelectItem>
                      <SelectItem value="1">IT</SelectItem>
                      <SelectItem value="2">CS</SelectItem>
                      <SelectItem value="3">EXTC</SelectItem>
                      <SelectItem value="4">MECH</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addEventForm.control}
              name="dateOfCompletion"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Completion</FormLabel>
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
        <Button type="submit" disabled={addEventForm.formState.isSubmitting} className="w-full">
          create event
        </Button>
      </form>
    </Form>
  );
};

export default AddEventForm;
