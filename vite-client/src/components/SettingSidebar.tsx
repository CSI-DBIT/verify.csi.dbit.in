import { FC } from "react";
import { Link } from "react-router-dom";

interface SettingSidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const SettingSidebar: FC<SettingSidebarProps> = ({ currentSection, onSectionChange }) => {
  const sections = [
    { id: "organization", label: "Organization Info" },
    { id: "event-types", label: "Event Types" },
    { id: "members", label: "Manage Members" },
    // Add more sections here if needed
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <nav className="flex flex-col gap-4 p-4">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`p-3 rounded-lg text-left ${
              currentSection === section.id ? "bg-blue-500" : "bg-gray-700"
            } hover:bg-blue-600 transition`}
            onClick={() => onSectionChange(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SettingSidebar;
