import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock4 } from "lucide-react";
import csiCardQrImage from "../assets/csi qr code.png";
import Certificate from "../components/Cerificate"; // Import Certificate component
import { ScrollArea } from "@/components/ui/scroll-area";
import Footer from "@/components/Footer";

const MemberScreen = () => {
  const getBranchText = (branchNumber: number) => {
    type BranchMap = { [key: number]: string };

    const branchMap: BranchMap = {
      1: "IT",
      2: "COMPS",
      3: "EXTC",
      4: "MECH",
    };

    return branchMap[branchNumber];
  };
  const [memberData, setMemberData] = useState<{
    membershipId: number;
    status: string;
    name: string;
    email: string;
    currentBranch: number;
    currentSemester: number;
    membershipDuration: number;
    startDate: string;
    endDate: string;
    certificates: { title: string }[];
  } | null>(null);

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch("your-api-endpoint")
      .then((response) => response.json())
      .then((data) => setMemberData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    // Dummy data for testing
    const dummyData = {
      membershipId: 2020130014,
      status: "Active",
      name: "John Doe",
      email: "johndoe@gmail.com",
      currentBranch: 4,
      currentSemester: 6,
      membershipDuration: 3,
      startDate: "dd/mm/yyyy",
      endDate: "dd/mm/yyyy",
      certificates: [
        { title: "Certificate 1" },
        { title: "Certificate 2" },
        { title: "Certificate 2" },
        { title: "Certificate 2" },
        { title: "Certificate 2" },
        { title: "Certificate 2" },
        { title: "Certificate 2" },
        { title: "Certificate 2" },
        { title: "Certificate 2" },
        { title: "Certificate 2" },
        { title: "Certificate 2" },
        { title: "Certificate 2" },
      ],
    };

    setMemberData(dummyData);
  }, []);

  if (!memberData) {
    // Display a loading indicator while data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow justify-center items-center space-y-4 p-4">
        <div className="w-full h-full lg:flex justify-center items-center lg:space-x-4">
          <Card className="lg:w-3/4 lg:h-[400px] p-4">
            <div className="flex flex-col p-4 px-6 space-y-1 lg:space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <Label className="lg:text-lg">Membership Id</Label>
                  <div className="lg:text-2xl">{memberData.membershipId}</div>
                </div>
                <Badge
                  className="bg-green-700 lg:text-xl px-4 py-1"
                  variant="outline"
                >
                  {memberData.status}
                </Badge>
              </div>
              <h1 className="text-xl lg:text-6xl font-bold">
                {memberData.name}
              </h1>
              <p className="lg:text-2xl">{memberData.email}</p>
              <div className="flex items-center space-x-2">
                <Badge
                  className="text-xs lg:text-2xl lg:px-6"
                  variant="outline"
                >
                  {getBranchText(memberData.currentBranch)}
                </Badge>
                <Badge
                  className="text-xs lg:text-2xl lg:px-6"
                  variant="outline"
                >
                  SEM {memberData.currentSemester}
                </Badge>
                <Badge
                  className="text-xs lg:text-2xl lg:px-6"
                  variant="outline"
                >
                  {memberData.membershipDuration} yrs
                </Badge>
              </div>
              <div className="flex space-x-4 items-center">
                <div>
                  <Label className="lg:text-lg">Start Date</Label>
                  <div className="flex items-center space-x-2">
                    <Clock4 />
                    <span className="lg:text-2xl">{memberData.startDate}</span>
                  </div>
                </div>
                <div>
                  <Label className="lg:text-lg">End Date</Label>
                  <div className="flex items-center space-x-2">
                    <Clock4 />
                    <span className="lg:text-2xl">{memberData.endDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card className="lg:w-1/4 lg:h-[400px] flex justify-center items-center">
            <img
              className="h-3/4 w-3/4 object-contain p-4"
              src={csiCardQrImage}
              alt="grid background"
            />
          </Card>
        </div>
        <Card className="w-full p-6 space-y-4">
          <div className="lg:text-4xl font-bold">Certificates</div>
          <ScrollArea className="h-[300px]">
            {memberData.certificates.map((certificate, index) => (
              <Certificate key={index} data={certificate} />
            ))}
          </ScrollArea>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default MemberScreen;
