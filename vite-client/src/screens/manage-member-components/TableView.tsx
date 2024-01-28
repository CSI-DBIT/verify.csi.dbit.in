// import { toast } from "@/components/ui/use-toast";
import { columns } from "@/screens/manage-member-components/ColumnDef";
import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";
// import axios, { AxiosError } from "axios";
import { FC } from "react";
import DataTable from "@/screens/manage-member-components/DataTable";

interface ManageMemberTableViewProps {
  memberTabledata: MemberDetailsSchema[];
  // setmemberTableData: React.Dispatch<
  //   React.SetStateAction<MemberDetailsSchema[]>
  // >;
  // isBulkUploadCompleted: boolean;
  // setIsBulkUploadCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  // isMemberAdded: boolean;
  // setIsMemberAdded: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManageMemberTableView: FC<ManageMemberTableViewProps> = ({
  memberTabledata,
  // setmemberTableData,
  // isBulkUploadCompleted,
  // setIsBulkUploadCompleted,
  // isMemberAdded,
  // setIsMemberAdded,
}) => {
  // const fetchData = async (): Promise<MemberDetailsSchema[]> => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:5000/api/get/member-details"
  //     );
  //     return response.data as MemberDetailsSchema[];
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     if (axios.isAxiosError(error)) {
  //       const axiosError = error as AxiosError;
  //       const errorMessage =
  //         axiosError.response?.data?.error || "Unknown error";
  //       toast({
  //         title: errorMessage,
  //         variant: "destructive",
  //       });
  //       throw new Error(errorMessage);
  //     } else {
  //       // Handle other types of errors
  //       console.error("Unexpected error:", error);
  //       toast({
  //         title: "Unexpected error:",
  //         variant: "destructive",
  //       });
  //       throw new Error("Unexpected error");
  //     }
  //   }
  // };
  // // Use the useEffect hook to fetch data when the component mounts
  // useEffect(() => {
  //   fetchData().then((data) => setmemberTableData(data));
  //   if (isMemberAdded) {
  //     fetchData().then((data) => setmemberTableData(data));
  //     // Reset the flag
  //     setIsMemberAdded(false);
  //   }
  //   if (isBulkUploadCompleted) {
  //     fetchData().then((data) => setmemberTableData(data));
  //     // Reset the flag
  //     setIsBulkUploadCompleted(false);
  //   }
  //   console.log("use effect run");
  // }, [
  //   isBulkUploadCompleted,
  //   isMemberAdded,
  //   setIsBulkUploadCompleted,
  //   setIsMemberAdded,
  //   setmemberTableData,
  // ]);

  return <DataTable columns={columns} data={memberTabledata} />;
};

export default ManageMemberTableView;
