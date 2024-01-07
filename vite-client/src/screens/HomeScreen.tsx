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
import TextTransition, { presets } from "react-text-transition";
import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
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
  };
  return (
    <div>
      <Navbar />
      <div className="p-12 lg:flex justify-center items-center">
        <div className="flex flex-col space-y-8 p-4 lg:w-6/12">
          <div className="text-3xl">/ Take controls on</div>
          <div className="flex text-6xl font-bold">
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
          <Tabs defaultValue="account" className="w-[550px]">
            <TabsList className="grid w-full h-full grid-cols-2">
              <TabsTrigger value="account" className="text-lg">
                Certificate
              </TabsTrigger>
              <TabsTrigger value="password" className="text-lg">
                Membership
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Validate Certificate</CardTitle>
                  <CardDescription>
                    Validate your certificate details here. Click "Validate" to
                    confirm authenticity.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Input id="name" placeholder="eg : xhdgrw" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Validate</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Verify Membership</CardTitle>
                  <CardDescription>
                    Verify your membership status below. Click "Verify" to
                    confirm.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Membership Id</Label>
                    <Input id="current" placeholder="20XXXXXX14" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Verify</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="relative flex flex-col space-y-4 p-4 lg:w-6/12">
          <Card className="lg:min-h-[600px] border flex justify-center items-center p-4">
            <img
              className="relative"
              src={gridBackground}
              alt="grid background"
            />
            <div className="absolute">
              <ReactCardFlip isFlipped={flipped} flipDirection="vertical">
                <Card onClick={handleClick}>
                  <CardHeader>
                    <CardTitle>Verify Membership</CardTitle>
                    <CardDescription>
                      Verify your membership status below. Click "Verify" to
                      confirm.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current">Membership Id</Label>
                      <Input id="current" placeholder="20XXXXXX14" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Verify</Button>
                  </CardFooter>
                </Card>

                <Card onClick={handleClick}>
                  <CardHeader>
                    <CardTitle>Validate Certificate</CardTitle>
                    <CardDescription>
                      Validate your certificate details here. Click "Validate"
                      to confirm authenticity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Input id="name" placeholder="eg : xhdgrw" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Validate</Button>
                  </CardFooter>
                </Card>
              </ReactCardFlip>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
