import verifyLogoLight from "@/assets/verify.dev_light_name_logo.png";
const Footer = () => {
  return (
    <footer className="text-white px-4">
      <div className="container">
        <p className="lg:flex items-center justify-center gap-2">
          <img className="w-28" src={verifyLogoLight} alt="verify csi logo" />
          <span>&copy; 2024 All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
