import { Card } from "@/components/ui/card";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { EventSchema } from "@/validationSchemas/EventSchema";
import {
  Bookmark,
  CalendarCheck,
  Puzzle,
  Server,
  ServerOff,
  Shrub,
  Speech,
  Trophy,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";

interface EventCardProps {
  event: EventSchema;
  index: number;
}
const EventCard: FC<EventCardProps> = ({ event, index }) => {
  return (
    <Link to={`/manage/events/${event.eventCode}`}>
      <Card
        key={index}
        className="h-full w-full border-4 hover:bg-accent p-4 flex flex-col gap-y-2"
      >
        <div className="flex flex-wrap justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {event.category == "1" ? (
                    <Speech className="text-muted-foreground" />
                  ) : event.category == "2" ? (
                    <Trophy className="text-muted-foreground" />
                  ) : event.category == "3" ? (
                    <Puzzle className="text-muted-foreground" />
                  ) : (
                    <Bookmark className="text-muted-foreground" />
                  )}

                </TooltipTrigger>
                <TooltipContent>
                  {event.category == "1"
                    ? "Talks"
                    : event.category == "2"
                    ? "Competition"
                    : event.category == "3"
                    ? "Workshops"
                    : "Others"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="text-2xl font-semibold capitalize">
              {event.name}
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {event.isMemberOnly ? <UserRoundCheck /> : <UsersRound />}
              </TooltipTrigger>
              <TooltipContent>
                {event.isMemberOnly ? "For Members Only" : "Open to All"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          {event.typeOfEvent == "1" ? (
            <Server className="text-muted-foreground/70" />
          ) : event.typeOfEvent == "2" ? (
            <ServerOff className="text-muted-foreground/70" />
          ) : (
            <Shrub className="text-muted-foreground/70" />
          )}
          <div className="capitalize text-muted-foreground/70">
            {event.typeOfEvent == "1"
              ? "Technical"
              : event.typeOfEvent == "2"
              ? "Non-technical"
              : "Others"}
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <CalendarCheck className="text-muted-foreground/70" />
          {new Date(event.endDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </Card>
    </Link>
  );
};

export default EventCard;
