import { Home, PanelRight } from "lucide-react";
import verify_csi_logo from "../assets/geometrical-shape.png";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardDescription,
} from "./ui/card";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center py-2 px-6">
      <Link to="/" className="flex justify-center items-center space-x-4">
        <img src={verify_csi_logo} alt="verify csi logo" />
        <span className="text-2xl font-bold">/ verify@csi </span>
      </Link>
      <div>
        <Sheet>
          <SheetTrigger>
            <PanelRight className="text-gray-500" fontSize={48} size={32} />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex justify-center items-center space-x-4">
                <img src={verify_csi_logo} alt="verify csi logo" />
                <span className="text-xl font-bold">/ verify@csi </span>
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
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
