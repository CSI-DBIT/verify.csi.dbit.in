import { Home, PanelRight } from "lucide-react";
// import verifyLogo from "@/assets/verify-dark-logo-nobg.png";
import verifyLogoDark from "@/assets/verify.dev_dark_name_logo.png";
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
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "./theme-provider";

const Navbar = () => {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? verifyLogoLight : verifyLogoDark;
  return (
    <div className="flex justify-between items-center py-2 px-6">
      <Link to="/" className="flex justify-center items-center gap-4">
        <img className="w-48" src={logoSrc} alt="verify csi logo"/>
        {/* <span className="text-2xl font-bold">/ verify@csi </span> */}
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
                <img className="w-48" src={logoSrc} alt="verify csi logo" />
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
                <Link to="/certificate-upload">
                  <Card className="p-2 flex items-center space-x-2">
                    <CardDescription>
                      <Home size={22} />
                    </CardDescription>
                    <CardDescription>Certificate Upload</CardDescription>
                  </Card>
                </Link>
              </SheetTitle>
              <SheetTitle>
                <Link to="/login">
                  <Card className="p-2 flex items-center space-x-2">
                    <CardDescription>
                      <Home size={22} />
                    </CardDescription>
                    <CardDescription>Login</CardDescription>
                  </Card>
                </Link>
              </SheetTitle>
              <SheetTitle>
                <Link to="/certificate">
                  <Card className="p-2 flex items-center space-x-2">
                    <CardDescription>
                      <Home size={22} />
                    </CardDescription>
                    <CardDescription>Certificate</CardDescription>
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
                <Link to="/certificate-allocation">
                  <Card className="p-2 flex items-center space-x-2">
                    <CardDescription>
                      <Home size={22} />
                    </CardDescription>
                    <CardDescription>certificate allocation</CardDescription>
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
              <SheetTitle>
                <Link to="/temp">
                  <Card className="p-2 flex items-center space-x-2">
                    <CardDescription>
                      <Home size={22} />
                    </CardDescription>
                    <CardDescription>Temp</CardDescription>
                  </Card>
                </Link>
              </SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
