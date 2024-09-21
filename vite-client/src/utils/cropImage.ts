// utils/cropImage.ts

export interface PixelCrop {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export default function getCroppedImg(
    imageSrc: string,
    pixelCrop: PixelCrop
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
  
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }
  
        // Set the canvas size to the desired crop size
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
  
        // Draw the cropped area of the image onto the canvas
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
  
        // Convert the canvas to a data URL
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          const fileUrl = URL.createObjectURL(blob);
          resolve(fileUrl);
        }, "image/jpeg");
      };
  
      image.onerror = (error) => reject(error);
    });
  }
  