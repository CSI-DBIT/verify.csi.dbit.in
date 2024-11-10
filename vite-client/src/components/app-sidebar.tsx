import * as React from "react";
import {
  Bot,
  Landmark,
  LayoutDashboard,
  LifeBuoy,
  Scroll,
  Send,
  Ticket,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Organizations",
      url: "/dashboard/organizations",
      icon: Landmark,
      items: [
        {
          title: "My Organizations",
          url: "/dashboard/member/organizations",
        },
      ],
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: Ticket,
      items: [
        {
          title: "My Events",
          url: "/dashboard/member/events",
        },
      ],
    },
    {
      title: "Certificates",
      url: "/dashboard/member/certificates",
      icon: Scroll,
    },
    {
      title: "Members",
      url: "/dashboard/members",
      icon: Bot,
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: Ticket,
      items: [
        {
          title: "My Events",
          url: "/dashboard/organization/events",
        },
        {
          title: "Participants",
          url: "/dashboard/organization/events/participants",
        },
        {
          title: "Form Responses",
          url: "/dashboard/organization/events/forms",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
  home: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
  ],
};


import verifyInitialLogo from "../assets/verifyInitialLogo.png";
import { NavHome } from "./nav-home";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={verifyInitialLogo} alt="verify dev logo" />
                  <AvatarFallback className="rounded-lg">V@D</AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Verify@Dev</span>
                <span className="truncate text-xs flex gap-1 items-center">
                  Organization
                </span>
              </div>
              {/* <Button size={"icon"} variant={"outline"}>
                <QrCode />
              </Button> */}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavHome home={data.home} />
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
