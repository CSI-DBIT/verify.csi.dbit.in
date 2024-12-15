import { canvasPreview } from "@/utils/canvasPreview";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
} from "react-image-crop";
const MIN_DIMENSION = 150;
const ASPECT_RATIO = 1;
const ImageCropper = () => {
  const [crop, setCrop] = useState<Crop>(); // Square crop
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string>(
    "http://localhost:4000/public/images/profile-pics/verifydev-default-member-profile.jpg"
  );
  const [error, setError] = useState("");
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageElement = new Image();
        imageElement.src = reader.result as string;
        imageElement.onload = (e: any) => {
          if (error) setError("");
          const { naturalWidth, naturalHeight } = e.currentTarget;
          if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
            setError("Image must be atLeast 150 x 150 px");
            return setSelectedImage("");
          }
        };
        setSelectedImage(reader.result as string);
        setIsCropModalOpen(true); // Open modal after selecting an image
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });
  const onImageLoad = (e: any) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercentage = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercentage,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };
  const imageRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Handle crop completion
  const handleCropComplete = () => {
    if (imageRef.current && previewCanvasRef.current) {
      canvasPreview(
        imageRef.current,
        previewCanvasRef.current,
        convertToPixelCrop(
          crop,
          imageRef.current.width,
          imageRef.current.height
        )
      );
    }

    setCroppedImage(selectedImage); // Simulate saving cropped image
    console.log("cropped image", selectedImage);
    closeCropModal(); // Close modal
  };
  const closeCropModal = () => {
    setIsCropModalOpen(false); // Close modal
    setSelectedImage(""); // Reset selected image
    setCrop(undefined); // Reset crop
  };
  return <div>ImageCropper</div>;
};

export default ImageCropper;
