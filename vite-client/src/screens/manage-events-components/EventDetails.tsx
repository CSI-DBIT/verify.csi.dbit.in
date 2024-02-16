import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { useParams } from "react-router-dom";
import { EventSchema } from "@/validationSchemas/EventSchema";

const EventDetails = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState<EventSchema[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/event/details?eventCode=${eventId}`);
        setEventDetails(response.data.event);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-4 flex flex-grow flex-col gap-2">
        <h2 className="scroll-m-20 pb-2 text-3xl font-bold tracking-tight first:mt-0">
          {eventDetails ? eventDetails.name : "Event Details"}
        </h2>
        {/* Display other event details here */}
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default EventDetails;
