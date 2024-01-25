import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

const ManageMember = () => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    setIsDragActive(false);
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/excel": [".xls", ".xlsx"],
    },
    onDragEnter: () => {
      setIsDragActive(true);
    },
    onDragLeave: () => {
      setIsDragActive(false);
    },
  });


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-4 flex flex-grow flex-col space-y-4">
        <div className="flex space-x-4">
          <Drawer>
            <DrawerTrigger>
              <Button>Bulk Upload Members</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Bulk Upload Member Details</DrawerTitle>
                <DrawerDescription>
                  upload a excel sheet containing member details
                </DrawerDescription>
              </DrawerHeader>
              <div
                className={`border-dashed hover:border-green-600 border-2 p-10 py-20 rounded-3xl mt-4 text-center cursor-pointer ${isDragActive ? "border-green-600" : ""
                  }`}
                {...getRootProps()}
              >
                <Input {...getInputProps()} />
                <p className="font-bold text-xl">
                  Drag and drop a file here, or click to select a file
                </p>
              </div>
              <DrawerFooter>
                <Button>Submit file</Button>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Dialog>
            <DialogTrigger>
              <Button>Add Member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add new member</DialogTitle>
                <DialogDescription>
                  Add single member by providing the required fields
                </DialogDescription>
              </DialogHeader>
              <MemberFormComponent />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

const MemberFormComponent = () => {
  const MemberFormschema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    studentId: z.string().length(10),
    branch: z.string(),
    duration: z.string(),
    startDate: z.date(),
  });

  type MemberFormFields = z.infer<typeof MemberFormschema>;
  const member_form = useForm<MemberFormFields>({
    resolver: zodResolver(MemberFormschema),
    defaultValues: {
      duration: "1",
      startDate: new Date(),
    },
  });

  const onMemberFormSubmit: SubmitHandler<MemberFormFields> = async (data:MemberFormFields) => {
      await axios.post("http://localhost:5000/api/add/member-details",data);
      member_form.reset({name: "",email:"",studentId:"",branch:"",duration:"",startDate:new Date(),});
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
  };

  return (
    <Form {...member_form}>
      <form
        onSubmit={member_form.handleSubmit(onMemberFormSubmit)}
        className="space-y-3"
      >
        <FormField
          control={member_form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormDescription>This is your name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={member_form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormDescription>This is your email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={member_form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter your student ID" {...field} />
              </FormControl>
              <FormDescription>This is your student ID.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={member_form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member Branch</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Member Branch..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Information Technology</SelectItem>
                  <SelectItem value="2">Computer Science</SelectItem>
                  <SelectItem value="3">
                    Electronics and Telecommunication
                  </SelectItem>
                  <SelectItem value="4">Mechanical</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This is your branch.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={member_form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership Duration</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Membership Duration..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">One year</SelectItem>
                  <SelectItem value="2">Two Year</SelectItem>
                  <SelectItem value="3">Three year</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This is your membership duration.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={member_form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the start date of membership.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={member_form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ManageMember;
