import { List, Grid } from "lucide-react";

export const List_Card_Toggle = ({
  viewType,
  onToggle,
}: {
  viewType: "card" | "list";
  onToggle: (type: "card" | "list") => void;
}) => {
  return (
    <div className="relative flex items-center bg-secondary rounded-lg shadow-sm">
      {/* Sliding Indicator */}
      <div
        className={`absolute top-0 left-0 h-full w-1/2 bg-white rounded-lg shadow transition-all duration-300 ${
          viewType === "card" ? "translate-x-0" : "translate-x-full"
        }`}
      ></div>

      {/* Card Button */}
      <button
        onClick={() => onToggle("card")}
        className={`relative flex items-center justify-center p-3 z-10 ${
          viewType === "card" ? "text-gray-800" : "text-gray-500"
        }`}
      >
        <Grid size={18} />
      </button>
      {/* List Button */}
      <button
        onClick={() => onToggle("list")}
        className={`relative flex items-center justify-center p-3 z-10 ${
          viewType === "list" ? "text-gray-800" : "text-gray-500"
        }`}
      >
        <List size={18} />
      </button>
    </div>
  );
};
