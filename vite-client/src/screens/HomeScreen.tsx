import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import gridBackground from "../assets/3d-perspective-grid-very-long.svg";
import csiCardQrImage from "../assets/csi qr code.png";
import TextTransition, { presets } from "react-text-transition";
import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { Badge } from "@/components/ui/badge";
import { Clock4 } from "lucide-react";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
const HomeScreen = () => {
  const TEXTS = ["Verify.", "Validate.", "Authenticate."];
  const [index, setIndex] = useState(0);
  const [flipped, setflipped] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index: number) => index + 1),
      3000 // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);
  const handleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setflipped(!flipped);
    console.log(import.meta.env.VITE_DEV_SERVER_URL);
  };
  const [certificateCode, setCertificateCode] = useState("");
  const [studentId, setStudentId] = useState("");
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="px-4 lg:flex flex-grow justify-center items-center">
        <div className="flex flex-col lg:space-y-8 space-y-3 p-4 lg:w-6/12">
          <div className="lg:text-3xl text-xl">
            <div className="flex flex-wrap items-center">
              <span>@</span>
              <TextTransition
                springConfig={presets.wobbly}
                className="font-bold"
              >
                {TEXTS[index % TEXTS.length]}
              </TextTransition>
            </div>
            <span>easily through verify@dev</span>
          </div>
          <div className="lg:w-3/4">
            Ensure your{" "}
            <span className="font-bold text-lg italic">
              certificate's & membership
            </span>{" "}
            authenticity through{" "}
            <span className="font-bold text-lg italic">verify@csi</span>
          </div>
          <div className="lg:w-[550px]">
            <Tabs defaultValue="certificate">
              <TabsList className="grid w-full h-full grid-cols-2">
                <TabsTrigger value="certificate" className="text-lg">
                  Certificate
                </TabsTrigger>
                <TabsTrigger value="member" className="text-lg">
                  Membership
                </TabsTrigger>
              </TabsList>
              <TabsContent value="certificate">
                <Card>
                  <CardHeader>
                    <CardTitle>Validate Certificate</CardTitle>
                    <CardDescription>
                      Enter your certificate code below to validate your
                      certificate
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current">Certificate code:</Label>
                      <Input
                        value={certificateCode}
                        onChange={(e) => setCertificateCode(e.target.value)}
                        id="code"
                        placeholder="eg : xhdgrw38yz"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/certificate/${certificateCode}`}>
                      <Button variant={"secondary"}>
                        Validate Certificate
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="member">
                <Card>
                  <CardHeader>
                    <CardTitle>Verify Membership</CardTitle>
                    <CardDescription>
                      Enter your Student Id below to verify your membership
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current">Student Id:</Label>
                      <Input
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        id="studentId"
                        placeholder="20XXXXXX14"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/member/${studentId}`}>
                      <Button variant={"secondary"}>Verify Membership</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="flex flex-col space-y-4 p-4 lg:w-6/12">
          <Card className="lg:flex justify-center items-center p-4">
            <img
              className="hidden lg:block lg:relative h-full w-full"
              src={gridBackground}
              alt="grid background"
            />
            <div className="lg:absolute">
              <ReactCardFlip isFlipped={flipped} flipDirection="vertical">
                <Card
                  onClick={handleClick}
                  className="min-w-[450px] min-h-[250px]"
                >
                  <div className="flex w-full h-full flex-col p-4 px-6 space-y-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="">Membership Id</Label>
                        <div className="">20XXXXXX14</div>
                      </div>
                      <Badge className="bg-green-700 " variant="outline">
                        Active
                      </Badge>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold">Jhon Doe</h1>
                      <div>johdoe@gmail.com</div>
                      <div className="flex items-center space-x-2 py-3">
                        <Badge className="text-xs" variant="outline">
                          COMPS
                        </Badge>
                        <Badge className="text-xs" variant="outline">
                          SEM 6
                        </Badge>
                        <Badge className="text-xs" variant="outline">
                          3 yrs
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="">Start Date</Label>
                        <div className="flex items-center space-x-1">
                          <Clock4 className="h-4 w-4" />
                          <span className="">dd/mm/yyyy</span>
                        </div>
                      </div>
                      <div>
                        <Label className="">End Date</Label>
                        <div className="flex items-center space-x-1">
                          <Clock4 className="h-4 w-4" />
                          <span className="">dd/mm/yyyy</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card onClick={handleClick} className="w-[450px] h-[250px]">
                  <div className="flex flex-col p-4 px-6 space-y-1 lg:space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="">Membership Id</Label>
                        <div className="">20XXXXXX14</div>
                      </div>
                      <Badge className="bg-green-700 " variant="outline">
                        Active
                      </Badge>
                    </div>
                    <div className="lg:flex items-center justify-between ">
                      <div>
                        <h1 className=" font-bold">CSI DBIT</h1>
                        <p className="text-xs">
                          CSI has effectively created a platform for everyone to
                          progress together, and has relentlessly worked to
                          provide the best.
                        </p>
                      </div>
                      <div className="flex justify-end items-center">
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
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomeScreen;
