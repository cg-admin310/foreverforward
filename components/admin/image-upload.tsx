"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadEventImage } from "@/lib/actions/uploads";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  label?: string;
  description?: string;
}

export function ImageUpload({
  value,
  onChange,
  onClear,
  label = "Featured Image",
  description = "Upload an image for this event",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const result = await uploadEventImage(base64, file.name, file.type);

        if (result.success && result.url) {
          onChange(result.url);
        } else {
          setError(result.error || "Upload failed");
        }
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError("Failed to read file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Upload failed");
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClear = () => {
    onChange("");
    onClear?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#555555]">{label}</label>

      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#DDDDDD] bg-[#F5F5F5]">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-1" />
              Replace
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`
            relative w-full aspect-video rounded-lg border-2 border-dashed
            transition-colors cursor-pointer
            ${dragOver ? "border-[#C9A84C] bg-[#FBF6E9]" : "border-[#DDDDDD] hover:border-[#C9A84C]"}
            ${isUploading ? "pointer-events-none opacity-60" : ""}
          `}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-[#C9A84C] animate-spin" />
                <span className="text-sm text-[#888888]">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-[#888888]" />
                <span className="text-sm text-[#555555] font-medium">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-[#888888]">
                  PNG, JPG, WebP up to 5MB
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-[#888888]">{description}</p>
    </div>
  );
}
