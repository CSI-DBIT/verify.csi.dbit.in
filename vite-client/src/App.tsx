import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MemberScreen from "./screens/MemberScreen";
import CertificateScreen from "./screens/CertificateScreen";
// import LoginScreen from "./screens/LoginScreen";
import CertificateUpload from "./screens/CertificateUpload";
import HomeScreen from "./screens/HomeScreen";
import PageNotFound from "./screens/PageNotFound";

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
      path: "/certificate",
      element: <CertificateScreen />,
    },
    {
      path: "/certificate-upload",
      element: <CertificateUpload />,
    },
  ]);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
