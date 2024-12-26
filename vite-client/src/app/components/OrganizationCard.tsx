import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BadgeCheck,
  Globe,
  Heart,
  Maximize2,
  MessageCircle,
  Send,
} from "lucide-react";
import OrganizationDetailsSheet from "./OrganizationDetailsSheet"; // Import the reusable sheet
import rc_credits from "../../assets/rc_credits.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Blend from "../icons/Blend";
import { useState } from "react";
import HeartFill from "../icons/HeartFill";

interface OrganizationCardProps {
  orgId: string;
  orgName: string;
  description: string;
  emailVerified: boolean;
  type: string;
  category: string;
  reputationCredits: number;
  logo: string;
  members: { memberId: string; name: string; image: string }[];
  isMember: boolean;
  isFavorite: boolean;
  onFavoriteToggle: (orgId: string, isFavorite: boolean) => void;
  viewType?: "list" | "card";
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  orgId,
  orgName,
  description,
  emailVerified,
  type,
  category,
  reputationCredits,
  logo,
  members,
  isMember,
  isFavorite,
  onFavoriteToggle,
  viewType,
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const handleFavoriteClick = () => {
    const newFavoriteStatus = !favorite;
    setFavorite(newFavoriteStatus);
    onFavoriteToggle(orgId, newFavoriteStatus); // Notify parent component
  };
  return (
    <div>
      {viewType === "card" ? (
        <Card className="flex flex-col gap-2 relative">
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none rounded-full z-10 border"
          >
            {favorite ? <HeartFill /> : <Heart />}
          </Button>
          <div className="p-2">
            <Avatar className="rounded-md h-40 w-full">
              <AvatarImage src={logo} className="object-cover" />
              <AvatarFallback className="capitalize rounded-md">
                {orgName[0]} {orgName[1]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="px-2 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <Badge variant="outline">
                {type === "FREE_FOR_ALL" ? (
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
              <Badge variant="outline">{category}</Badge>
            </div>

            <OrganizationDetailsSheet
              orgId={orgId}
              trigger={
                <Button
                  variant={"secondary"}
                  className="rounded-full"
                  size={"icon"}
                >
                  <Maximize2 />
                </Button>
              }
            />
          </div>
          <div className="px-4">
            <CardTitle className="truncate flex items-center gap-2">
              <span>{orgName}</span>
              {emailVerified && (
                <BadgeCheck className="text-green-500 size-5" />
              )}
            </CardTitle>
            <CardDescription className="line-clamp-1">
              {description}
            </CardDescription>
          </div>
          <div className="flex justify-between items-center px-4">
            <div className="flex gap-1 items-center">
              <Avatar className="size-7 border p-1">
                <AvatarImage src={rc_credits} />
              </Avatar>
              <span>{reputationCredits}</span>
            </div>
            <div className="flex -space-x-4 items-center rtl:space-x-reverse">
              {members.slice(0, 3).map((member) => (
                <Avatar className="size-7" key={member.memberId}>
                  <AvatarImage src={member.image} />
                  <AvatarFallback className="capitalize">
                    {member.name[0]}
                  </AvatarFallback>
                </Avatar>
              ))}
              {members.length > 3 && (
                <Avatar className="size-7">
                  <AvatarImage src={""} />
                  <AvatarFallback className="capitalize">
                    +{members.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
          <div className="p-4">
            {isMember ? (
              <Button
                variant={"secondary"}
                className="flex gap-2 items-center bg-purple-600 hover:bg-purple-700 text-black w-full"
              >
                <MessageCircle />
                <span>View Chat</span>
              </Button>
            ) : type === "INVITATION_ONLY" ? (
              <Button className="flex gap-2 items-center bg-orange-600 hover:bg-orange-700 text-black w-full">
                <Send />
                <span>Join WaitList</span>
              </Button>
            ) : (
              <Button className="flex gap-2 items-center bg-green-600 hover:bg-green-700 w-full text-black">
                <Blend /> <span>Join</span>
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Card className="lg:flex gap-2 items-center p-4">
          <Avatar className="lg:size-20">
            <AvatarImage src={logo} />
            <AvatarFallback className="capitalize">{`${orgName[0]} ${orgName[1]}`}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 flex-grow">
            <div className="lg:flex items-center gap-2">
              <CardTitle className="truncate flex items-center gap-2">
                {orgName}
                {emailVerified && (
                  <BadgeCheck className="text-green-500 size-5" />
                )}
              </CardTitle>
              <Badge variant="outline">
                {type === "FREE_FOR_ALL" ? (
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
            </div>
            <CardDescription className="line-clamp-1">
              {description}
            </CardDescription>
            <div className="flex gap-2">
              <Badge variant="outline">{category}</Badge>
              <div className="flex gap-1 items-center">
                <Avatar className="size-7 border p-1">
                  <AvatarImage src={rc_credits} />
                </Avatar>
                <span>{reputationCredits}</span>
              </div>
              <div className="flex -space-x-4">
                {members.slice(0, 3).map((member) => (
                  <Avatar className="size-7" key={member.memberId}>
                    <AvatarImage src={member.image} />
                    <AvatarFallback className="capitalize">
                      {member.name[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {members.length > 3 && (
                  <Avatar className="size-7">
                    <AvatarImage src={""} />
                    <AvatarFallback className="capitalize">
                      +{members.length - 3}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {isMember ? (
              <Button
                variant={"secondary"}
                className="flex gap-2 items-center bg-purple-600 hover:bg-purple-700 text-black"
              >
                <MessageCircle />
                <span>View Chat</span>
              </Button>
            ) : type === "INVITATION_ONLY" ? (
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
            <OrganizationDetailsSheet
              orgId={orgId}
              trigger={
                <Button
                  variant={"secondary"}
                  className="rounded-full"
                  size={"icon"}
                >
                  <Maximize2 />
                </Button>
              }
            />
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={handleFavoriteClick}
              className=" text-red-500 hover:text-red-700 focus:outline-none rounded-full z-10 bg-transparent"
            >
              {favorite ? <HeartFill /> : <Heart />}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrganizationCard;
