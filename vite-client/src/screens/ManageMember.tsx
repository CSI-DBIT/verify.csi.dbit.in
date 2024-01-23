import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ManageMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: 0,
    branch: 0,
    duration: 0,
    startDate: "",
  });
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

  const handleInputChange = (e: {
    target: { name: string; value: unknown };
  }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/add-member", formData);
      alert("Member added successfully");
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

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
                className={`border-dashed hover:border-green-600 border-2 p-10 py-20 rounded-3xl mt-4 text-center cursor-pointer ${
                  isDragActive ? "border-green-600" : ""
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-left">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-left">
                    email
                  </Label>
                  <Input
                    id="username"
                    defaultValue="@peduarte"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-left">
                    StudentId
                  </Label>
                  <Input
                    id="username"
                    defaultValue="@peduarte"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-left">
                    Branch
                  </Label>
                  <Input
                    id="username"
                    defaultValue="@peduarte"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-left">
                    Membership Duration
                  </Label>
                  <Input
                    id="username"
                    defaultValue="@peduarte"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-left">
                    Start Date
                  </Label>
                  <Input
                    id="username"
                    defaultValue="@peduarte"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* <div>
          <h2>Add Member</h2>
          <div>
            <Label>Name:</Label>
            <Input type="text" name="name" onChange={handleInputChange} />

            <Label>Email:</Label>
            <Input type="text" name="email" onChange={handleInputChange} />

            <Label>Student ID:</Label>
            <Input
              type="number"
              name="studentId"
              onChange={handleInputChange}
            />

            <Label>Branch:</Label>
            <Input type="number" name="branch" onChange={handleInputChange} />

            <Label>Duration:</Label>
            <Input type="number" name="duration" onChange={handleInputChange} />

            <Label>Start Date:</Label>
            <Input type="text" name="startDate" onChange={handleInputChange} />

            <button onClick={handleSubmit}>Add Member</button>
          </div>
        </div> */}
      </div>
      <MemberFormComponent />
      <Footer />
    </div>
  );
};

//----------------------------------------------------------------
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
} from "@radix-ui/react-popover";
import { addDays, format } from "date-fns";
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
const MemberFormschema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  studentId: z.string().max(10),
  branch: z.string(),
  duration: z.string(),
  startDate: z.date().refine((data) => data > addDays(new Date(), -1)),
});

type MemberFormFields = z.infer<typeof MemberFormschema>;

const MemberFormComponent = () => {
  const member_form = useForm<MemberFormFields>({
    resolver: zodResolver(MemberFormschema),
    defaultValues: {
      startDate: new Date(),
    },
  });
  //   const { register, control, handleSubmit,setError, formState } = useForm<MemberFormFields>({
  //     resolver: zodResolver(MemberFormschema),
  //   });

  const onSubmit: SubmitHandler<MemberFormFields> = async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // throw new Error();
      // console.log(data);
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (error) {
      member_form.setError("root", {
        message: "Form not submitted",
      });
      console.log(error);
    }
  };
  const [date, setDate] = useState<Date>()

  return (
    <div>
      <Form {...member_form}>
        <form
          onSubmit={member_form.handleSubmit(onSubmit)}
          className="space-y-4"
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
                  You can manage email addresses in your
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
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the duration" {...field} />
                </FormControl>
                <FormDescription>
                  This is the duration of the program.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormField
            control={member_form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger>
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
                    className="w-auto p-0 bg-zinc-950"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your date of birth is used to calculate your age.
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
      {/*<form
       onSubmit={handleSubmit(onSubmit)}
       noValidate
     >
       <div className="grid gap-2">
         <label htmlFor="name">Name</label>
         <input {...register("name")} type="text" id="name" />
       </div>
       <div className="grid gap-2">
         <label htmlFor="email">Email</label>
         <input {...register("email")} type="email" id="email" />
       </div>
       <div className="grid gap-2">
         <label htmlFor="studentId">Student ID</label>
         <input {...register("studentId")} type="number" id="studentId" />
       </div>
       <div className="grid gap-2">
         <label htmlFor="branch">Branch</label>
         <input {...register("branch")} type="text" id="branch" />
       </div>
       <div className="grid gap-2">
         <label htmlFor="duration">Duration</label>
         <input {...register("duration")} type="text" id="duration" />
       </div>
       <div className="grid gap-2">
         <label htmlFor="startDate">Start Date</label>
         <input {...register("startDate")} type="date" id="startDate" />
       </div>
       <button type="submit" disabled={formState.isSubmitting}>
         Save changes
       </button>
     </form> */}
      <Toaster />
    </div>
  );
};

export default ManageMember;
