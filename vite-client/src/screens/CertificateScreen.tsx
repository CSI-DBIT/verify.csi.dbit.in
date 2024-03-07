// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { Toaster } from "@/components/ui/toaster";
// import { EligibleCandidatesSchema } from "@/validationSchemas/EligibleCadidatesSchema";
// import { EventSchema } from "@/validationSchemas/EventSchema";
// import { pdfjs, Document, Page } from "react-pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();

// const CertificateScreen = () => {
//   const { uniqueCertificateCode } = useParams();
//   const [certificateDetails, setCertificateDetails] =
//     useState<EligibleCandidatesSchema>();
//   const [eventDetails, setEventDetails] = useState<EventSchema>();
//   const [pdfUrl, setPdfUrl] = useState("");

//   useEffect(() => {
//     const fetchCertificateDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${
//             import.meta.env.VITE_SERVER_URL
//           }/api/get/certificate?uniqueCertificateCode=${uniqueCertificateCode}`
//         );

//         if (response.status === 200) {
//           setCertificateDetails(response.data.certificateDetails);
//           setEventDetails(response.data.eventDetails);
//           setPdfUrl(
//             `${import.meta.env.VITE_SERVER_URL}/${
//               response.data.certificateDetails.uniqueCertificateUrl
//             }`
//           );
//         } else {
//           console.error("Failed to fetch certificate details");
//         }
//       } catch (error) {
//         console.error("Error fetching certificate details", error);
//       }
//     };

//     fetchCertificateDetails();
//   }, [pdfUrl, uniqueCertificateCode]);

//   const formatDate = (dateString: string | number | Date) => {
//     const date = new Date(dateString);

//     // Check if date is valid
//     if (!(date instanceof Date)) {
//       console.error("Invalid date:", dateString);
//       return "Invalid Date";
//     }

//     // Format date in local format
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };
//   console.log(certificateDetails);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <div className="p-4 flex flex-grow flex-col gap-2">
//         {certificateDetails && eventDetails ? (
//           <div className="flex flex-col justify-center items-center">
//             <Document
//               file={pdfUrl}
//               className={"flex justify-center items-center"}
//             >
//               <Page
//                 pageNumber={1}
//                 renderAnnotationLayer={false}
//                 renderTextLayer={false}
//               />
//             </Document>
//             <p className="w-1/2">
//               This certificate above verifies that {certificateDetails.name}{" "}
//               successfully completed the {eventDetails.name} event on the date{" "}
//               {formatDate(eventDetails.startDate)}. This certificate indicates
//               that the entire {eventDetails.name} event was completed by the
//               student.
//             </p>
//           </div>
//         ) : certificateDetails === undefined && eventDetails === undefined ? (
//           <p>Not a valid certificate code</p>
//         ) : (
//           <p>Loading certificate details...</p>
//         )}
//       </div>
//       <Footer />
//       <Toaster />
//     </div>
//   );
// };

// export default CertificateScreen;
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { EligibleCandidatesSchema } from "@/validationSchemas/EligibleCadidatesSchema";
import { EventSchema } from "@/validationSchemas/EventSchema";
import { pdfjs, Document, Page } from "react-pdf";
import { CertificateScreenSkeleton } from "@/components/CertificateScreenSkeleton";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const CertificateScreen = () => {
  const { uniqueCertificateCode } = useParams();
  const [certificateDetails, setCertificateDetails] =
    useState<EligibleCandidatesSchema>();
  const [eventDetails, setEventDetails] = useState<EventSchema>();
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificateDetails = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/get/certificate?uniqueCertificateCode=${uniqueCertificateCode}`
        );

        if (response.status === 200) {
          setCertificateDetails(response.data.certificateDetails);
          setEventDetails(response.data.eventDetails);
          setPdfUrl(
            `${import.meta.env.VITE_SERVER_URL}/${
              response.data.certificateDetails.uniqueCertificateUrl
            }`
          );
        } else {
          console.error("Failed to fetch certificate details");
        }
      } catch (error) {
        console.error("Error fetching certificate details", error);
      } finally {
        // Set loading to false after fetching, introduce a delay for 0.5 seconds
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchCertificateDetails();
  }, [pdfUrl, uniqueCertificateCode]);

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);

    // Check if date is valid
    if (!(date instanceof Date)) {
      console.error("Invalid date:", dateString);
      return "Invalid Date";
    }

    // Format date in local format
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-4 flex flex-grow flex-col justify-center items-center gap-2">
        {loading ? (
          <CertificateScreenSkeleton />
        ) : certificateDetails && eventDetails ? (
          <div className="flex flex-col justify-center items-center">
            <Document
              file={pdfUrl}
              className={"flex justify-center items-center"}
            >
              <Page
                pageNumber={1}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>
            <p className="max-w-2xl mx-auto text-lg text-center">
              <span className="font-bold">
                This certificate verifies that {certificateDetails.name}{" "}
                successfully completed
              </span>{" "}
              the{" "}
              <span className="font-bold text-blue-600 capitalize">
                {eventDetails.name}
              </span>{" "}
              event on{" "}
              <span className="font-bold">
                {formatDate(eventDetails.startDate)}
              </span>
              . This certificate indicates that the entire{" "}
              <span className="font-bold text-blue-600 capitalize">
                {eventDetails.name}
              </span>{" "}
              event was completed by the student.
            </p>
          </div>
        ) : (
          <div className="text-center flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-lg">Invalid Certificate Code</p>
          </div>
        )}
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default CertificateScreen;
