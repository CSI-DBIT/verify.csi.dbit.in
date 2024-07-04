// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import { Toaster } from "@/components/ui/toaster";
// import AddEventForm from "./manage-events-components/AddEventForm";
// import { useEffect, useState } from "react";
// import { EventSchema } from "@/validationSchemas/EventSchema";
// import axios from "axios";
// import { toast } from "@/components/ui/use-toast";
// import EventCard from "./manage-events-components/EventCard";

// const ManageEvent = () => {
//   const [events, setEvents] = useState<EventSchema[]>([]);
//   const [isEventAdded, setIsEventAdded] = useState(false);
//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_SERVER_URL}/api/event/get/all_events`
//       );
//       if (response.data.success) {
//         return response.data.allEvents as EventSchema[];
//       } else {
//         toast({
//           title: response.data.message,
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Unexpected error:",
//         variant: "destructive",
//       });
//       throw new Error("Unexpected error");
//     }
//   };
//   useEffect(() => {
//     fetchEvents().then((data) => {
//       setEvents(data);
//       console.log(data);
//     });
//     if (isEventAdded) {
//       fetchEvents().then((data) => setEvents(data));
//       setIsEventAdded(false);
//     }
//   }, [isEventAdded]); // Fetch events on component mount
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <div className="p-4 flex flex-grow flex-col gap-2">
//         <h2 className="scroll-m-20 pb-2 text-3xl font-bold tracking-tight first:mt-0">
//           Completed Events
//         </h2>
//         <div className="lg:grid flex flex-col grid-cols-5 gap-3">
//           <AddEventForm setIsEventAdded={setIsEventAdded} />
//           {events.length > 0 ? (
//             events.map((event, index) => (
//               <EventCard event={event} index={index} />
//             ))
//           ) : (
//             <div></div>
//           )}
//         </div>
//       </div>
//       <Footer />
//       <Toaster />
//     </div>
//   );
// };

// export default ManageEvent;
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import AddEventForm from "./manage-events-components/AddEventForm";
import { useEffect, useState } from "react";
import { EventSchema } from "@/validationSchemas/EventSchema";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import EventCard from "./manage-events-components/EventCard";
import { Input } from "@/components/ui/input";

const ManageEvent = () => {
  const [events, setEvents] = useState<EventSchema[]>([]);
  const [isEventAdded, setIsEventAdded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/event/get/all_events`
      );
      if (response.data.success) {
        return response.data.allEvents as EventSchema[];
      } else {
        toast({
          title: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected error:",
        variant: "destructive",
      });
      throw new Error("Unexpected error");
    }
  };

  useEffect(() => {
    fetchEvents().then((data) => {
      setEvents(data);
      console.log(data);
    });
    if (isEventAdded) {
      fetchEvents().then((data) => setEvents(data));
      setIsEventAdded(false);
    }
  }, [isEventAdded]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-4 flex flex-grow flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="scroll-m-20 pb-2 text-3xl font-bold tracking-tight first:mt-0">
            Completed Events
          </h2>
          <Input
            type="text"
            placeholder="Search events"
            value={searchQuery}
            onChange={handleSearch}
            className="w-2/5"
          />
        </div>
        <div className="lg:grid flex flex-col grid-cols-5 gap-3">
          <AddEventForm setIsEventAdded={setIsEventAdded} />
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <EventCard key={index} event={event} index={index} />
            ))
          ) : (
            <div>No events found</div>
          )}
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default ManageEvent;
