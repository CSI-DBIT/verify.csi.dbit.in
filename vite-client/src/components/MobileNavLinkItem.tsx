import { NavLink } from "react-router-dom"
import { NavLinkItemProps } from "./NavLinkItem";

const MobileNavLinkItem: React.FC<NavLinkItemProps> = ({
    icon: Icon,
    navTo,
    navText,
}) => {
    return (
        <NavLink
            to={navTo}
            className={({ isActive }) =>
                `flex items-center gap-4 px-2.5 ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
            }
        >
            <Icon className="h-5 w-5" />
            {navText}
        </NavLink>
    )
}

export default MobileNavLinkItem