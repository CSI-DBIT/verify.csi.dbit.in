import axios from "axios";
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
  const [memberTabledata, setMemberTableData] = useState<MemberDetailsSchema[]>(
    []
  );
  const [delMemberTabledata, setDelMemberTableData] = useState<
    MemberDetailsSchema[]
  >([]);
  const [isBulkUploadCompleted, setIsBulkUploadCompleted] = useState(false);
  const [isMemberAdded, setIsMemberAdded] = useState(false);
  const [isOperationInProgress, setIsOperationInProgress] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const members = await fetchMembers();
        const deletedMembers = await fetchDeleted();
        setMemberTableData(members);
        setDelMemberTableData(deletedMembers);
      } catch (error) {
        toast({
          title: "Unexpected error",
          description: "Error fetching data",
          variant: "destructive",
        });
      }
    };

    fetchData();
    if (isMemberAdded || isBulkUploadCompleted || isOperationInProgress) {
      fetchMembers();
      setIsMemberAdded(false);
      setIsBulkUploadCompleted(false);
      setIsOperationInProgress(false);
    }
  }, [isBulkUploadCompleted, isMemberAdded, isOperationInProgress]);

  const fetchMembers = async (): Promise<MemberDetailsSchema[]> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/member/get/all_members`
      );
      if (response.data.success) {
        return response.data.allMembers as MemberDetailsSchema[];
      } else {
        toast({
          title: "Fetching error",
          description: response.data.message,
          variant: "destructive",
        });
        return [];
      }
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Error fetching members",
        variant: "destructive",
      });
      return [];
    }
  };

  const fetchDeleted = async (): Promise<MemberDetailsSchema[]> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/member/get/deleted_members`
      );
      if (response.data.success) {
        return response.data.deletedMembers as MemberDetailsSchema[];
      } else {
        toast({
          title: "Fetching error",
          description: response.data.message,
          variant: "destructive",
        });
        return [];
      }
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Error fetching deleted members",
        variant: "destructive",
      });
      return [];
    }
  };

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
