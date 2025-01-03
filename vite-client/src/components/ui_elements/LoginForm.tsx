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
import { Link } from "react-router-dom";

const loginSchema = z.object({
  org_code: z
    .string()
    .min(2, { message: "Organization code must be at least 2 characters." })
    .max(10, { message: "Organization code must be at most 10 characters." }),
  password: z
    .string()
    .min(2, { message: "Password must be at least 2 characters." })
    .max(10, { message: "Password must be at most 10 characters." }),
});

interface LoginFormProps {
  switchToForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ switchToForgotPassword }) => {
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { org_code: "", password: "" },
  });

  const onSubmitLogin = (values: z.infer<typeof loginSchema>) => {
    console.log("Login:", values);
  };

  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(onSubmitLogin)}
        className="space-y-4"
      >
        <FormField
          control={loginForm.control}
          name="org_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="jhon@doe.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel>Password</FormLabel>
                <button
                  type="button"
                  onClick={switchToForgotPassword}
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </button>
              </div>
              <FormControl>
                <Input placeholder="*******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link to={"/signup"} className="underline">
          Sign up
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
