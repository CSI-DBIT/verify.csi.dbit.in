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

const forgotPasswordSchema = z.object({
  org_code_or_email: z
    .string()
    .min(2, { message: "Organisation code or email must be at least 2 characters." }),
});

interface ForgotPasswordFormProps {
  switchToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ switchToLogin }) => {
  const forgotPasswordForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { org_code_or_email: "" },
  });

  const onSubmitForgotPassword = (values: z.infer<typeof forgotPasswordSchema>) => {
    console.log("Forgot Password:", values);
  };

  return (
    <Form {...forgotPasswordForm}>
      <form onSubmit={forgotPasswordForm.handleSubmit(onSubmitForgotPassword)} className="space-y-4">
        <FormField
          control={forgotPasswordForm.control}
          name="org_code_or_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organisation Code or Email</FormLabel>
              <FormControl>
                <Input placeholder="xh7e2w6s or email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Remembered your password?{" "}
        <button type="button" onClick={switchToLogin} className="underline">
          Login
        </button>
      </div>
    </Form>
  );
};

export default ForgotPasswordForm;
