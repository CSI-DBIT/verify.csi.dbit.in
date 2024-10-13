import { FC, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  setMonth,
  setYear,
  addMonths,
  subMonths,
  isBefore,
  isAfter,
} from "date-fns";
import { Button } from "./ui/button";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface EventsMap {
  [key: string]: string[];
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const totalYears = 50;
const yearRange = Array.from(
  { length: totalYears },
  (_, index) => 2000 + index
);

interface EventCalendarProps {
  events?: EventsMap;
  onDateSelect?: (date: string) => void;
  minDate?: Date;
  maxDate?: Date;
}

const EventCalendar: FC<EventCalendarProps> = ({
  events = {},
  onDateSelect,
  minDate = new Date(2000, 0, 1),
  maxDate = new Date(2049, 11, 31),
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [yearOffset, setYearOffset] = useState(0);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const daysInCalendar = eachDayOfInterval({ start: startDate, end: endDate });
  const yearsToShow = yearRange.slice(yearOffset * 10, yearOffset * 10 + 12);

  const handleMonthChange = (monthIndex: number) => {
    setCurrentDate((prev) => setMonth(prev, monthIndex));
  };

  const handleYearChange = (year: number) => {
    setCurrentDate((prev) => setYear(prev, year));
  };

  const handleMonthNav = (direction: "next" | "prev") => {
    setCurrentDate((prev) =>
      direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  const handleYearOffsetChange = (direction: "next" | "prev") => {
    setYearOffset((prev) => (direction === "next" ? prev + 1 : prev - 1));
  };

  const renderDays = () => {
    return daysInCalendar.map((day) => {
      const dateString = format(day, "yyyy-MM-dd");
      const isEventPresent =
        events[dateString] && events[dateString].length > 0;
      const isCurrentMonth = isSameMonth(day, currentDate);
      const isInRange = isBefore(day, minDate) || isAfter(day, maxDate);

      return (
        <div
          key={dateString}
          className={`p-2 h-20 border rounded-lg flex flex-col justify-between ${
            isCurrentMonth
              ? isInRange
                ? "bg-zinc-600 pointer-events-none"
                : ""
              : "bg-zinc-800 text-gray-400 pointer-events-none"
          } ${isToday(day) ? "border-blue-500" : ""} cursor-pointer ${
            isInRange ? "opacity-50" : ""
          }`}
          onClick={() => {
            if (!isInRange && onDateSelect) {
              onDateSelect(dateString); // Notify parent component
            }
          }}
        >
          <div className="flex justify-between">
            <span>{format(day, "d")}</span>
            {isEventPresent && (
              <Badge className="flex h-6 w-6 shrink-0 items-center justify-center text-white rounded-full bg-red-600 hover:bg-red-500">
                {events[dateString].length}
              </Badge>
            )}
          </div>
          <div className="text-xs mt-2 overflow-auto">
            {events[dateString]?.map((event, index) => (
              <div key={index} className="truncate">
                {event}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="text-white relative">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant={"default"}
          size={"icon"}
          onClick={() => handleMonthNav("prev")}
          disabled={isBefore(subMonths(currentDate, 1), minDate)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger>
              <Button variant={"default"} className="flex items-center gap-2">
                <span>{format(currentDate, "MMMM")}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <Button
                    key={index}
                    variant={
                      currentDate.getMonth() === index ? "secondary" : "ghost"
                    }
                    onClick={() => handleMonthChange(index)}
                    className="w-full p-2 text-center "
                  >
                    {month}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger
              onClick={() => {
                const currentYear = currentDate.getFullYear();
                const newOffset = Math.floor((currentYear - 2000) / 10);
                setYearOffset(newOffset);
              }}
            >
              <Button variant={"default"} className="flex items-center gap-2">
                <span>{format(currentDate, "yyyy")}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex justify-between mb-2">
                <Button
                  size={"icon"}
                  onClick={() => handleYearOffsetChange("prev")}
                  disabled={yearOffset === 0}
                  className="h-6 w-6"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-lg font-bold">
                  {format(currentDate, "yyyy")}
                </span>
                <Button
                  size={"icon"}
                  onClick={() => handleYearOffsetChange("next")}
                  disabled={yearOffset * 10 + 10 >= totalYears}
                  className="h-6 w-6"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {yearsToShow.map((year) => {
                  const isYearOutOfRange =
                    year < minDate.getFullYear() ||
                    year > maxDate.getFullYear();
                  return (
                    <Button
                      key={year}
                      variant={
                        currentDate.getFullYear() === year
                          ? "secondary"
                          : "ghost"
                      }
                      onClick={() =>
                        !isYearOutOfRange && handleYearChange(year)
                      }
                      className="w-full p-2 text-center"
                      disabled={isYearOutOfRange}
                    >
                      {year}
                    </Button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          variant={"default"}
          size={"icon"}
          onClick={() => handleMonthNav("next")}
          disabled={isAfter(addMonths(currentDate, 1), maxDate)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-4 mb-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-bold text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-4">{renderDays()}</div>
    </div>
  );
};

export default EventCalendar;
