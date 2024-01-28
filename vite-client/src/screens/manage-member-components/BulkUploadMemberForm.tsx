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
import axios, { AxiosError } from "axios";
import { FileSpreadsheet, X } from "lucide-react";
import { FC, useState } from "react";
import { useDropzone } from "react-dropzone";

interface BulkUploadMemberFormProps {
  setIsBulkUploadCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}
const BulkUploadMemberForm: FC<BulkUploadMemberFormProps> = ({
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
        setIsBulkUploadCompleted(true);
      } catch (error) {
        console.error("Error uploading file:", error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          const errorMessage =
            axiosError.response?.data?.error || "Unknown error";
          toast({
            title: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Unexpected error:",
            variant: "destructive",
          });
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

export default BulkUploadMemberForm;
