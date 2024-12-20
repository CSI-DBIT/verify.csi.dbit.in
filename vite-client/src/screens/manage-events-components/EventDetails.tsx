import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Link, useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import BulkUploadEligibleCandidates from "./BulkUploadEligibleCandidates";
import AddEligibleCandidatesView from "./AddEligibleCandidatesView";
import {
  EventSchema,
  validationEventSchema,
} from "@/validationSchemas/EventSchema";
import { EligibleCandidatesSchema } from "@/validationSchemas/EligibleCadidatesSchema";
import ManageEligibleCandidatesTableView from "./ManageEligibleCandidatesTableView";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Settings } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CardDescription } from "@/components/ui/card";
import { branchText, currentAcademicYearText } from "../constants";
import { useNavigate } from "react-router-dom";
import PageNotFound from "../PageNotFound";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fetchEventDetails = async (eventId: string): Promise<EventSchema> => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_SERVER_URL
      }/api/event/get/event_details?eventCode=${eventId}`
    );
    if (response.data.success) {
      return response.data.eventData as EventSchema;
    } else {
      toast({
        title: response.data.message,
        variant: "destructive",
      });
      return response.data.eventData as EventSchema;
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
    toast({
      title: "Unexpected error:",
      variant: "destructive",
    });
    throw new Error("Unexpected error");
  }
};
const fetchEligibleCandidatesDetails = async (
  eventId: string
): Promise<EligibleCandidatesSchema[]> => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_SERVER_URL
      }/api/eligible-candidate/get/all?eventCode=${eventId}`
    );
    if (response.data.success) {
      return response.data.eligibleCandidates as EligibleCandidatesSchema[];
    } else {
      toast({
        title: response.data.message,
        variant: "destructive",
      });
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    toast({
      title: "Unexpected error:",
      variant: "destructive",
    });
    throw new Error("Unexpected error");
  }
};
const EventDetails = () => {
  const navigateTo = useNavigate();
  // const { eventId } = useParams();
  const eventId =  "v6bjJ8iQ2l-ed1456f8-e954-4550-831a-5872eb6a5e65";

  const [eventDetails, setEventDetails] = useState<EventSchema>();
  const [eligibleCandidates, setEligibleCandidates] = useState<
    EligibleCandidatesSchema[]
  >([]);
  const [isBulkUploadCompleted, setIsBulkUploadCompleted] = useState(false);
  const [isEligibleCandidateAdded, setIsEligibleCandidateAdded] =
    useState(false);
  const [isEventDetailsEdited, setIsEventDetailsEdited] = useState(false);
  const [isEventDetailsDeleted, setIsEventDetailsDeleted] = useState(false);
  const [isOperationInProgress, setIsOperationInProgress] =
    useState<boolean>(false);
  const [isSendingNotifications, setIsSendingNotifications] = useState(false);
  const edit_event_details_form = useForm<EventSchema>({
    resolver: zodResolver(validationEventSchema),
  });
  const [candidatesWithCertificates, setCandidatesWithCertificates] = useState<
    string[]
  >([]);
  useEffect(() => {
    try {
      fetchEventDetails(String(eventId)).then((data) => {
        setEventDetails(data);
        edit_event_details_form.reset({
          name: data.name,
          category: data.category.toString(),
          typeOfEvent: data.typeOfEvent.toString(),
          branchesAllowed: data.branchesAllowed.toString(),
          academicYearAllowed: data.academicYearAllowed.toString(),
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          isMemberOnly: data.isMemberOnly,
        });
        console.log(data);
      });
      fetchEligibleCandidatesDetails(String(eventId)).then((data) => {
        setEligibleCandidates(data);
        console.log("eligible candidates ", data);
        const filteredCandidates = data.filter((candidate) => {
          if (!candidate.uniqueCertificateUrl) {
            return;
          }
          return candidate.uniqueCertificateUrl !== "";
        });
        const candidateEmails = filteredCandidates.map(
          (candidate) => candidate.email
        );
        console.log("candidates with certificates : ", filteredCandidates);
        console.log(candidateEmails);
        setCandidatesWithCertificates(candidateEmails);
      });
      if (
        isEligibleCandidateAdded ||
        isEventDetailsEdited ||
        isEventDetailsDeleted ||
        isBulkUploadCompleted ||
        isOperationInProgress
      ) {
        fetchEventDetails(String(eventId)).then((data) =>
          setEventDetails(data)
        );
        setIsEligibleCandidateAdded(false);
        setIsEventDetailsEdited(false);
        setIsEventDetailsDeleted(false);
        setIsBulkUploadCompleted(false);
        setIsOperationInProgress(false);
      }
      console.log("use effect run");
    } catch (error) {
      console.log("Error fetching data");
    }
  }, [
    eventId,
    isBulkUploadCompleted,
    isEligibleCandidateAdded,
    isOperationInProgress,
    isEventDetailsEdited,
    isEventDetailsDeleted,
    edit_event_details_form,
  ]);

  const onEditEventDetailsFormSubmit: SubmitHandler<EventSchema> = async (
    editingEventDetail: EventSchema
  ) => {
    try {
      setIsEventDetailsEdited(true);
      const editingMemberWithLastEdited = {
        ...editingEventDetail,
        lastEdited: new Date(),
      };
      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/event/edit?eventCode=${eventId}`,
        editingMemberWithLastEdited
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
      setEditEventDialogOpen(false);
    } catch (error) {
      // Handle errors (e.g., show an error toast)
      console.error("Error editing event:", error);
      toast({
        title: "Error editing Event",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setEditEventDialogOpen(false);
    }
  };
  const handleDeleteEventDetails = async () => {
    try {
      setIsEventDetailsDeleted(true);

      // Make the API call with the modified data
      const response = await axios.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/event/delete?eventCode=${eventId}`,
        { lastDeleted: new Date() }
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
      setDeleteEventDialogOpen(false);
      navigateTo("/manage/events");
    } catch (error) {
      // Handle error
      console.error("Error deleting Event:", error);
      // Show error toast
      toast({
        title: "Error deleting Event",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setDeleteEventDialogOpen(false);
    }
  };
  const sendCertificateReceivedMail = async (
    eventId: string,
    candidateEmails: string[]
  ): Promise<void> => {
    try {
      setIsSendingNotifications(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/event/send-certificate-emails/all?eventCode=${eventId}`,
        { candidateEmails, currentDate: new Date() },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
        console.error("Request to server failed");
      }
      fetchEligibleCandidatesDetails(String(eventId)).then((data) => {
        setEligibleCandidates(data);

        const filteredCandidates = data.filter((candidate) => {
          if (!candidate.uniqueCertificateUrl) {
            return;
          }
          return candidate.uniqueCertificateUrl !== "";
        });
        const candidateEmails = filteredCandidates.map(
          (candidate) => candidate.email
        );
        console.log("candidates with certificates : ", filteredCandidates);
        console.log(candidateEmails);
        setCandidatesWithCertificates(candidateEmails);
      });
      setIsSendingNotifications(false);
    } catch (error) {
      toast({
        title: "unexpected error",
        variant: "destructive",
      });
      console.error("Error sending request to server:", error);
      setIsSendingNotifications(false);
    }
  };
  const [editEventDialogOpen, setEditEventDialogOpen] = useState(false);
  const [deleteEventDialogOpen, setDeleteEventDialogOpen] = useState(false);

  return (
    <div>
      {eventDetails && eventId ? (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="p-4 flex flex-grow flex-col gap-2">
            <div className="flex flex-wrap justify-between">
              <div>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to={"/manage/events"}>Events</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize">
                        {eventDetails.name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="flex flex-wrap gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      className="flex justify-ceter items-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Settings</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <Dialog
                      open={editEventDialogOpen}
                      onOpenChange={setEditEventDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          Edit Event
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Event Details</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...edit_event_details_form}>
                          <form
                            onSubmit={edit_event_details_form.handleSubmit(
                              onEditEventDetailsFormSubmit
                            )}
                            className="space-y-2"
                          >
                            <ScrollArea className="h-[500px] p-4">
                              <div className="space-y-2">
                                <FormField
                                  control={edit_event_details_form.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter Event Name"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={edit_event_details_form.control}
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
                                  control={edit_event_details_form.control}
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
                                          <SelectItem value="1">
                                            Talks
                                          </SelectItem>
                                          <SelectItem value="2">
                                            Competitions
                                          </SelectItem>
                                          <SelectItem value="3">
                                            Workshops
                                          </SelectItem>
                                          <SelectItem value="4">
                                            Others
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={edit_event_details_form.control}
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
                                          <SelectItem value="1">
                                            Technical
                                          </SelectItem>
                                          <SelectItem value="2">
                                            Non Technical
                                          </SelectItem>
                                          <SelectItem value="3">
                                            Others
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={edit_event_details_form.control}
                                  name="academicYearAllowed"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Academic Year Allowed
                                      </FormLabel>
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
                                  control={edit_event_details_form.control}
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
                                          <SelectItem value="3">
                                            EXTC
                                          </SelectItem>
                                          <SelectItem value="4">
                                            MECH
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="flex gap-4 items-center">
                                  <FormField
                                    control={edit_event_details_form.control}
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
                                                  !field.value &&
                                                    "text-muted-foreground"
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
                                          <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                          >
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
                                    control={edit_event_details_form.control}
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
                                                  !field.value &&
                                                    "text-muted-foreground"
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
                                          <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                          >
                                            <Calendar
                                              mode="single"
                                              selected={field.value}
                                              onSelect={field.onChange}
                                              disabled={(date) =>
                                                date > new Date() ||
                                                date < new Date("1900-01-01") ||
                                                date <
                                                  edit_event_details_form.watch(
                                                    "startDate"
                                                  )
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
                              disabled={
                                edit_event_details_form.formState.isSubmitting
                              }
                              className="w-full"
                            >
                              Submit
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={deleteEventDialogOpen}
                      onOpenChange={setDeleteEventDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          Delete Event
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Event Details</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this event?
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[100px] rounded-md border p-3">
                          <CardDescription>
                            Name: {eventDetails?.name}
                          </CardDescription>
                          <CardDescription>
                            Category: {eventDetails?.category}
                          </CardDescription>
                          <CardDescription>
                            Branch:{" "}
                            {branchText[Number(eventDetails?.branchesAllowed)]}
                          </CardDescription>
                          <CardDescription>
                            Academic Year Allowed :{" "}
                            {
                              currentAcademicYearText[
                                Number(eventDetails?.academicYearAllowed)
                              ]
                            }
                          </CardDescription>
                          <CardDescription>
                            Start Date:{" "}
                            {eventDetails?.startDate
                              ? new Date(
                                  eventDetails.startDate
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : ""}
                          </CardDescription>
                          <CardDescription>
                            <span className="font-bold">End Date:</span>{" "}
                            {eventDetails?.endDate
                              ? new Date(
                                  eventDetails.endDate
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : ""}
                          </CardDescription>
                          <CardDescription>
                            Is Member Only :{" "}
                            {String(eventDetails?.isMemberOnly)}
                          </CardDescription>
                        </ScrollArea>
                        {eventDetails ? (
                          <DialogFooter>
                            <Button
                              variant="destructive"
                              className="hover:bg-red-600 w-full"
                              onClick={async () => handleDeleteEventDetails()}
                            >
                              Permanant Delete
                            </Button>
                          </DialogFooter>
                        ) : null}
                      </DialogContent>
                    </Dialog>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Manage</DropdownMenuLabel>
                    {candidatesWithCertificates.length > 0 ? (
                      <DropdownMenuItem
                        onSelect={() => {
                          sendCertificateReceivedMail(
                            eventId,
                            candidatesWithCertificates
                          );
                        }}
                        disabled={isSendingNotifications}
                      >
                        {isSendingNotifications
                          ? "Sending Emails to all..."
                          : "Send Emails to all"}
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem disabled>Send Emails</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <AddEligibleCandidatesView
                  setIsEligibleCandidateAdded={setIsEligibleCandidateAdded}
                  eventDetails={eventDetails}
                />
                <BulkUploadEligibleCandidates
                  eventDetails={eventDetails}
                  setIsBulkUploadCompleted={setIsBulkUploadCompleted}
                />
              </div>
            </div>
            <h2 className="scroll-m-20 pb-2 text-3xl font-bold tracking-tight first:mt-0 capitalize">
              {eventDetails ? eventDetails.name : "Event Details"}
            </h2>
            <div>
              <ManageEligibleCandidatesTableView
                setIsOperationInProgress={setIsOperationInProgress}
                eligibleCandidatesData={eligibleCandidates}
                eventCode={eventId}
              />
            </div>
          </div>
          <Footer />
          <Toaster />
        </div>
      ) : (
        <PageNotFound />
      )}
    </div>
  );
};

export default EventDetails;
