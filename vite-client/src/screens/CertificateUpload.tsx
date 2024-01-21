import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CertificateUpload = () => {
  const [dateOfIssuing, setDateOfIssuing] = useState<Date>();
  const [pdfPreviews, setPdfPreviews] = useState<
    { preview: string; name: string }[]
  >([]);
  const [uniqueFileNames, setUniqueFileNames] = useState<Set<string>>(
    new Set()
  );
  const { toast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    setIsDragActive(false);
    const duplicateFiles = acceptedFiles.some((file) =>
      uniqueFileNames.has(file.name)
    );

    if (duplicateFiles) {
      toast({
        title: "The selected PDFs are already added.",
        variant: "destructive",
      });
      return;
    }

    const promises = acceptedFiles.map((file) => readFileAsDataURL(file));
    const previews = await Promise.all(promises);

    setPdfPreviews((prevPreviews) => [
      ...prevPreviews,
      ...acceptedFiles.map((file, index) => ({
        preview: previews[index],
        name: file.name,
      })),
    ]);

    setUniqueFileNames(
      (prevFileNames) =>
        new Set([...prevFileNames, ...acceptedFiles.map((file) => file.name)])
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    onDragEnter: () => {
      setIsDragActive(true);
    },
    onDragLeave: () => {
      setIsDragActive(false);
    },
  });

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setUniqueFileNames((prevFileNames) => {
      const updatedFileNames = new Set(prevFileNames);
      updatedFileNames.delete(pdfPreviews[index].name);
      return updatedFileNames;
    });
    setPdfPreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const clearForm = () => {
    setDateOfIssuing(undefined);
    setUniqueFileNames(new Set());
    setPdfPreviews([]);
  };

  const removeAllFiles = () => {
    setUniqueFileNames(new Set());
    setPdfPreviews([]);
  };

  const handleUpload = async () => {
    if (pdfPreviews.length === 0) {
      toast({
        title: "No files to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!dateOfIssuing) {
      toast({
        title: "Please select the date of issuing.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("dateOfIssuing", dateOfIssuing.toISOString());
    pdfPreviews.forEach((file) => {
      formData.append(
        `certificate_files`,
        dataURItoBlob(file.preview),
        file.name
      );
      formData.append(`certificate_name`, file.name);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload-certificates",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        toast({
          title: response.data.message,
          variant: "default",
        });
        removeAllFiles();
        clearForm();
      } else if (response.status === 500) {
        toast({
          title: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Client : Error uploading certificates:", error);
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.status == 400
      ) {
        toast({
          title: error.response.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Internal server error 🛠️",
          variant: "destructive",
        });
      }
    }
  };

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-4 flex flex-grow flex-col space-y-4">
        <div className="lg:space-x-2">
          <Label className="lg:text-2xl text-xl font-bold">
            Date of Issuing:
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dateOfIssuing && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfIssuing ? (
                  format(dateOfIssuing, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
              <Select
                onValueChange={(value) =>
                  setDateOfIssuing(addDays(new Date(), parseInt(value)))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="0">Today</SelectItem>
                  <SelectItem value="1">Tomorrow</SelectItem>
                  <SelectItem value="3">In 3 days</SelectItem>
                  <SelectItem value="7">In a week</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar
                  mode="single"
                  selected={dateOfIssuing}
                  onSelect={setDateOfIssuing}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <Label className="lg:text-2xl text-xl font-bold">
              Choose Certificates (PDF's only):
            </Label>
          </div>
          <div>
            <Button onClick={handleUpload}>Upload Certificates</Button>
          </div>
        </div>
        <div>
          PDF naming format : "studentId_certificateName_month_year"
          <span className="font-bold text-red-600">*</span>
        </div>
        <div
          {...getRootProps()}
          className={`border-dashed hover:border-green-600 border-2 p-10 py-20 rounded-3xl mt-4 text-center cursor-pointer ${
            isDragActive ? "border-green-600" : ""
          }`}
        >
          <input {...getInputProps()} />
          <p className="font-bold text-xl">
            Drag and drop PDF files here or click to select
          </p>
        </div>
        <div>
          {pdfPreviews.length > 0 && (
            <div>
              <div className="flex justify-between items-center">
                <div className="font-bold text-xl ">
                  Selected {pdfPreviews.length} files
                </div>
                <Button variant="destructive" onClick={removeAllFiles}>
                  Remove All
                </Button>
              </div>
              <div className="lg:grid grid-cols-4 gap-4">
                {pdfPreviews.map((preview, index) => (
                  <Card className="p-2" key={index}>
                    <div className="flex-col space-y-2">
                      <iframe
                        title={`PDF Preview ${index + 1}`}
                        src={preview.preview}
                        width="100%"
                        height="300px"
                        className="rounded"
                      ></iframe>
                      <p className="text-center">{preview.name}</p>
                      <Button
                        className="w-full"
                        variant="destructive"
                        type="button"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
        <Toaster />
      </div>
      <Footer />
    </div>
  );
};

export default CertificateUpload;
