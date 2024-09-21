import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Home } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Maximum breadcrumb items to display before collapsing
const ITEMS_TO_DISPLAY = 3;

const DashboardBreadcrumb = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const location = useLocation();

  // Get the path segments from the URL
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Dynamically create breadcrumb items based on the current location
  const renderBreadcrumbItems = () => {
    // We want to display at least the last `ITEMS_TO_DISPLAY` segments of the path
    return pathnames.slice(-ITEMS_TO_DISPLAY + 1).map((segment, index) => {
      const to = `/${pathnames.slice(0, index + 1).join("/")}`;

      return (
        <BreadcrumbItem key={index}>
          {index === pathnames.length - 1 ? (
            <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </BreadcrumbPage>
          ) : (
            <>
              <BreadcrumbLink
                asChild
                className="max-w-20 truncate md:max-w-none"
              >
                <Link to={to}>
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </>
          )}
        </BreadcrumbItem>
      );
    });
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home Link */}
        <BreadcrumbLink asChild className="max-w-20 truncate md:max-w-none">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            aria-label="Home"
          >
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Link>
        </BreadcrumbLink>

        <BreadcrumbSeparator />

        {/* Dropdown or Drawer for collapsed items if path is long */}
        {pathnames.length > ITEMS_TO_DISPLAY && (
          <>
            <BreadcrumbItem>
              {isDesktop ? (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger
                    className="flex items-center gap-1"
                    aria-label="More breadcrumbs"
                  >
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {pathnames.slice(1, -2).map((segment, index) => {
                      const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                      return (
                        <DropdownMenuItem key={index}>
                          <Link to={to}>
                            {segment.charAt(0).toUpperCase() + segment.slice(1)}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger aria-label="Open breadcrumb drawer">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Navigate to</DrawerTitle>
                      <DrawerDescription>Select a page to navigate to.</DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-1 px-4">
                      {pathnames.slice(1, -2).map((segment, index) => {
                        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                        return (
                          <Link key={index} to={to} className="py-1 text-sm">
                            {segment.charAt(0).toUpperCase() + segment.slice(1)}
                          </Link>
                        );
                      })}
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {/* Render breadcrumb items dynamically based on the current location */}
        {renderBreadcrumbItems()}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DashboardBreadcrumb;
