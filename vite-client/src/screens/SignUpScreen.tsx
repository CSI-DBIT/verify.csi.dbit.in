import { Link } from "react-router-dom";
import verifyLogoLight from "@/assets/verify.dev_light_name_logo.png";
import imagePlaceholder from "@/assets/verifyInitialLogo.png";
import GridPattern from "@/components/magicUi/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { OrganizationSignUp } from "@/app/components/OrganizationSignUp";
import { MemberSignUp } from "@/app/components/MemberSignUp";
const SignUpForm = () => {
  return (
    <div className="w-full h-full lg:flex">
      <div className="lg:w-1/2 p-4 flex justify-center items-center hidden lg:block">
        <div className="w-full">
          <Link to="/" className="flex justify-center items-center gap-4">
            <img className="w-48" src={verifyLogoLight} alt="verify csi logo" />
          </Link>
          <div className="lg:flex justify-center items-center">
            <GridPattern
              numSquares={50}
              maxOpacity={0.3}
              duration={3}
              repeatDelay={1}
              className={cn(
                "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
                "inset-x-0 inset-y-[-50%] h-[500px] skew-y-12 hidden lg:block lg:relative"
              )}
            />
            <div className="lg:absolute">
              <Card className="lg:w-[450px] lg:h-[250px]">
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
                  <div className="lg:flex items-center justify-between">
                    <div className="w-3/4">
                      <h1 className="font-bold capitalize">
                        Verify Dev
                      </h1>
                      <p className="text-xs text-wrap">
                          VD has effectively created a platform for everyone to progress together, and has relentlessly worked to provide the best.
                      </p>
                      <p className="flex gap-2 items-center mt-2">
                        <Phone className="h-4 w-4" />
                        <span>xxxxxxxx81</span>
                      </p>
                    </div>
                    <div className="w-1/4">
                      <img
                        className="aspect-square object-cover"
                        src={imagePlaceholder}
                        alt="Organization"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2">
            <span>Already have an account?</span>
            <span className="group hover:underline flex items-center justify-center">
              <Link to={"/"}>Login</Link>
            </span>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 p-4 flex justify-center items-center">
        <div className="w-9/12">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-4 text-center">
            Sign Up
          </h1>
          <Tabs defaultValue="organization">
            <TabsList className="size-full grid grid-cols-2">
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="member">Member</TabsTrigger>
            </TabsList>
            <TabsContent value="organization">
              <OrganizationSignUp />
            </TabsContent>
            <TabsContent value="member">
              <MemberSignUp />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
