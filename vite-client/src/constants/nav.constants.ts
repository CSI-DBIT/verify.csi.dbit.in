import { Home,CalendarCheck2, UsersRound , LucideIcon } from "lucide-react";

interface NavLinkItemData {
  navTo: string;
  navText: string;
  icon: LucideIcon;
}

export const navLinks: NavLinkItemData[] = [
  {
    navTo: "/dashboard",
    navText: "Dashboard",
    icon: Home,
  },
  {
    navTo: "/events",
    navText: "Events",
    icon: CalendarCheck2,
  },
  {
    navTo: "/members",
    navText: "Members",
    icon: UsersRound ,
  },
];
