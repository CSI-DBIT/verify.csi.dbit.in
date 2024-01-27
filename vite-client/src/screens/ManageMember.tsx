import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
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
import { CalendarIcon, FileSpreadsheet, X } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { MemberDetails, columns } from "@/manageMember/Column";
import { DataTable } from "@/manageMember/DataTable";
const ManageMember = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-4 flex flex-grow flex-col space-y-4">
        <div className="flex space-x-4">
          <BulkUploadMemberForm />
          <AddMemberForm />
          <ManageMemberTable />
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

const ManageMemberTable = () => {
  async function getData(): Promise<MemberDetails[]> {
    // Fetch data from your API here.
    return [
      {
        name: "Dulce doe",
        email: "jhon@email.com",
        studentId: "1357749320",
        branch: "2",
        duration: "2",
        startDate: new Date("2024-01-27T12:49:40.000+00:00"),
      },
    ];
  }
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

const BulkUploadMemberForm = () => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    setIsDragActive(false);
    setIsUploading(false);
    setUploadProgress(0);

    const file = acceptedFiles[0];
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const onSubmit = async () => {
    if (selectedFile) {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("bulk_upload_memberDetails_excel", selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/bulk-upload/member-details",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              setUploadProgress(percentCompleted);
            },
          }
        );
        toast({
          title: response.data.message,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          const errorMessage =
            axiosError.response?.data?.error || "Unknown error";
          // You can use toast or any other notification library here
          // Assuming `toast` is a function that shows a notification
          toast({
            title: errorMessage,
            variant: "destructive",
          });
        } else {
          // Handle other types of errors
          console.error("Unexpected error:", error);
        }
      } finally {
        setIsUploading(false);
        setSelectedFile(null);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
    },
    onDragEnter: () => {
      setIsDragActive(true);
    },
    onDragLeave: () => {
      setIsDragActive(false);
    },
  });

  return (
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
        <div className="flex flex-col gap-4 p-4">
          <div
            className={`border-dashed hover:border-green-600 border-2 p-10 py-20 rounded-3xl mt-4 text-center cursor-pointer ${
              isDragActive ? "border-green-600" : ""
            } `}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <p className="font-bold text-xl">
              Drag and drop a file here, or click to select a file
            </p>
          </div>

          {selectedFile && (
            <div>
              <div className="flex gap-2 items-center">
                <Card className="flex flex-col gap-2 px-4 py-2">
                  <div className="flex gap-2 items-center">
                    <FileSpreadsheet />
                    <div>{selectedFile.name}</div>
                  </div>

                  {isUploading && <Progress value={uploadProgress} />}
                </Card>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={removeFile}
                  disabled={isUploading}
                >
                  <X />
                </Button>
              </div>
            </div>
          )}
        </div>
        <DrawerFooter>
          <div className="flex gap-4 items-center justify-center">
            <div>
              {selectedFile && (
                <Button onClick={onSubmit} disabled={isUploading}>
                  {isUploading ? <div>Submitting...</div> : <div>Submit</div>}
                </Button>
              )}
            </div>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const AddMemberForm = () => {
  const AddMemberFormschema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    studentId: z.string().length(10),
    branch: z.string(),
    duration: z.string(),
    startDate: z.date(),
  });

  type AddMemberFormFields = z.infer<typeof AddMemberFormschema>;
  const add_member_form = useForm<AddMemberFormFields>({
    resolver: zodResolver(AddMemberFormschema),
    defaultValues: {
      branch: "1",
      duration: "1",
      startDate: new Date(),
    },
  });

  const onMemberFormSubmit: SubmitHandler<AddMemberFormFields> = async (
    data: AddMemberFormFields
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/add/member-details",
        data
      );
      add_member_form.reset({
        name: "",
        email: "",
        studentId: "",
        branch: "1",
        duration: "1",
        startDate: new Date(),
      });

      toast({
        title: "You submitted the following values:",
        description: (
          <div>{JSON.stringify(response.data.message, null, 2)}</div>
        ),
      });
    } catch (error) {
      // Handle errors (e.g., show an error toast)
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description:
          "There was an error submitting the form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
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
        <Form {...add_member_form}>
          <form
            onSubmit={add_member_form.handleSubmit(onMemberFormSubmit)}
            className="space-y-3"
          >
            <FormField
              control={add_member_form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={add_member_form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={add_member_form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your student ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={add_member_form.control}
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={add_member_form.control}
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={add_member_form.control}
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
                    <PopoverContent className="w-auto p-0" align="start">
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={add_member_form.formState.isSubmitting}
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMember;
