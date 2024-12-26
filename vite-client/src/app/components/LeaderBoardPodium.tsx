import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OrganizationDetailsSheet from "./OrganizationDetailsSheet";
import rc_credits from "../../assets/rc_credits.png";
const LeaderBoardPodium = ({ organizations }: { organizations: any[] }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-end justify-center space-x-4">
        {/* 2nd Place */}
        {organizations[1] && (
          <div className="flex flex-col items-center space-y-2">
            <OrganizationDetailsSheet
              orgId={organizations[1].orgId}
              trigger={
                <Avatar className="size-16 border-4 border-gray-600">
                  <AvatarImage
                    src={organizations[1].logo}
                    className="object-cover"
                  />
                  <AvatarFallback className="capitalize">
                    {organizations[1].orgName[0]} {organizations[1].orgName[1]}
                  </AvatarFallback>
                </Avatar>
              }
            />

            <span className="text-sm font-medium">
              {organizations[1].orgName}
            </span>
            <div className="bg-gray-600 w-20 h-16 rounded-t-lg flex flex-col items-center justify-center text-black">
              <span className="text-sm font-bold">2nd</span>
              <div className="flex gap-1 items-center">
                <Avatar className="size-5 border p-1 bg-secondary">
                  <AvatarImage src={rc_credits} />
                </Avatar>
                <span className="text-xs font-bold">
                  {organizations[1].rcCredits}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {organizations[0] && (
          <div className="flex flex-col items-center space-y-2">
            <OrganizationDetailsSheet
              orgId={organizations[0].orgId}
              trigger={
                <Avatar className="size-24 border-4 border-yellow-600">
                  <AvatarImage
                    src={organizations[0].logo}
                    className="object-cover"
                  />
                  <AvatarFallback className="capitalize">
                    {organizations[0].orgName[0]} {organizations[0].orgName[1]}
                  </AvatarFallback>
                </Avatar>
              }
            />
            <span className="text-sm font-medium">
              {organizations[0].orgName}
            </span>
            <div className="bg-yellow-600 w-24 h-24 rounded-t-lg flex flex-col items-center justify-center text-black">
              <span className="text-sm font-bold">1st</span>
              <div className="flex gap-1 items-center">
                <Avatar className="size-5 border p-1 bg-secondary">
                  <AvatarImage src={rc_credits} />
                </Avatar>
                <span className="text-xs font-bold">
                  {organizations[0].rcCredits}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {organizations[2] && (
          <div className="flex flex-col items-center space-y-2">
            <OrganizationDetailsSheet
              orgId={organizations[2].orgId}
              trigger={
                <Avatar className="size-16 border-4 border-emerald-600">
                  <AvatarImage
                    src={organizations[2].logo}
                    className="object-cover  size-full"
                  />
                  <AvatarFallback className="capitalize">
                    {organizations[2].orgName[0]} {organizations[2].orgName[1]}
                  </AvatarFallback>
                </Avatar>
              }
            />
            <span className="text-sm font-medium">
              {organizations[2].orgName}
            </span>
            <div className="bg-emerald-600 w-20 h-12 rounded-t-lg flex flex-col items-center justify-center text-black">
              <span className="text-sm font-bold">3rd</span>
              <div className="flex gap-1 items-center">
                <Avatar className="size-5 border p-1 bg-secondary">
                  <AvatarImage src={rc_credits} />
                </Avatar>
                <span className="text-xs font-bold">
                  {organizations[2].rcCredits}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderBoardPodium;
