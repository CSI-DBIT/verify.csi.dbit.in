import verify_csi_logo from "../assets/geometrical-shape.png";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <Link to="/" className="flex justify-center items-center space-x-4">
      <img src={verify_csi_logo} alt="verify csi logo" />
      <span className="text-2xl font-bold">/ verify@csi </span>
    </Link>
  );
};

export default Navbar;
