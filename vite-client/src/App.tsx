import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import ErrorScreen from "./screens/ErrorScreen";
import HomeScreen from "./screens/HomeScreen";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MemberScreen from "./screens/MemberScreen";
import CertificateScreen from "./screens/CertificateScreen";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MemberScreen />,
      errorElement: <ErrorScreen />,
    },
    {
      path: "/member",
      element: <MemberScreen />,
    },
    {
      path: "/certificate",
      element: <CertificateScreen />,
    },
  ]);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
