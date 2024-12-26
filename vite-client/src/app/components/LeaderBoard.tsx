import { Card } from "@/components/ui/card";
import LeaderBoardPodium from "./LeaderBoardPodium";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import rc_credits from "../../assets/rc_credits.png";
const LeaderBoard = ({ organizations }: { organizations: any[] }) => {
  const topOrganizations = organizations.slice(0, 3);
  const remainingOrganizations = organizations.slice(3);

  return (
    <div className="px-10 py-4">
      <h2 className="text-lg font-semibold">Top Organizations</h2>
      <section className="lg:flex items-center gap-4">
        {/* Podium Section */}
        <Card className="p-4">
          <LeaderBoardPodium organizations={topOrganizations} />
        </Card>

        {/* Remaining Organizations */}
        {remainingOrganizations.length > 0 && (
          <Card className="p-4 w-full lg:w-64 overflow-y-auto mt-4 lg:mt-0 flex-grow">
            <ul className="space-y-2">
              {remainingOrganizations.map((org, index) => (
                <li
                  key={org.orgId}
                  className="flex items-center gap-4 rounded-lg p-2"
                >
                  {/* Rank */}
                  <div className="text-lg font-semibold text-gray-700 w-6 text-center">
                    {index + 4} {/* Adjust rank starting from 4 */}
                  </div>
                  {/* Organization Logo and Details */}
                  <img
                    src={org.logo || "https://via.placeholder.com/64"}
                    alt={org.orgName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{org.orgName}</span>
                    <div className="flex gap-1 items-center">
                      <Avatar className="size-5 border p-1 bg-secondary">
                        <AvatarImage src={rc_credits} />
                      </Avatar>
                      <span className="text-xs font-bold">
                        {organizations[1].rcCredits}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>
    </div>
  );
};

export default LeaderBoard;
