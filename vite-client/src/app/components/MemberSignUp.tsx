import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "@/components/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { EyeOff, Eye, HelpCircle, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export const MemberSignUp = () => {
  const signUpSchema = z.object({
    memberName: z.string().min(1, { message: "Member name is required." }),
    about: z.string().min(1, { message: "About is required." }).max(200, {
      message: "About must be at most 200 characters.",
    }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[@$!%*?&]/, {
        message: "Password must contain at least one special character.",
      }),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"], {
      required_error: "You need to select a gender.",
    }),
    birthday: z.date(),
    termsAccepted: z.literal(true, {
      required_error: "You must accept the terms and conditions.",
    }),
  });

  type SignUpFormData = z.infer<typeof signUpSchema>;
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    label: "Weak",
    color: "red-500",
    value: 20,
  });

  const calculatePasswordStrength = (password: string) => {
    let strength = { label: "Weak", color: "red", value: 20 };

    if (password.length >= 5) {
      strength = { label: "Medium", color: "yellow", value: 50 };
    }
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[@$!%*?&]/.test(password)
    ) {
      strength = { label: "Strong", color: "green", value: 100 };
    }

    setPasswordStrength(strength);
  };

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      memberName: "",
      email: "",
      about: "",
      password: "",
      birthday: new Date(),
    },
  });

  const onSubmitSignUp: SubmitHandler<SignUpFormData> = (values) => {
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
        return ["memberName", "about"] as const;
      case 2:
        return ["email", "password"] as const;
      case 3:
        return ["gender", "birthday", "termsAccepted"] as const;
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const navigate = useNavigate();
  const handleTermsNavigation = () => {
    const userConfirmed = window.confirm(
      "All your entered data will be lost. Do you want to proceed?"
    );
    if (userConfirmed) {
      navigate("/terms-and-conditions");
    }
  };
  return (
    <Form {...signUpForm}>
      <form
        onSubmit={signUpForm.handleSubmit(onSubmitSignUp)}
        className="space-y-4"
      >
        {step === 1 && (
          <>
            <FormField
              control={signUpForm.control}
              name="memberName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter member name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Yourself</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a brief description about yourself"
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
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      <span>Password</span>
                      {password && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Choose a password"
                      {...field}
                      onChange={(e) => {
                        const passwordValue = e.target.value;
                        setPassword(passwordValue);
                        field.onChange(e);
                        calculatePasswordStrength(passwordValue);
                      }}
                    />
                  </FormControl>
                  {password && (
                    <div className="flex items-center mt-2 space-x-2">
                      <span
                        className={`text-sm font-semibold mr-2
                    ${
                      passwordStrength.color === "red"
                        ? "text-red-500"
                        : passwordStrength.color === "yellow"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                      >
                        {passwordStrength.label}
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${
                            passwordStrength.color === "red"
                              ? "bg-red-500"
                              : passwordStrength.color === "yellow"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${passwordStrength.value}%`,
                          }}
                        ></div>
                      </div>
                      <HoverCard>
                        <HoverCardTrigger>
                          <HelpCircle className="h-4 w-4 cursor-pointer" />
                        </HoverCardTrigger>
                        <HoverCardContent className="p-4 max-w-xs rounded-md">
                          <h3 className="font-semibold text-lg mb-2">
                            Password Requirements
                          </h3>
                          <ul className="list-disc pl-5">
                            <li>At least 8 characters long</li>
                            <li>Contains at least one uppercase letter</li>
                            <li>Contains at least one lowercase letter</li>
                            <li>Contains at least one number</li>
                            <li>
                              Contains at least one special character (e.g., @,
                              $, !)
                            </li>
                          </ul>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  )}
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
              name="birthday"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        selected={field.value}
                        onSelect={(e) => {
                          field.onChange(e);
                          setIsCalendarOpen(false);
                        }}
                        initialFocus
                        fromYear={1960}
                        toYear={2030}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="MALE" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="FEMALE" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="OTHERS" />
                        </FormControl>
                        <FormLabel className="font-normal">Other</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex items-end gap-2 ">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="flex items-center gap-1">
                    <span>I agree to the</span>
                    <span onClick={handleTermsNavigation}  className="underline cursor-pointer">
                      terms & conditions
                    </span>
                  </FormLabel>
                </FormItem>
              )}
            />
          </>
        )}
        <div className="flex gap-2">
          {step > 1 && (
            <Button onClick={prevStep} type="button" variant="outline">
              Back
            </Button>
          )}
          {step < totalSteps && (
            <Button onClick={nextStep} type="button">
              Next
            </Button>
          )}
          {step === totalSteps && <Button type="submit">Sign Up</Button>}
        </div>
        <div className="flex gap-2">{renderStepsButtons()}</div>
      </form>
    </Form>
  );
};
