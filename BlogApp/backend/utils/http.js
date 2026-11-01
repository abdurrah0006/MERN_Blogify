import fs from "fs";
import path from "path";

// Throw from any controller; the error middleware turns it into a JSON response.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const readingTime = (text = "") =>
  Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));

// "travel, Food ,, food" -> ["travel", "food"]  (max 5)
export const parseTags = (raw) => {
  const list = Array.isArray(raw) ? raw : String(raw ?? "").split(",");
  const clean = list.map((t) => t.trim().toLowerCase().slice(0, 24)).filter(Boolean);
  return [...new Set(clean)].slice(0, 5);
};

export const removeUpload = (imagePath) => {
  if (!imagePath?.startsWith("/uploads/")) return;
  fs.promises.unlink(path.join(process.cwd(), imagePath)).catch(() => {});
};
