const API_ROOT = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(
  /\/api\/?$/,
  "",
);

// Cloudinary gives full https links. Older local paths like /uploads/... are prefixed with the API address.
export const assetUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ROOT}${path}`;
};