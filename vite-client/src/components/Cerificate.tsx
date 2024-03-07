import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface CertificateData {
  title: string;
}

interface CertificateProps {
  data: CertificateData;
}

const Certificate: React.FC<CertificateProps> = ({ data }) => {
  const handlePreview = () => {
    console.log('Previewing certificate:', data.title);
  };

  const handleDownload = () => {
    console.log('Downloading certificate:', data.title);
  };

  return (
    <Card className="lg:flex justify-between items-center p-4 border-b">
      <div>
        <h2 className=" font-bold">{data.title}</h2>
      </div>
      <div className="flex items-center lg:space-x-2">
        <Button onClick={handlePreview} variant="outline">
          Preview
        </Button>
        <Button onClick={handleDownload} variant="outline">
          Download
        </Button>
      </div>
    </Card>
  );
};

export default Certificate;
