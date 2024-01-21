import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const PageNotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-grow items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-lg">The requested page could not be found.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PageNotFound;
