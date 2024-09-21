import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const signUpSchema = z.object({
  org_name: z.string().max(25, { message: "Organisation name must be at most 25 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  description: z.string().optional(),
  password: z
    .string()
    .min(2, { message: "Password must be at least 2 characters." })
    .max(10, { message: "Password must be at most 10 characters." }),
  confirmPassword: z.string().min(2, { message: "Confirm password must be at least 2 characters." }),
  address: z.string().optional(),
  org_image: z.string().optional(), // Assuming a URL for simplicity
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number must be at most 15 digits." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface SignUpFormProps {
  switchToLogin: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ switchToLogin }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const signUpForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      org_name: "",
      email: "",
      description: "",
      password: "",
      confirmPassword: "",
      address: "",
      org_image: "",
      phone: "",
    },
  });

  const onSubmitSignUp = (values: z.infer<typeof signUpSchema>) => {
    console.log("Sign Up:", values);
    // Handle form submission here
  };

  const nextStep = async () => {
    const isValid = await signUpForm.trigger();

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <Form {...signUpForm}>
      <form onSubmit={signUpForm.handleSubmit(onSubmitSignUp)} className="space-y-4">
        {step === 1 && (
          <>
            <FormField
              control={signUpForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisation Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
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
                    <Input type="password" placeholder="*******" {...field} />
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
                    <Input type="password" placeholder="*******" {...field} />
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
              name="org_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisation Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Organisation Name" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Organisation Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="org_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisation Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="http://example.com/image.jpg" {...field} />
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
                  <FormLabel>Primary Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </>
        )}

        <div className="flex justify-between">
          {step > 1 && (
            <Button type="button" onClick={prevStep} variant="outline">
              Back
            </Button>
          )}
          {step < totalSteps && (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          )}
        </div>
      </form>

      <div className="mt-4 text-center text-sm">
        Step {step} of {totalSteps}
      </div>

      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <button type="button" onClick={switchToLogin} className="underline">
          Login
        </button>
      </div>
    </Form>
  );
};

export default SignUpForm;
