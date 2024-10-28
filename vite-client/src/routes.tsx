import { createBrowserRouter } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import PageNotFound from "./screens/PageNotFound";
import CertificateAllocation from "./screens/CertificateAllocation";
import CertificateScreen from "./screens/CertificateScreen";
import CertificateUpload from "./screens/CertificateUpload";
import { Dashboard } from "./screens/DashBoard";
import EventDetails from "./screens/manage-events-components/EventDetails";
import ManageEvent from "./screens/ManageEvent";
import ManageMember from "./screens/ManageMember";
import MemberScreen from "./screens/MemberScreen";
import SignUpForm from "./screens/SignUpScreen";
import Temp from "./screens/Temp";
import Settings from "./screens/SettingsScreen";
import Home from "./screens/DashboardHome";
import Page from "./app/dashboard/page";

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
    path: "certificate-upload",
    element: <CertificateUpload />,
  },
  {
    path: "signUp",
    element: <SignUpForm />,
  },
  {
    path: "manage/members",
    element: <ManageMember />,
  },
  {
    path: "certificate-allocation",
    element: <CertificateAllocation />,
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
    path: "sidebar",
    element: <Page />,
  },
  {
    path: "temp",
    element: <Temp />,
    children: [
      {
        path: "events",
        element: <ManageEvent />,
      },
      {
        path: "members",
        element: <ManageMember />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "events",
        element: <ManageEvent />,
      },
      {
        path: "members",
        element: <ManageMember />,
      },
      {
        path: "settings",
        element: (
          <Settings/>
        ),
      },
    ],
  },
]);
