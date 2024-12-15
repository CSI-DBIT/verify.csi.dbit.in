import { createBrowserRouter } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import PageNotFound from "./screens/PageNotFound";
import CertificateScreen from "./screens/CertificateScreen";
import EventDetails from "./screens/manage-events-components/EventDetails";
import ManageEvent from "./screens/ManageEvent";
import ManageMember from "./screens/ManageMember";
import MemberScreen from "./screens/MemberScreen";
import SignUpForm from "./screens/SignUpScreen";
import Dashboard from "./app/common/Dashboard";
import Events from "./app/common/Events";
import Organizations from "./app/common/Organizations";
import MemberOrganization from "./app/members/manage/MemberOrganization";
import MemberEvents from "./app/members/manage/MemberEvents";
import MemberCertificates from "./app/members/MemberCertificates";
import OrgMembers from "./app/organizations/manage/OrgMembers";
import OrgEvents from "./app/organizations/manage/events/OrgEvents";
import Settings from "./app/common/Settings";
import Layout from "./app/common/Layout";
import EventParticipants from "./app/organizations/manage/events/EventParticipants";
import EventForms from "./app/organizations/manage/events/EventForms";
import Members from "./app/common/Members";
import ProtectedRoute from "./app/components/ProtectedRoute";
import { TermsAndConditions } from "./app/pages/TermsAndCondition";

export const router = createBrowserRouter([
  {
    path: "",
    element: <HomeScreen />,
    errorElement: <PageNotFound />,
  },
  {
    path: "member/verify/:studentId",
    element: <MemberScreen />,
  },
  {
    path: "certificate/validate/:uniqueCertificateCode",
    element: <CertificateScreen />,
  },
  {
    path: "signUp",
    element: <SignUpForm />,
  },
  {
    path: "terms-and-conditions",
    element: <TermsAndConditions />,
  },
  {
    path: "manage/members",
    element: <ManageMember />,
  },
  {
    path: "manage/events",
    element: <ManageEvent />,
  },
  {
    path: "manage/events/:eventId",
    element: <EventDetails />,
  },
  {
    path: "dashboard",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "organizations",
        element: <Organizations />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "members",
        element: <Members />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "notifications",
        element: <Settings />,
      },
      {
        path: "member/organizations",
        element: <MemberOrganization />,
      },
      {
        path: "member/events",
        element: <MemberEvents />,
      },
      {
        path: "member/certificates",
        element: <MemberCertificates />,
      },
      {
        path: "organization/members",
        element: <OrgMembers />,
      },
      {
        path: "organization/events",
        element: <OrgEvents />,
      },
      {
        path: "organization/events/participants",
        element: <EventParticipants />,
      },
      {
        path: "organization/events/forms",
        element: <EventForms />,
      },
    ],
  },
]);
