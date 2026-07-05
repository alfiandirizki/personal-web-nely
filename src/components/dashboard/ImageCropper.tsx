"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";

interface ImageCropperProps {
  imageSrc: string;
  onCropDone: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropper({
  imageSrc,
  onCropDone,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    if (croppedBlob) {
      onCropDone(croppedBlob);
    }
    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col">
      {/* Crop area */}
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* Controls */}
      <div className="bg-background border-t-2 border-neo-border p-4 sm:p-6 space-y-4">
        {/* Zoom slider */}
        <div className="flex items-center gap-4 max-w-sm mx-auto">
          <span className="text-xs font-bold shrink-0">🔍</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-neo-green"
          />
          <span className="text-xs font-bold w-8 text-right">{zoom.toFixed(1)}x</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="neo-btn bg-surface px-6 py-2.5 text-sm"
          >
            ← Batal
          </button>
          <button
            onClick={handleDone}
            disabled={processing}
            className="neo-btn bg-neo-green px-6 py-2.5 text-sm disabled:opacity-50"
          >
            {processing ? "⏳ Processing..." : "✅ Crop & Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper: crop image using canvas
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Output 500x500 for good quality
  const size = 500;
  canvas.width = size;
  canvas.height = size;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      "image/jpeg",
      0.9
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}
