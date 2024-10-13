import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const SettingsScreen = () => {
  const { toast } = useToast();

  // States
  const [orgName, setOrgName] = useState("");
  const [description, setDescription] = useState("");
  const [orgImage, setOrgImage] = useState<string | undefined>(
    
  );
  const [eventTypes, setEventTypes] = useState<string[]>(
    
  );
  const [categories, setCategories] = useState<string[]>(

  );

  // Refs for sections
  const orgInfoRef = useRef<HTMLDivElement>(null);
  const eventTypesRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (files: FileList | null) => {
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => setOrgImage(reader.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSave = () => {
    const updatedData = {
      name: orgName,
      description,
      image: orgImage,
      eventTypes,
      categories,
    };

    onSave(updatedData);

    toast({
      title: "Settings Saved",
      description: "Your organization settings have been successfully updated.",
      duration: 3000,
    });
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex">
      {/* Main content */}
      <div className="w-3/4 p-6 overflow-auto">
        <h2 className="text-2xl font-semibold mb-6">Settings</h2>

        {/* Organization Info Section */}
        <div ref={orgInfoRef} className="mb-12 min-h-screen">
          <h3 className="text-xl font-semibold mb-4">Organization Info</h3>

          <div className="mb-4">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your organization"
            />
          </div>

          <div className="mb-4">
            <Label>Organization Logo</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                {orgImage ? (
                  <AvatarImage src={orgImage} alt="Organization Logo" />
                ) : (
                  <AvatarFallback>Logo</AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>
        </div>

        {/* Event Types Section */}
        <div ref={eventTypesRef} className="mb-12 min-h-screen">
          <h3 className="text-xl font-semibold mb-4">Event Types</h3>
          <Select
            onValueChange={(value) => {
              if (eventTypes && !eventTypes.includes(value)) {
                setEventTypes([...eventTypes, value]);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Conference">Conference</SelectItem>
              <SelectItem value="Webinar">Webinar</SelectItem>
              <SelectItem value="Workshop">Workshop</SelectItem>
              <SelectItem value="Seminar">Seminar</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-2 space-x-2">
            {eventTypes && eventTypes.map((type, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 bg-blue-500 text-white rounded-full"
              >
                {type}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() =>
                    setEventTypes(eventTypes.filter((t) => t !== type))
                  }
                >
                  ×
                </Button>
              </span>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div ref={categoriesRef} className="mb-12 min-h-screen">
          <h3 className="text-xl font-semibold mb-4">Categories</h3>
          <Select
            onValueChange={(value) => {
              if (categories  && !categories.includes(value)) {
                setCategories([...categories, value]);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-2 space-x-2">
            {categories && categories.map((category, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 bg-green-500 text-white rounded-full"
              >
                {category}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() =>
                    setCategories(categories.filter((c) => c !== category))
                  }
                >
                  ×
                </Button>
              </span>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Sidenav */}
      <div className="sticky top-14 w-1/4 p-4 border-l">
        <ul className="space-y-4">
          <li>
            <Button variant="ghost" onClick={() => scrollToSection(orgInfoRef)}>
              Organization Info
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              onClick={() => scrollToSection(eventTypesRef)}
            >
              Event Types
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              onClick={() => scrollToSection(categoriesRef)}
            >
              Categories
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsScreen;
