import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { PlusCircle } from "lucide-react";
import AddEventForm from "./manage-events-components/AddEventForm";

const ManageEvent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-4 flex flex-grow flex-col gap-2">
        <h2 className="scroll-m-20 pb-2 text-3xl font-bold tracking-tight first:mt-0">
          Manage Events
        </h2>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[100px] w-[300px] flex gap-2 border-dashed border-4"
              >
                <PlusCircle />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent >
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
              </DialogHeader>
              <AddEventForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default ManageEvent;
