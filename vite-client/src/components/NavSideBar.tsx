import {
  Settings,
  CalendarCheck2,
  LayoutDashboard,
  ChevronsUpDown,
  LogOut,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import verifyDev_initial_logo from "../assets/verifyInitialLogo.png";
import { truncateWithEllipses } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
const NavSideBar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-[280px] flex-col border-r bg-muted/40 sm:flex m-2 rounded-lg transition-all">
      {/* <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          to="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <img src={verifyDev_initial_logo} alt="verify dev initial logo" />
          <span className="sr-only">verify@dev</span>
        </Link>
        <NavLinkItem icon={LayoutDashboard} navTo={"/dashboard"} navText={"Dashboard"}/>
        <NavLinkItem icon={CalendarCheck2} navTo={"/dashboard/events"} navText={"Events"}/>
        <NavLinkItem icon={UserRound} navTo={"/dashboard/members"} navText={"Members"}/>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavLinkItem icon={Settings} navTo={"/settings"} navText={"Settings"}/>
      </nav> */}
      <div className="flex justify-center h-full max-h-screen flex-col gap-2">
          <Popover>
            <PopoverTrigger className="p-2 rounded-lg w-[90%] mx-auto mt-3 bg-accent">
              <div className="flex gap-1 items-center w-full">
                <img
                  src={verifyDev_initial_logo}
                  alt="verify dev initial logo"
                  className="h-10 w-10 rounded-lg"
                />
                <section className="text-start grow">
                  <div className="text-sm flex justify-between items-center w-full">
                    <span className="grow">VERIFY@DEV </span>
                    <ChevronsUpDown className="h-4 w-4" />
                  </div>
                  <span className="text-sm">verify@gmail.com</span>
                </section>
              </div>
            </PopoverTrigger>
            <PopoverContent className="max-w-[15rem]">
              More organizations...
            </PopoverContent>
          </Popover>

          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium">
              <Link
                to=""
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="events"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <CalendarCheck2 className="h-4 w-4" />
                Events
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  6
                </Badge>
              </Link>
              <Link
                to="members"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Members{" "}
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 ">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full mt-2 p-2 rounded-lg bg-accent">
                <div className="flex gap-1 items-center w-full">
                  <img
                    src={verifyDev_initial_logo}
                    alt="verify dev initial logo"
                    className="h-10 w-10 rounded-lg"
                  />
                  <section className="text-start grow">
                    <div className="text-sm flex justify-between items-center w-full">
                      <span className="grow">
                        {truncateWithEllipses("Jhon Doe", 20)}
                      </span>
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                    <span className="text-sm truncate">
                      {truncateWithEllipses("jhondoe@example.com5egrdgdsfgfgdfvdv", 20)}
                    </span>
                  </section>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[15rem]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to={"settings"}>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <Link to={"/"}>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Temp home</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. Are you sure you want to
                        permanently delete this file from our servers?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button type="submit">Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
    </aside>
  );
};

export default NavSideBar;
