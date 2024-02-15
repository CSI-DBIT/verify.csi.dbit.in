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
import { Clock4, Instagram, Linkedin, Youtube } from "lucide-react";
import Footer from "@/components/Footer";
const HomeScreen = () => {
  const TEXTS = ["Verify.", "Certificate.", "Membership."];
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
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="lg:p-12 p-4 lg:flex flex-grow justify-center items-center">
        <div className="flex flex-col lg:space-y-8 space-y-3 p-4 lg:w-6/12">
          <div className="lg:text-3xl text-xl">
            / Verify & Authenticate easily through
          </div>
          <div className="flex lg:text-6xl text-3xl font-bold">
            <span>csi@</span>
            <TextTransition springConfig={presets.wobbly}>
              {TEXTS[index % TEXTS.length]}
            </TextTransition>
          </div>
          <div className="lg:w-6/12">
            Ensure your{" "}
            <span className="font-bold text-lg italic">
              certificate's & membership
            </span>{" "}
            authenticity through{" "}
            <span className="font-bold text-lg italic">verify@csi</span>. Gain
            confidence that your certificates are legitimate and issued by
            CSI_DBIT.
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
                      Validate your certificate details here. Click "Validate"
                      to recieve certificate.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current">Certificate code:</Label>
                      <Input id="code" placeholder="eg : xhdgrw" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Validate</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="member">
                <Card>
                  <CardHeader>
                    <CardTitle>Verify Membership</CardTitle>
                    <CardDescription>
                      Verify your membership status below. Click "Verify" for
                      member verification.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current">Student Id:</Label>
                      <Input id="studentId" placeholder="20XXXXXX14" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Verify</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="flex flex-col space-y-4 p-4 lg:w-6/12">
          <Card className="lg:h-[600px] border lg:flex justify-center items-center p-4">
            <img
              className="hidden lg:block lg:relative h-full w-full"
              src={gridBackground}
              alt="grid background"
            />
            <div className="lg:absolute">
              <ReactCardFlip isFlipped={flipped} flipDirection="vertical">
                <Card
                  onClick={handleClick}
                  className="lg:w-[600px] lg:h-[400px]"
                >
                  <div className="flex flex-col p-4 px-6 space-y-1 lg:space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="lg:text-lg">Membership Id</Label>
                        <div className="lg:text-2xl">20XXXXXX14</div>
                      </div>
                      <Badge
                        className="bg-green-700 lg:text-xl"
                        variant="outline"
                      >
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

                <Card
                  onClick={handleClick}
                  className="lg:w-[600px] lg:h-[400px]"
                >
                  <div className="flex flex-col p-4 px-6 space-y-1 lg:space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="lg:text-lg">Membership Id</Label>
                        <div className="lg:text-2xl">20XXXXXX14</div>
                      </div>
                      <Badge
                        className="bg-green-700 lg:text-xl"
                        variant="outline"
                      >
                        Active
                      </Badge>
                    </div>
                    <div className="lg:flex items-center justify-between ">
                      <div>
                        <h1 className="text-xl lg:text-4xl font-bold">
                          CSI DBIT
                        </h1>
                        <p className="lg:text-lg">
                          CSI has effectively created a platform for everyone to
                          progress together, and has relentlessly worked to
                          provide the best.
                        </p>
                      </div>
                      <div className="flex justify-center items-center">
                        <img
                          className="h-3/4 w-3/4"
                          src={csiCardQrImage}
                          alt="grid background"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Instagram />
                      <Button variant="link">@csidbit</Button>
                      <Linkedin />
                      <Button variant="link">@csidbit</Button>
                      <Youtube />
                      <Button variant="link">@CSIDBIT</Button>
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
