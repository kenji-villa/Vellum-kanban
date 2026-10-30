import React, { useRef, useState } from "react";
import { useToast } from "../../context/ToastContext";

const MAX_WIDTH = 1600;
const JPEG_QUALITY = 0.8;

/**
 * Compress an image file and return a base64 data URL.
 */
const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const BannerUploader = ({ banner, onUpload, onRemove }) => {
  const fileRef = useRef(null);
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8MB");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await compressImage(file);
      onUpload(dataUrl);
      toast.success("Banner updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to process image");
    } finally {
      setBusy(false);
    }
  };

  const handleChange = (e) => {
    handleFile(e.target.files?.[0]);
    e.target.value = "";
  };

  // When a banner exists, show it with hover controls
  if (banner) {
    return (
      <div className="relative group">
        <img
          src={banner}
          alt="Profile banner"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="bg-white/95 hover:bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {busy ? "Processing…" : "Change banner"}
          </button>
          <button
            onClick={onRemove}
            disabled={busy}
            className="bg-white/95 hover:bg-white text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
          >
            Remove
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    );
  }

  // Empty state: show upload prompt
  return (
    <div
      onClick={() => !busy && fileRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files?.[0]);
      }}
      className="relative w-full h-48 cursor-pointer bg-gradient-to-br from-[#1e2757] via-[#2a3572] to-[#1e2757] flex flex-col items-center justify-center text-center group"
    >
      {/* Grid pattern for texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 px-4">
        <div className="w-10 h-10 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-5 h-5 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-white">
          {busy ? "Processing…" : "Upload your banner"}
        </p>
        <p className="text-[11px] text-white/60 mt-1">
          Recommended size: 1020 × 520 px
        </p>
        <p className="text-[10px] text-white/40 mt-0.5">
          JPG or PNG · max 8MB · auto-resized to fit
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default BannerUploader;
