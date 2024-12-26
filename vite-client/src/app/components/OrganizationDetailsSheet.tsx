import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BadgeCheck,
  Globe,
  Send,
  Phone,
  MessageCircle,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import rc_credits from "../../assets/rc_credits.png";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getSocialPlatformIcon } from "@/constants/constants";
import { Skeleton } from "@/components/ui/skeleton";
import Blend from "../icons/Blend";
import HeartFill from "../icons/HeartFill";
interface OrganizationDetailsSheetProps {
  orgId: string;
  trigger: React.ReactNode;
}

const OrganizationDetailsSheet: React.FC<OrganizationDetailsSheetProps> = ({
  orgId,
  trigger,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orgDetails, setOrgDetails] = useState<any>(null);
  const [favorite, setFavorite] = useState(false);
  // Mocked API response
  const mockOrgResponse = {
    orgId: orgId,
    orgName: `Mock Organization ${orgId}`,
    description: `This is a mock description for organization ${orgId}.`,
    emailVerified: Number(orgId) % 2 === 1,
    type: Number(orgId) % 3 === 0 ? "INVITATION_ONLY" : "FREE_FOR_ALL",
    category: "Technology",
    logo: "",
    address: "123 Mock Street, Mock City",
    phoneNo: "123-456-7890",
    alternatePhoneNo: "098-765-4321",
    startDate: new Date(),
    socialLinks: [
      { platform: "Facebook", url: "https://facebook.com/mockorg" },
      { platform: "Twitter", url: "https://twitter.com/mockorg" },
      { platform: "Instagram", url: "https://instagram.com/mockorg" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/mockorg" },
    ],
    members: Array.from({ length: 8 }, (_, i) => ({
      memberId: i + 1,
      name: `Member ${i + 1}`,
      image:
        i % 2 === 0
          ? `https://via.placeholder.com/150?text=Member+${i + 1}`
          : "",
    })),
    events: Array.from({ length: 6 }, (_, i) => ({
      eventId: i + 1,
      title: `Event ${i + 1}`,
      image: `https://via.placeholder.com/150?text=Member+${i + 1}`,
    })),
    reputationCredits: 1500,
    isMember: Number(orgId) % 2 === 1,
    isFavorite: Number(orgId) % 3 === 0,
  };

  const fetchOrgDetails = async () => {
    try {
      setLoading(true);
      // Simulate a delay and then mock the response
      setTimeout(() => {
        setOrgDetails(mockOrgResponse); // Mock the API response
        setFavorite(mockOrgResponse.isFavorite);
        setLoading(false);
      }, 1000); // Simulate 1 second delay for API call
    } catch (error) {
      console.error("Failed to fetch organization details:", error);
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    setIsSheetOpen(true);
    await fetchOrgDetails();
  };

  const handleFavoriteToggle = (
    memberId: string,
    orgId: string,
    isFavorite: boolean
  ): void => {
    console.log(
      `Member Id ${memberId} Organization ${orgId} is now ${
        isFavorite ? "favorite" : "not favorite"
      }`
    );
  };
  const handleFavoriteClick = () => {
    const newFavoriteStatus = !favorite;
    setFavorite(newFavoriteStatus);
    handleFavoriteToggle("M1", orgId, newFavoriteStatus);
  };
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger onClick={() => handleOpen()}>{trigger}</SheetTrigger>
      <SheetContent className="w-full">
        <ScrollArea className="h-full pe-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ) : orgDetails ? (
            <SheetHeader className="relative">
              <Button
                variant={"secondary"}
                size={"icon"}
                onClick={handleFavoriteClick}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none rounded-full z-10 border"
              >
                {favorite ? <HeartFill /> : <Heart />}
              </Button>
              {/* Organization Details */}
              <Avatar className="rounded-md h-40 w-full">
                <AvatarImage src={orgDetails.logo} className="object-cover" />
                <AvatarFallback className="capitalize rounded-md">
                  {orgDetails.orgName[0]} {orgDetails.orgName[1]}
                </AvatarFallback>
              </Avatar>
              <SheetTitle className="flex gap-2 items-center">
                <span>{orgDetails.orgName}</span>
                {orgDetails.emailVerified && (
                  <BadgeCheck className="text-green-500 size-5" />
                )}
              </SheetTitle>
              <SheetDescription>{orgDetails.description}</SheetDescription>
              <SheetDescription>
                Since {new Date(orgDetails.startDate).toLocaleDateString()}
              </SheetDescription>
              <div className="flex gap-2 items-center">
                <Badge variant="outline">
                  {orgDetails.type === "FREE_FOR_ALL" ? (
                    <div className="flex gap-2 items-center">
                      <Globe className="size-3" />
                      <span>Free for All</span>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <Send className="size-3" />
                      <span>Invite Only</span>
                    </div>
                  )}
                </Badge>
                <Badge variant="outline">{orgDetails.category}</Badge>
              </div>
              <div className="flex gap-1 items-center">
                <Avatar className="size-7 border p-1">
                  <AvatarImage src={rc_credits} />
                </Avatar>
                <span>{orgDetails.reputationCredits}</span>
              </div>

              {/* Members Section */}
              <div className="mt-4">
                <Label>Members</Label>
                <div className="flex -space-x-4">
                  {orgDetails.members.slice(0, 5).map((member, i) => (
                    <Avatar className="size-10 border" key={member.name + i}>
                      <AvatarImage src={member.image} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  {orgDetails.members.length > 5 && (
                    <Avatar className="size-10">
                      <AvatarImage src={""} />
                      <AvatarFallback className="capitalize">
                        +{orgDetails.members.length - 5}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>

              {/* Events Section */}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <Label>Upcoming Events</Label>
                  <Button variant="link" className="mt-2">
                    View All Events
                  </Button>
                </div>
                <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                  <div className="flex gap-2 p-4">
                    {orgDetails.events.slice(0, 3).map((event) => (
                      <figure key={event.eventId} className="shrink-0">
                        <div className="overflow-hidden rounded-md">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="aspect-[3/4] h-fit w-fit object-cover"
                            width={300}
                            height={400}
                          />
                        </div>
                        <figcaption className="pt-2 text-xs font-semibold text-foreground">
                          {event.title}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>

              {/* Contact Info Section */}
              <div className="mt-4">
                <Label>Contact Information</Label>
                <div className="flex gap-4 items-center">
                  <Phone className="text-gray-600 size-4" />
                  <span>{orgDetails.phoneNo}</span>
                </div>
                <div className="flex gap-4 items-center">
                  <Phone className="text-gray-600 size-4" />
                  <span>{orgDetails.alternatePhoneNo}</span>
                </div>
              </div>

              {/* Social Links Section */}
              <Label>Social Media</Label>
              <div className="flex flex-wrap gap-2 items-center mt-4">
                {orgDetails.socialLinks.map((socialLink, index) => (
                  <Button
                    key={index}
                    variant={"secondary"}
                    className="rounded-full"
                    size={"icon"}
                    onClick={() => window.open(socialLink.url, "_blank")}
                  >
                    {getSocialPlatformIcon(socialLink.platform)}
                  </Button>
                ))}
              </div>

              {/* Address Section */}
              <div className="mt-4">
                <Label>Address</Label>
                <p>{orgDetails.address}</p>
              </div>

              {/* Membership Actions */}
              {orgDetails.isMember ? (
                <Button
                  variant={"secondary"}
                  className="flex gap-2 items-center bg-purple-600 hover:bg-purple-700 text-black"
                >
                  <MessageCircle />
                  <span>View Chat</span>
                </Button>
              ) : orgDetails.type === "INVITATION_ONLY" ? (
                <Button className="flex gap-2 items-center bg-orange-600 hover:bg-orange-700 text-black">
                  <Send />
                  <span>Join WaitList</span>
                </Button>
              ) : (
                <Button className="flex gap-2 items-center bg-green-600 hover:bg-green-700 text-black">
                  <Blend />
                  <span>Join</span>
                </Button>
              )}
            </SheetHeader>
          ) : (
            <p>No data available</p>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default OrganizationDetailsSheet;
