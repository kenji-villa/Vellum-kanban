import React, { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";
import getCroppedImg from "../../utils/cropImage";
import Modal from "../UI/Modal";

const BannerUploader = () => {
  const fileRef = useRef(null);
  const toast = useToast();
  const { user, updateUser } = useAuth();

  const [busy, setBusy] = useState(false);

  // Cropper state
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8MB");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => setImageSrc(reader.result));
    reader.readAsDataURL(file);
    e.target.value = ""; // reset
  };

  const handleUploadCropped = async () => {
    if (!croppedAreaPixels) return;
    setBusy(true);
    try {
      // 1. Get cropped Blob
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);

      // 2. Create a File from Blob
      const file = new File([blob], "banner.jpg", { type: "image/jpeg" });

      // 3. Upload to API
      const { bannerUrl } = await api.uploadBanner(file);

      // 4. Update local user state
      updateUser({ bannerUrl });

      toast.success("Banner updated");
      setImageSrc(null);
    } catch (err) {
      toast.error(err.message || "Failed to upload banner");
    } finally {
      setBusy(false);
    }
  };

  const API_BASE =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:4000";
  const bannerUrl = user?.bannerUrl ? `${API_BASE}${user.bannerUrl}` : null;

  return (
    <>
      {bannerUrl ? (
        <div className="relative group">
          <img
            src={bannerUrl}
            alt="Banner"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => fileRef.current?.click()}
              className="bg-white/95 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg"
            >
              Change banner
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="relative w-full h-48 cursor-pointer bg-gradient-to-br from-[#1e2757] to-[#2a3572] flex flex-col items-center justify-center text-center group"
        >
          <div className="relative z-10">
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
            <p className="text-sm font-medium text-white">Upload your banner</p>
            <p className="text-[11px] text-white/60 mt-1">
              Recommended size: 1020 × 520 px
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Cropper Modal */}
      {imageSrc && (
        <Modal
          isOpen={true}
          onClose={() => setImageSrc(null)}
          title="Crop Banner"
        >
          <div className="relative w-full h-[300px] bg-gray-900 rounded-lg overflow-hidden mb-4">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1020 / 520} // LinkedIn-style aspect ratio
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Zoom
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setImageSrc(null)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadCropped}
              disabled={busy}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
            >
              {busy ? "Uploading..." : "Save Banner"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default BannerUploader;
