import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ secure: true }); // reads CLOUDINARY_URL from the environment

const PRESETS = {
  avatar: {
    id: (userId) => `vellum/avatars/${userId}`,
    transformation: [{ width: 512, height: 512, crop: "fill", gravity: "auto" }],
  },
  banner: {
    id: (userId) => `vellum/banners/${userId}`,
    transformation: [{ width: 1600, crop: "limit" }],
  },
};

// One file per user per kind: uploading again replaces the old one
export const uploadImage = (kind, userId, buffer) =>
  new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_URL) {
      return reject(new Error("Image storage is not configured"));
    }
    const preset = PRESETS[kind];
    cloudinary.uploader
      .upload_stream(
        {
          public_id: preset.id(userId),
          overwrite: true,
          invalidate: true,
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
          transformation: preset.transformation,
        },
        (err, result) => (err ? reject(err) : resolve(result)),
      )
      .end(buffer);
  });

// Used when an account is deleted
export const deleteUserImages = async (userId) => {
  if (!process.env.CLOUDINARY_URL) return;
  await Promise.allSettled(
    Object.values(PRESETS).map((p) =>
      cloudinary.uploader.destroy(p.id(userId), { invalidate: true }),
    ),
  );
};