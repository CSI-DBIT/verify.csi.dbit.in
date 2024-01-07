import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import HomeScreen from "./screens/HomeScreen";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HomeScreen />
    </ThemeProvider>
  );
}

export default App;
