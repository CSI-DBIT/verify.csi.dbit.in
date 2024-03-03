import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MemberScreen from "./screens/MemberScreen";
import CertificateScreen from "./screens/CertificateScreen";
import LoginScreen from "./screens/LoginScreen";
import CertificateUpload from "./screens/CertificateUpload";
import HomeScreen from "./screens/HomeScreen";
import PageNotFound from "./screens/PageNotFound";
import ManageMember from "./screens/ManageMember";
import Temp from "./screens/Temp";
import CertificateAllocation from "./screens/CertificateAllocation";
import ManageEvent from "./screens/ManageEvent";
import EventDetails from "./screens/manage-events-components/EventDetails";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeScreen />,
      errorElement: <PageNotFound />,
    },
    {
      path: "/member/:studentId",
      element: <MemberScreen />,
    },
    {
      path: "/certificate/:uniqueCertificateCode",
      element: <CertificateScreen />,
    },
    {
      path: "/certificate-upload",
      element: <CertificateUpload />,
    },
    {
      path: "/login",
      element: <LoginScreen />,
    },
    {
      path: "/manage/members",
      element: <ManageMember />,
    },
    {
      path: "/certificate-allocation",
      element: <CertificateAllocation />,
    },
    {
      path: "/manage/events",
      element: <ManageEvent />,
    },
    {
      path: "/manage/events/:eventId",
      element: <EventDetails />,
    },
    {
      path: "temp",
      element: <Temp />,
    },
  ]);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
