import {
  Settings,
  CalendarCheck2,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import verifyDev_initial_logo from "../assets/verifyInitialLogo.png";
import NavLinkItem from "./NavLinkItem";
const NavSideBar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
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
      </nav>
    </aside>
  );
};

export default NavSideBar;
