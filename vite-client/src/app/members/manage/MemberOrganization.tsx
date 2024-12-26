import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BellRing, ArrowUp, Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { List_Card_Toggle } from "@/app/components/List-Card-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import OrganizationCard from "@/app/components/OrganizationCard";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

// Mock API call
const fetchOrganizations = (): Promise<any[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const mockData = Array.from({ length: 10 }, (_, i) => ({
        orgId: `${i + 1}`,
        orgName: `Organization ${i + 1}`,
        description: `Description for Organization ${i + 1}`,
        type: i % 3 === 0 ? "INVITATION_ONLY" : "FREE_FOR_ALL",
        category: i % 3 === 0 ? "Technology" : "Arts",
        logo: "",
        reputationCredits: 1000 + i * 10,
        emailVerified: i % 2 === 0,
        members: Array.from(
          { length: Math.floor(Math.random() * 10) + 1 },
          (_, j) => ({
            memberId: `M${i + 1}-${j + 1}`,
            name: `Member ${j + 1} of Org ${i + 1}`,
            image: "",
          })
        ),
        isMember: true,
        isFavorite: i % 3 === 0,
      }));
      resolve(mockData);
    }, 2000); // Simulate a 2-second API delay
  });

const MemberOrganization = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [viewType, setViewType] = useState<"list" | "card">("card");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Fetch organizations from mock API
  useEffect(() => {
    setLoading(true);
    fetchOrganizations().then((data) => {
      setOrganizations(data);
      setFilteredOrganizations(data);
      setLoading(false);
    });
  }, []);

  // Debounce logic for search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    // Filter logic
    setFilteredOrganizations(
      organizations.filter(
        (org) =>
          org.orgName
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) &&
          (typeFilter === "ALL" || org.type === typeFilter) &&
          (categoryFilter === "ALL" || org.category === categoryFilter)
      )
    );
  }, [debouncedSearchQuery, typeFilter, categoryFilter, organizations]);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resetFilters = () => {
    setTypeFilter("ALL");
    setCategoryFilter("ALL");
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <Link to={"/dashboard"}>
                <BreadcrumbLink asChild>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbLink>
              </Link>
              <BreadcrumbSeparator />
              <Link to={"/dashboard/organizations"}>
              <BreadcrumbItem>
                <BreadcrumbPage>Organizations</BreadcrumbPage>
              </BreadcrumbItem>
              </Link>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>My Organizations</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button variant={"ghost"} size={"icon"} className="size-7">
          <BellRing />
        </Button>
      </header>

      <div className="lg:flex items-center justify-between gap-4 px-10 py-4">
        <div className="flex gap-2 items-center">
          <span className="p-3 bg-secondary rounded-full">
            <Search className="size-4" />
          </span>
          <Input
            type="text"
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <Filter /> <span>Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Organization Type</Label>
                <Select
                  onValueChange={(value) => setTypeFilter(value)}
                  value={typeFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Organization Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="FREE_FOR_ALL">Free for All</SelectItem>
                    <SelectItem value="INVITATION_ONLY">
                      Invitation Only
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Organization Category</Label>
                <Select
                  onValueChange={(value) => setCategoryFilter(value)}
                  value={categoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Organization Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={resetFilters}>Reset Filters</Button>
            </PopoverContent>
          </Popover>
          <List_Card_Toggle
            viewType={viewType}
            onToggle={(type) => setViewType(type)}
          />
        </div>
      </div>

      <section className="px-10 py-4">
        {loading ? (
          viewType === "card" ? (
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="space-y-4 p-4">
                  <Skeleton className="h-40 w-full rounded-md" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </Card>
              ))}
            </section>
          ) : (
            <section className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="flex gap-4 p-4 items-center">
                  <Skeleton className="h-20 w-20 rounded-md" />
                  <div className="flex flex-col flex-1 gap-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                  <Skeleton className="h-10 w-32 rounded-md" />
                </Card>
              ))}
            </section>
          )
        ) : filteredOrganizations.length > 0 ? (
          <div
            className={
              viewType === "card"
                ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }
          >
            {filteredOrganizations.map((org) => (
              <OrganizationCard key={org.orgId} {...org} viewType={viewType} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No organizations found.</p>
        )}
      </section>

      {showBackToTop && (
        <Button
          className="fixed bottom-4 right-4 rounded-full"
          variant={"outline"}
          onClick={handleBackToTop}
          size={"icon"}
        >
          <ArrowUp />
        </Button>
      )}
    </main>
  );
};

export default MemberOrganization;
