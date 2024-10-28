import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const AuthForm: React.FC = () => {
  const [formType, setFormType] = useState<"login" | "signUp" | "forgotPassword">("login");

  const switchToSignUp = () => setFormType("signUp");
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
        <Button variant="outline">
          {formType === "login" ? "Login" : formType === "signUp" ? "Sign Up" : "Forgot Password"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div>
          <CardHeader>
            <CardTitle className="text-2xl">
              {formType === "login" ? "Login" : formType === "signUp" ? "Sign Up" : "Forgot Password"}
            </CardTitle>
            <CardDescription>
              {formType === "login"
                ? "Enter your organization code to login to your account"
                : formType === "signUp"
                ? "Create a new account with your email and organization code"
                : "Enter your organization code or email to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formType === "login" && (
              <LoginForm switchToSignUp={switchToSignUp} switchToForgotPassword={switchToForgotPassword} />
            )}
            {formType === "signUp" && <SignUpForm switchToLogin={switchToLogin} />}
            {formType === "forgotPassword" && <ForgotPasswordForm switchToLogin={switchToLogin} />}
          </CardContent>
          <DialogClose />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthForm;
