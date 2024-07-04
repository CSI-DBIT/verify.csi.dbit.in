import { toast } from "@/components/ui/use-toast";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";

interface CopyUniqueCodeComponentProps {
  uniqueCertificateCode: string;
}

const CopyUniqueCodeComponent: React.FC<CopyUniqueCodeComponentProps> = ({
  uniqueCertificateCode,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(uniqueCertificateCode);
    toast({
      title: `Copied: ${uniqueCertificateCode}`,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Change back after 2 seconds
  };

  return (
    <div className="flex justify-center items-center">
      {copied ? (
        <Check className="mr-2 h-4 w-4" />
      ) : (
        <Copy
          className="mr-2 h-4 w-4 hover:cursor-pointer"
          onClick={handleCopy}
        />
      )}
      <div>{uniqueCertificateCode}</div>
    </div>
  );
};

export default CopyUniqueCodeComponent;
