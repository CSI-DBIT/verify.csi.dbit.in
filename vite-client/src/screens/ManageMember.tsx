import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";
import BulkUploadMemberForm from "./manage-member-components/BulkUploadMemberForm";
import ManageMemberTableView from "./manage-member-components/ManageMemberTableView";
import AddMemberView from "./manage-member-components/AddMemberView";
import ManageDelete from "./manage-member-components/ManageDelete";

const ManageMember = () => {
  const [memberTabledata, setmemberTableData] = useState<MemberDetailsSchema[]>(
    []
  );
  const [delMemberTabledata, setDelmemberTableData] = useState<
    MemberDetailsSchema[]
  >([]);
  const [isBulkUploadCompleted, setIsBulkUploadCompleted] = useState(false);
  const [isMemberAdded, setIsMemberAdded] = useState(false);
  const [isOperationInProgress, setIsOperationInProgress] =
    useState<boolean>(false);
  //fetch member data
  const fetchMembers = async (): Promise<MemberDetailsSchema[]> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/get/all-members`
      );
      return response.data as MemberDetailsSchema[];
    } catch (error) {
      console.error("Error fetching data:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorMessage =
          axiosError.response?.data?.error || "Unknown error";
        toast({
          title: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      } else {
        // Handle other types of errors
        console.error("Unexpected error:", error);
        toast({
          title: "Unexpected error:",
          variant: "destructive",
        });
        throw new Error("Unexpected error");
      }
    }
  };
  const fetchDeleted = async (): Promise<MemberDetailsSchema[]> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/get/deleted-members`
      );
      return response.data as MemberDetailsSchema[];
    } catch (error) {
      console.error("Error fetching data:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorMessage =
          axiosError.response?.data?.error || "Unknown error";
        toast({
          title: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      } else {
        // Handle other types of errors
        console.error("Unexpected error:", error);
        toast({
          title: "Unexpected error:",
          variant: "destructive",
        });
        throw new Error("Unexpected error");
      }
    }
  };
  // Use the useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchMembers().then((data) => {
      setmemberTableData(data);
      console.log(data);
    });
    fetchDeleted().then((data) => {
      setDelmemberTableData(data);
      console.log(data);
    });
    if (isMemberAdded || isBulkUploadCompleted || isOperationInProgress) {
      fetchMembers().then((data) => setmemberTableData(data));
      fetchDeleted().then((data) => setDelmemberTableData(data));
      setIsMemberAdded(false);
      setIsBulkUploadCompleted(false);
      setIsOperationInProgress(false);
    }
    console.log("use effect run");
  }, [isBulkUploadCompleted, isMemberAdded, isOperationInProgress]);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-4 flex flex-grow flex-col gap-2">
        <div className="flex flex-wrap lg:gap-2">
          <BulkUploadMemberForm
            setIsBulkUploadCompleted={setIsBulkUploadCompleted}
          />
          <AddMemberView setIsMemberAdded={setIsMemberAdded} />
          <ManageDelete
            delMemberTabledata={delMemberTabledata}
            setIsOperationInProgress={setIsOperationInProgress}
          />
        </div>
        <div>
          <ManageMemberTableView
            memberTabledata={memberTabledata}
            setIsOperationInProgress={setIsOperationInProgress}
          />
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};
export default ManageMember;
