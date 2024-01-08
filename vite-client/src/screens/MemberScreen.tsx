import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock4 } from "lucide-react";
import csiCardQrImage from "../assets/csi qr code.png";
const MemberScreen = () => {
  return (
    <div className="flex flex-col justify-center space-y-4 p-4">
      <Navbar />
      <Card className="p-4">
        <div className="w-full h-full flex justify-center items-center space-x-4">
          <div>
            <Card className="lg:w-[600px] lg:h-[400px]">
              <div className="flex flex-col p-4 px-6 space-y-1 lg:space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="lg:text-lg">Membership Id</Label>
                    <div className="lg:text-2xl">20XXXXXX14</div>
                  </div>
                  <Badge className="bg-green-700 lg:text-xl" variant="outline">
                    Active
                  </Badge>
                </div>
                <h1 className="text-xl lg:text-6xl font-bold">Jhon Doe</h1>
                <p className="lg:text-2xl">johdoe@gmail.com</p>
                <div className="flex items-center space-x-2">
                  <Badge className="text-xs lg:text-2xl" variant="outline">
                    COMPS
                  </Badge>
                  <Badge className="text-xs lg:text-2xl" variant="outline">
                    SEM IV
                  </Badge>
                  <Badge className="text-xs lg:text-2xl" variant="outline">
                    3 yrs
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="lg:text-lg">Start Date</Label>
                    <div className="flex items-center space-x-1">
                      <Clock4 />
                      <span className="lg:text-2xl">dd/mm/yyyy</span>
                    </div>
                  </div>
                  <div>
                    <Label className="lg:text-lg">End Date</Label>
                    <div className="flex items-center space-x-1">
                      <Clock4 />
                      <span className="lg:text-2xl">dd/mm/yyyy</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div>
            <Card className="flex justify-center items-center">
              <img
                className="h-2/4 w-2/4"
                src={csiCardQrImage}
                alt="grid background"
              />
            </Card>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div>Certificates</div>


      </Card>
    </div>
  );
};

export default MemberScreen;
