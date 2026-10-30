import React, { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Modal from "../UI/Modal";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";
import getCroppedImg from "../../utils/cropImage";

const AvatarUploader = ({ size = "large" }) => {
  const fileRef = useRef(null);
  const toast = useToast();
  const { user, updateUser } = useAuth();

  const [busy, setBusy] = useState(false);
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

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8MB");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => setImageSrc(reader.result));
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!croppedAreaPixels) return;
    setBusy(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      const { avatarUrl } = await api.uploadAvatar(file);
      updateUser({ avatarUrl });
      toast.success("Profile picture updated");
      setImageSrc(null);
    } catch (err) {
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setBusy(false);
    }
  };

  const initials = (user?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const API_BASE =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:4000";
  const avatarUrl = user?.avatarUrl ? `${API_BASE}${user.avatarUrl}` : null;

  // Size variants — large (profile page) vs small (header)
  const dimensions = {
    large: "w-28 h-28 text-3xl",
    small: "w-9 h-9 text-xs",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className={`relative rounded-full bg-orange-500 border-4 border-white dark:border-slate-800 flex items-center justify-center text-white font-bold shadow-xl shrink-0 overflow-hidden group ${dimensions[size]}`}
        title="Change profile picture"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={user?.name || "Avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          initials
        )}

        {/* Hover overlay */}
        <span
          className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
            size === "small" ? "rounded-full" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={size === "small" ? "w-3 h-3" : "w-6 h-6"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
            />
          </svg>
        </span>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Crop Modal */}
      {imageSrc && (
        <Modal
          isOpen={true}
          onClose={() => setImageSrc(null)}
          title="Crop profile picture"
        >
          <div className="relative w-full h-[320px] bg-gray-900 rounded-lg overflow-hidden mb-4">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
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
              onClick={handleUpload}
              disabled={busy}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
            >
              {busy ? "Uploading..." : "Save Picture"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AvatarUploader;
