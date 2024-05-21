import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock4 } from "lucide-react";
import Footer from "@/components/Footer";
import csiCardQrImage from "../assets/csi qr code.png"; // Import the image for QR code
import { branchText } from "./constants";
import { useParams } from "react-router-dom";
import { MemberDetailsSchema } from "@/validationSchemas/MemberDetailSchema";
import ReactCardFlip from "react-card-flip";
import QRCode from "qrcode"; // Import QRCode from qrcode package
import CertificateTableView from "./member-screen-components/CertificateTableView";

const MemberScreen = () => {
  const { studentId } = useParams();
  const [memberDetails, setMemberDetails] = useState<MemberDetailsSchema>();
  const [certificateDetails, setCertificateDetails] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [qrCodeSrc, setQrCodeSrc] = useState("");

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/member/get/memberDetails`,
          {
            params: { studentId: studentId },
          }
        );
        const { memberDetails, certificatesDetails } = response.data.memberData;
        // Calculate endDate based on startDate and duration
        const startDate = new Date(memberDetails.startDate);
        const endDate = new Date(startDate);
        endDate.setFullYear(startDate.getFullYear() + memberDetails.duration);

        // Determine status based on current date
        const currentDate = new Date();
        const status = currentDate <= endDate ? "Active" : "Inactive";

        setMemberDetails({
          ...memberDetails,
          endDate: endDate.toISOString(), // Update endDate
          status: status, // Update status
        });
        setCertificateDetails(certificatesDetails);

        // Generate QR code
        generateQRCode();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMemberData();
  }, [studentId]);

  // Function to generate QR code
  const generateQRCode = () => {
    const url = window.location.href;
    console.log(url);
    QRCode.toDataURL(url)
      .then((dataUrl) => {
        setQrCodeSrc(dataUrl);
      })
      .catch((error) => {
        console.error("Error generating QR code:", error);
      });
  };

  // Function to format the date as date/month/year
  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  console.log(memberDetails);
  if (!memberDetails) {
    // Display a loading indicator while data is being fetched
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow justify-center items-center space-y-4 p-4">
        <div className="lg:flex justify-around items-center gap-2">
          <ReactCardFlip isFlipped={flipped} flipDirection="vertical">
            <Card
              onClick={() => {
                setFlipped(!flipped);
              }}
              className="lg:w-[450px] lg:h-[250px]"
            >
              <div className="flex w-full h-full flex-col p-4 px-6 space-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="">Membership Id</Label>
                    <div className="">{memberDetails.studentId}</div>
                  </div>
                  <Badge
                    className={
                      memberDetails.status === "active"
                        ? "bg-green-700"
                        : "bg-red-700"
                    }
                    variant="outline"
                  >
                    {memberDetails.status}
                  </Badge>
                </div>
                <div>
                  <h1 className="text-4xl font-bold">{memberDetails.name}</h1>
                  <div>{memberDetails.email}</div>
                  <div className="flex items-center space-x-2 py-3">
                    <Badge className="text-xs" variant="outline">
                      {branchText[Number(memberDetails.branch)]}
                    </Badge>
                    <Badge className="text-xs" variant="outline">
                      SEM {memberDetails.currentSemester}
                    </Badge>
                    <Badge className="text-xs" variant="outline">
                      {memberDetails.duration} yrs
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="">Start Date</Label>
                    <div className="flex items-center space-x-1">
                      <Clock4 className="h-4 w-4" />
                      <span className="">
                        {formatDate(memberDetails.startDate)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="">End Date</Label>
                    <div className="flex items-center space-x-1">
                      <Clock4 className="h-4 w-4" />
                      <span className="">
                        {formatDate(memberDetails.endDate as Date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Card
              onClick={() => {
                setFlipped(!flipped);
              }}
              className="lg:w-[450px] lg:h-[250px]"
            >
              <div className="flex flex-col p-4 px-6 space-y-1 lg:space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="">Membership Id</Label>
                    <div className="">{memberDetails.studentId}</div>
                  </div>
                  <Badge
                    className={
                      memberDetails.status === "active"
                        ? "bg-green-700"
                        : "bg-red-700"
                    }
                    variant="outline"
                  >
                    {memberDetails.status}
                  </Badge>
                </div>
                <div className="lg:flex items-center justify-between ">
                  <div>
                    <h1 className=" font-bold">CSI DBIT</h1>
                    <p className="text-xs">
                      CSI has effectively created a platform for everyone to
                      progress together, and has relentlessly worked to provide
                      the best.
                    </p>
                  </div>
                  <div className="lg:flex justify-end items-center">
                    <img
                      className="h-6/12 w-6/12"
                      src={csiCardQrImage}
                      alt="grid background"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </ReactCardFlip>
          <div className="flex w-full space-x-2 items-center">
            <div className="w-3/4 lg:h-[250px] grid grid-cols-2 gap-2">
              <Card></Card>
              <Card></Card>
              <Card className="col-span-2"></Card>
            </div>
            <Card className="w-1/4 lg:h-[250px] flex justify-center items-center">
              <img
                src={qrCodeSrc}
                alt="QR Code"
                className="w-full h-full p-2 object-contain rounded"
                style={{ borderRadius: "1rem" }}
              />
            </Card>
          </div>
        </div>

        <div className="font-bold">Certificates</div>
        <CertificateTableView certificateData={certificateDetails} />
      </div>

      <Footer />
    </div>
  );
};

export default MemberScreen;
