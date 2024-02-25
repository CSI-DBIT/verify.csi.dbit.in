import verifyLogoDark from "@/assets/verify.dev_dark_name_logo.png";
import verifyLogoLight from "@/assets/verify.dev_light_name_logo.png";
import { useTheme } from "./theme-provider";
const Footer = () => {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? verifyLogoLight : verifyLogoDark;
  return (
    <footer className="text-white p-4">
      <div className="container">
        <p className="flex items-center justify-center gap-2">
          <span>&copy; 2024</span>{" "}
          <span>
            <img className="w-28" src={logoSrc} alt="verify csi logo" />
          </span>{" "}
          <span>All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
