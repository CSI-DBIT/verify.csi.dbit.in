import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { EventSchema } from "@/validationSchemas/EventSchema";
import axios, { AxiosError } from "axios";
import { FileSpreadsheet, X } from "lucide-react";
import { FC, useState } from "react";
import { useDropzone } from "react-dropzone";

interface BulkUploadEligibleCandidatesProps {
  eventDetails?: EventSchema;
  setIsBulkUploadCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}
const BulkUploadMemberForm: FC<BulkUploadEligibleCandidatesProps> = ({
  eventDetails,
  setIsBulkUploadCompleted,
}) => {
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
    if (selectedFile && eventDetails?.eventCode) {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("bulk_upload_eligible_candidates_excel", selectedFile);
      formData.append("eventCode", eventDetails.eventCode); // Assuming eventCode is in the eventDetails
      formData.append("lastEdited", new Date().toISOString()); // Add the current date as lastEdited

      try {
        const response = await axios.post(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/eligible-candidate/bulk-upload`,
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
        if (response.data.success) {
          toast({
            title: response.data.message,
          });
        } else {
          toast({
            title: response.data.message,
            variant: "destructive",
          });
        }

        setIsBulkUploadCompleted(true);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Unexpected error:",
          variant: "destructive",
        });
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
        <Button>Bulk Upload Candidates</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bulk Upload Candidates</DrawerTitle>
          <DrawerDescription>
            <span className="capitalize">{eventDetails?.name}</span> eligible
            candidates
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
          {selectedFile ? (
            <div className="w-full flex gap-4 items-center justify-center">
              <Button
                className="w-1/2"
                onClick={onSubmit}
                disabled={isUploading}
              >
                {isUploading ? <div>Submitting...</div> : <div>Submit</div>}
              </Button>
              <DrawerClose className="w-1/2">
                <Button className="w-full" variant="destructive">
                  Cancel
                </Button>
              </DrawerClose>
            </div>
          ) : (
            <DrawerClose className="w-full">
              <Button className="w-full" variant="destructive">
                Cancel
              </Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BulkUploadMemberForm;
