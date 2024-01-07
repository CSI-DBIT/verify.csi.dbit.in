import verify_csi_logo from "../assets/geometrical-shape.png";

const Navbar = () => {
  return (
      <div className="flex justify-center items-center space-x-4 p-2">
        <img src={verify_csi_logo} alt="verify csi logo" />
        <span className="text-2xl font-bold">/ verify@csi </span>
      </div>
  );
};

export default Navbar;
