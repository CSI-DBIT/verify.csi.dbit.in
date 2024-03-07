import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock4 } from "lucide-react";
import Certificate from "../components/Cerificate"; // Import Certificate component
import { ScrollArea } from "@/components/ui/scroll-area";
import Footer from "@/components/Footer";
import csiCardQrImage from "../assets/csi qr code.png";
import { branchText } from "./constants";
import { useParams } from "react-router-dom";
import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";

const MemberScreen = () => {
  const { studentId } = useParams();
  const [memberDetails, setMemberDetails] = useState<MemberDetailsSchema>();
  const [certificateDetails, setCertificateDetails] = useState([]);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/get/memberDetails`,
          {
            params: { studentId: studentId },
          }
        );

        const { memberDetails, certificatesDetails } = response.data;

        // Calculate endDate based on startDate and duration
        const startDate = new Date(memberDetails.startDate);
        const endDate = new Date(startDate);
        endDate.setFullYear(startDate.getFullYear() + memberDetails.duration);

        // Determine status based on current date
        const currentDate = new Date();
        const status = currentDate <= endDate ? "Active" : "Not Active";

        setMemberDetails({
          ...memberDetails,
          endDate: endDate.toISOString(), // Update endDate
          status: status, // Update status
        });

        setCertificateDetails(certificatesDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMemberData();
  }, [studentId]);

  if (!memberDetails) {
    // Display a loading indicator while data is being fetched
    return <div>Loading...</div>;
  }

  // Function to format the date as date/month/year
  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow justify-center items-center space-y-4 p-4">
        <div className="w-full h-full lg:flex justify-center items-center space-x-4">
          <Card className="lg:w-3/4 lg:h-[300px] p-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <div>
                  <Label className="">Membership Id</Label>
                  <div className="">{memberDetails.studentId}</div>
                </div>
                <Badge
                  className={`px-4 py-1 ${
                    memberDetails.status === "Active"
                      ? "bg-green-900"
                      : "bg-red-900"
                  }`}
                  variant="outline"
                >
                  {memberDetails.status}
                </Badge>
              </div>
              <h1 className="text-xl font-bold">{memberDetails.name}</h1>
              <p className="">{memberDetails.email}</p>
              <div className="flex items-center space-x-2">
                <Badge className="text-xs " variant="outline">
                  {branchText[Number(memberDetails.branch)]}
                </Badge>
                <Badge className="text-xs" variant="outline">
                  SEM {memberDetails.currentSemester}
                </Badge>
                <Badge className="text-xs" variant="outline">
                  {memberDetails.duration} yrs
                </Badge>
              </div>
              <div className="flex space-x-4 items-center">
                <div>
                  <Label className="">Start Date</Label>
                  <div className="flex items-center space-x-2">
                    <Clock4 className="h-4 w-4" />
                    <span className="">
                      {formatDate(memberDetails.startDate)}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="">End Date</Label>
                  <div className="flex items-center space-x-2">
                    <Clock4 className="h-4 w-4" />
                    <span className="">
                      {formatDate(memberDetails.endDate as Date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card className="lg:w-1/4 lg:h-[300px] flex justify-center items-center">
            <img
              className="h-3/4 w-3/4 object-contain p-4"
              src={csiCardQrImage}
              alt="grid background"
            />
          </Card>
        </div>

        <div className="font-bold">Certificates</div>
        <ScrollArea className="h-[300px]">
          {certificateDetails.map((certificate, index) => (
            <Certificate key={index} data={certificate} />
          ))}
        </ScrollArea>
      </div>
      <Footer />
    </div>
  );
};

export default MemberScreen;
