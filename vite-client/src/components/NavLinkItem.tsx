import { NavLink } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { LucideIcon } from "lucide-react";

export interface NavLinkItemProps {
  icon: LucideIcon;
  navTo: string;
  navText: string;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({
  icon: Icon,
  navTo,
  navText,
}) => {
  const normalLink =
    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8";
  const activeLink =
    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 bg-accent";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavLink
          to={navTo}
          className={({ isActive }) => (isActive ? activeLink : normalLink)} // Checks if the link is active
          end={navTo === "/dashboard"}
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{navText}</span>
        </NavLink>
      </TooltipTrigger>
      <TooltipContent side="right">{navText}</TooltipContent>
    </Tooltip>
  );
};

export default NavLinkItem;
