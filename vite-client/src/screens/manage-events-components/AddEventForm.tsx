import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface AddEventFormProps {
  setIsEventAdded: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEventForm: FC<AddEventFormProps> = ({ setIsEventAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const addEventForm = useForm<EventSchema>({
    resolver: zodResolver(validationEventSchema),
    defaultValues: {
      category: "1",
      typeOfEvent: "1",
      branchesAllowed: "0",
      academicYearAllowed: "0",
      startDate: new Date(),
      endDate: new Date(),
      isMemberOnly: false,
    },
  });
  const onAddEventFormSubmit: SubmitHandler<EventSchema> = async (
    data: EventSchema
  ) => {
    setIsSubmitting(true);
    try {
      const eventData = {
        name: String(data.name),
        category: String(data.category),
        typeOfEvent: String(data.typeOfEvent),
        branchesAllowed: String(data.branchesAllowed),
        academicYearAllowed: String(data.academicYearAllowed),
        isMemberOnly: String(data.isMemberOnly),
        startDate: String(data.startDate),
        endDate: String(data.endDate),
        isBranchSpecific: String(data.branchesAllowed !== "0"),
        isAcademicYearSpecific: String(data.academicYearAllowed !== "0"),
        dateOfCreation: String(new Date()),
      };
      console.log(eventData);

      // Now you can submit the form data to your server
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/event/add`,
        eventData
      );
      // Reset the form after successful submission
      addEventForm.reset({
        name: "",
        category: "1",
        typeOfEvent: "1",
        branchesAllowed: "0",
        academicYearAllowed: "0",
        startDate: new Date(),
        endDate: new Date(),
      });
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
      setIsEventAdded(true);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Unexpected error",
        variant: "destructive",
      });
      setIsDialogOpen(false);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="min-h-[120px] h-full w-full flex gap-2 border-dashed border-4"
        >
          <PlusCircle />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
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
                  name="isMemberOnly"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0 py-2">
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
                <div className="flex gap-4 items-center">
                  <FormField
                    control={addEventForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                type="button"
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
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
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addEventForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                type="button"
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
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
                                date > new Date() ||
                                date < new Date("1900-01-01") ||
                                date < addEventForm.watch("startDate")
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
              </div>
            </ScrollArea>
            <Button
              type="submit"
              disabled={addEventForm.formState.isSubmitting || isSubmitting}
              className="w-full"
            >
              create event
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventForm;
