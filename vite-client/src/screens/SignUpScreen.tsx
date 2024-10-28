import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";
import verifyLogoLight from "@/assets/verify.dev_light_name_logo.png";
import imagePlaceholder from "@/assets/verifyInitialLogo.png";
import GridPattern from "@/components/magicUi/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Phone } from "lucide-react";
import { max } from "date-fns";

const signUpSchema = z
  .object({
    orgName: z
      .string()
      .max(35, { message: "Organization name must be at most 35 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    description: z.string().max(100, { message: "Organization description must be at most 60 characters." }).optional(),
    password: z
      .string()
      .min(2, { message: "Password must be at least 2 characters." })
      .max(10, { message: "Password must be at most 10 characters." }),
    confirmPassword: z
      .string()
      .min(2, { message: "Confirm password must be at least 2 characters." }),
    address: z.string().optional(),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits." })
      .max(15, { message: "Phone number must be at most 15 digits." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SignUpForm = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const signUpForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      orgName: "",
      email: "",
      description: "",
      password: "",
      confirmPassword: "",
      address: "",
      org_image: "",
      phone: "",
    },
  });

  // Watch the form fields for changes
  const orgName$ = signUpForm.watch("orgName");
  const description$ = signUpForm.watch("description");
  const phone$ = signUpForm.watch("phone");

  const onSubmitSignUp = (values: z.infer<typeof signUpSchema>) => {
    console.log("Sign Up:", values);
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForCurrentStep(step);
    const isValid = await signUpForm.trigger(fieldsToValidate);

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const getFieldsForCurrentStep = (step: number) => {
    switch (step) {
      case 1:
        return ["email", "password", "confirmPassword"] as const;
      case 2:
        return ["orgName", "description", "org_image"] as const;
      case 3:
        return ["address", "phone"] as const;
      default:
        return [];
    }
  };

  const renderStepsButtons = () => {
    return Array.from({ length: totalSteps }, (_, index) => (
      <a
        key={index}
        className={`flex w-full py-1 rounded-full border ${
          step === index + 1
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-400"
        }`}
      />
    ));
  };

  const logoSrc = verifyLogoLight;

  return (
    <div className="w-full h-screen lg:flex">
      <div className="lg:w-1/2 p-4 flex justify-center items-center">
        <div className="w-full">
          <Link to="/" className="flex justify-center items-center gap-4">
            <img className="w-48" src={logoSrc} alt="verify csi logo" />
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
                      <h1 className="font-bold">
                        {orgName$ || "Organization Name"}
                      </h1>
                      <p className="text-xs text-wrap">
                        {description$ ||
                          "CSI has effectively created a platform for everyone to progress together, and has relentlessly worked to provide the best."}
                      </p>
                      <p className="flex gap-2 items-center mt-2">
                        <Phone className="h-4 w-4" />
                        {phone$ || "xxxxxxxx81"}
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
          <Form {...signUpForm}>
            <form
              onSubmit={signUpForm.handleSubmit(onSubmitSignUp)}
              className="space-y-4"
            >
              {step === 1 && (
                <>
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Choose a password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <FormField
                    control={signUpForm.control}
                    name="orgName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your organization name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your organization description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <FormField
                    control={signUpForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="flex justify-between">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                )}
                {step < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit">Sign Up</Button>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-6">
                {renderStepsButtons()}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
