import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./LoginForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const AuthForm: React.FC = () => {
  const [formType, setFormType] = useState<
    "login" | "signUp" | "forgotPassword"
  >("login");
  const switchToLogin = () => setFormType("login");
  const switchToForgotPassword = () => setFormType("forgotPassword");

  // Reset to login form when the dialog is closed
  useEffect(() => {
    const handleDialogClose = () => setFormType("login");
    return () => {
      handleDialogClose();
    };
  }, []);

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setFormType("login")}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div>
          <CardHeader>
            <CardTitle className="text-2xl">
              {formType === "login" ? "Login" : "Forgot Password"}
            </CardTitle>
            <CardDescription>
              {formType === "login"
                ? "Enter your email linked to your organization or member account"
                : "Enter your email to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formType === "login" && (
              <LoginForm switchToForgotPassword={switchToForgotPassword} />
            )}
            {formType === "forgotPassword" && (
              <ForgotPasswordForm switchToLogin={switchToLogin} />
            )}
          </CardContent>
          <DialogClose />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthForm;
