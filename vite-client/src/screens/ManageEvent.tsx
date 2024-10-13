import { Toaster } from "@/components/ui/toaster";
import AddEventForm from "./manage-events-components/AddEventForm";
import { useEffect, useState } from "react";
import { EventSchema } from "@/validationSchemas/EventSchema";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import EventCard from "./manage-events-components/EventCard";
import { Input } from "@/components/ui/input";
import EventCalendar, { EventsMap } from "@/components/EventCalendar";

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

  const [calendarEvents, setCalendarEvents] = useState<EventsMap>({
    "2024-09-30": ["Meeting with team", "Project deadline"],
    // other initial events
  });

  const [selectedEventDate, setSelectedEventDate] = useState<string | null>(null);

  const handleDateSelect = (date: string) => {
    setSelectedEventDate(date);
    // Open modal or drawer here
  };

  const handleEventSave = (date: string, newEvents: string[]) => {
    setCalendarEvents((prev) => ({
      ...prev,
      [date]: newEvents,
    }));
    setSelectedEventDate(null); // Close modal or drawer
  };

  return (
    <div>
      <div className="p-4 flex flex-col gap-2 min-h-screen">
        <EventCalendar
          events={calendarEvents}
          onDateSelect={handleDateSelect}
        />
        <div>
        {selectedEventDate && (
          <h1>hello {selectedEventDate}</h1>
        )}
        </div>
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
          {filteredEvents.length > 0 && events ? (
            filteredEvents.map((event, index) => (
              <EventCard key={index} event={event} index={index} />
            ))
          ) : (
            <div>No events found</div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ManageEvent;
