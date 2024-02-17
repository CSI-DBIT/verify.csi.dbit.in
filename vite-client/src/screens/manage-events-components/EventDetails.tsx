import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import BulkUploadEligibleCandidates from "./BulkUploadEligibleCandidates";
import AddEligibleCandidatesView from "./AddEligibleCandidatesView";
import { EventSchema } from "@/validationSchemas/EventSchema";
import { EligibleCandidatesSchema } from "@/validationSchemas/EligibleCadidatesSchema";
const fetchEventDetails = async (eventId: string): Promise<EventSchema> => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_SERVER_URL
      }/api/event/details?eventCode=${eventId}`
    );
    return response.data.event as EventSchema;
  } catch (error) {
    console.error("Error fetching data:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data?.error || "Unknown error";
      toast({
        title: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error);
      toast({
        title: "Unexpected error:",
        variant: "destructive",
      });
      throw new Error("Unexpected error");
    }
  }
};
const fetchEligibleCandidatesDetails = async (
  eventId: string
): Promise<EligibleCandidatesSchema> => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_SERVER_URL
      }/api/get/eligible-candidates=${eventId}`
    );
    return response.data.eventinfo
      .eligibleCandidates as EligibleCandidatesSchema;
  } catch (error) {
    console.error("Error fetching data:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data?.error || "Unknown error";
      toast({
        title: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error);
      toast({
        title: "Unexpected error:",
        variant: "destructive",
      });
      throw new Error("Unexpected error");
    }
  }
};
const EventDetails = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState<EventSchema>();
  const [eligibleCandidates, setEligibleCandidates] =
    useState<EligibleCandidatesSchema>();
  const [isBulkUploadCompleted, setIsBulkUploadCompleted] = useState(false);
  const [isEligibleCandidateAdded, setIsEligibleCandidateAdded] =
    useState(false);

  useEffect(() => {
    fetchEventDetails(String(eventId)).then((data) => {
      setEventDetails(data);
      console.log(data);
    });
    fetchEligibleCandidatesDetails(String(eventId)).then((data) => {
      setEventDetails(data);
      console.log(data);
    });
    if (isEligibleCandidateAdded || isBulkUploadCompleted) {
      fetchEventDetails(String(eventId)).then((data) => setEventDetails(data));
      setIsEligibleCandidateAdded(false);
      setIsBulkUploadCompleted(false);
    }
    console.log("use effect run");
  }, [eventId, isBulkUploadCompleted, isEligibleCandidateAdded]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-4 flex flex-grow flex-col gap-2">
        <h2 className="scroll-m-20 pb-2 text-3xl font-bold tracking-tight first:mt-0 capitalize">
          {eventDetails ? eventDetails.name : "Event Details"}
        </h2>
        <div className="flex flex-wrap lg:gap-2">
          <BulkUploadEligibleCandidates
            eventDetails={eventDetails}
            setIsBulkUploadCompleted={setIsBulkUploadCompleted}
          />
          <AddEligibleCandidatesView
            setIsEligibleCandidateAdded={setIsEligibleCandidateAdded}
            eventDetails={eventDetails}
          />
        </div>
        <div>
          {/* <ManageEligibleCadidatesTable
            memberTabledata={memberTabledata}
            setIsOperationInProgress={setIsOperationInProgress}
          /> */}
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default EventDetails;
