import { Home, PanelRight } from "lucide-react";
import verifyLogoLight from "@/assets/verify.dev_light_name_logo.png";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import AuthForm from "./ui_elements/AuthForm";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-6">
      <Link to="/" className="flex justify-center items-center gap-4">
        <img className="w-48" src={verifyLogoLight} alt="verify csi logo" />
      </Link>
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger>
            <Button variant="outline" size="icon">
              <PanelRight />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex justify-center items-center space-x-4">
                <img className="w-48" src={verifyLogoLight} alt="verify csi logo" />
              </SheetTitle>
              <SheetTitle>
                <Link to="/">
                  <Card className="p-2 flex items-center space-x-2">
                    <CardDescription>
                      <Home size={22} />
                    </CardDescription>
                    <CardDescription>Home</CardDescription>
                  </Card>
                </Link>
              </SheetTitle>
              <SheetTitle>
                <Link to="/signUp">
                  <Card className="p-2 flex items-center space-x-2">
                    <CardDescription>
                      <Home size={22} />
                    </CardDescription>
                    <CardDescription>Sign Up</CardDescription>
                  </Card>
                </Link>
              </SheetTitle>
              <SheetTitle>
                <Link to="/manage/members">
                  <Card className="p-2 flex items-center space-x-2">
                    <CardDescription>
                      <Home size={22} />
                    </CardDescription>
                    <CardDescription>Manage Members</CardDescription>
                  </Card>
                </Link>
              </SheetTitle>
              <SheetTitle>
                <Link to="/manage/events">
                  <Card className="p-2 flex items-center space-x-2">
                    <CardDescription>
                      <Home size={22} />
                    </CardDescription>
                    <CardDescription>Manage Events</CardDescription>
                  </Card>
                </Link>
              </SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <AuthForm />
      </div>
    </div>
  );
};

export default Navbar;
