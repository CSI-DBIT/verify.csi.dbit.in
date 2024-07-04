import GridPattern from "@/components/magicUi/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import ReactCardFlip from "react-card-flip";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock4 } from "lucide-react";
import csiCardQrImage from "../assets/csi qr code.png";
import { useEffect, useState } from "react";
import TextTransition, { presets } from "react-text-transition";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Footer from "@/components/Footer";
import verifyLogoDark from "@/assets/verify.dev_dark_name_logo.png";
import verifyLogoLight from "@/assets/verify.dev_light_name_logo.png";
import { useTheme } from "@/components/theme-provider";
const validateCertificateSchema = z.object({
  uniqueCertificateCode: z.string().min(1).max(10),
});
const verifyMembershipSchema = z.object({
  studentId: z.string().min(1).max(10),
});
const Temp = () => {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? verifyLogoLight : verifyLogoDark;
  const navigate = useNavigate();
  const TEXTS = ["Verify.", "Validate.", "Authenticate."];
  const [index, setIndex] = useState(0);
  const [flipped, setflipped] = useState(false);
  const validateCertificateform = useForm<
    z.infer<typeof validateCertificateSchema>
  >({
    resolver: zodResolver(validateCertificateSchema),
    defaultValues: {
      uniqueCertificateCode: "",
    },
  });

  function onValidateCertificateformSubmit(
    values: z.infer<typeof validateCertificateSchema>
  ) {
    console.log(values);
    navigate(`/certificate/validate/${values.uniqueCertificateCode}`);
  }

  const verifyMembershipform = useForm<z.infer<typeof verifyMembershipSchema>>({
    resolver: zodResolver(verifyMembershipSchema),
    defaultValues: {
      studentId: "",
    },
  });

  function onVerifyMembershipformSubmit(
    values: z.infer<typeof verifyMembershipSchema>
  ) {
    console.log(values);
    navigate(`/member/verify/${values.studentId}`);
  }

  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index: number) => index + 1),
      3000 // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full lg:grid lg:grid-cols-2 h-screen">
        <div className="flex items-center justify-between">
          <div className="flex flex-col lg:space-y-8 space-y-3 px-10">
            <img className="w-48" src={logoSrc} alt="verify csi logo" />
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
                  <TabsTrigger value="certificate">Certificate</TabsTrigger>
                  <TabsTrigger value="member">Membership</TabsTrigger>
                </TabsList>
                <TabsContent value="certificate">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Validate Certificate
                      </CardTitle>
                      <CardDescription>
                        Enter your certificate code below to validate your
                        certificate
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...validateCertificateform}>
                        <form
                          onSubmit={validateCertificateform.handleSubmit(
                            onValidateCertificateformSubmit
                          )}
                          className="space-y-2"
                        >
                          <FormField
                            control={validateCertificateform.control}
                            name="uniqueCertificateCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Certificate Code:</FormLabel>
                                <FormControl>
                                  <Input placeholder="xg******op" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            variant={"secondary"}
                            className="w-full"
                            type="submit"
                          >
                            Validate Certificate
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="member">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Verify Membership
                      </CardTitle>
                      <CardDescription>
                        Enter your Student Id below to verify your membership
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...verifyMembershipform}>
                        <form
                          onSubmit={verifyMembershipform.handleSubmit(
                            onVerifyMembershipformSubmit
                          )}
                          className="space-y-2"
                        >
                          <FormField
                            control={verifyMembershipform.control}
                            name="studentId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Student Id:</FormLabel>
                                <FormControl>
                                  <Input placeholder="20******19" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            variant={"secondary"}
                            className="w-full"
                            type="submit"
                          >
                            Verify Membership
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <div className="relative flex w-full h-full items-center justify-center overflow-hidden bg-background p-20">
            <div className="lg:absolute">
              <ReactCardFlip isFlipped={flipped} flipDirection="vertical">
                <div className="">
                  <Card
                    onClick={() => setflipped(!flipped)}
                    className="lg:w-[450px] lg:h-[250px] bg-white/15"
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
                </div>
                <Card
                  onClick={() => setflipped(!flipped)}
                  className="lg:w-[450px] lg:h-[250px] bg-white/15"
                >
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
            </div>

            <GridPattern
              numSquares={40}
              maxOpacity={0.3}
              duration={3}
              repeatDelay={1}
              className={cn(
                "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
                "inset-x-0 inset-y-[-50%] h-[200%] skew-y-12"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Temp;
