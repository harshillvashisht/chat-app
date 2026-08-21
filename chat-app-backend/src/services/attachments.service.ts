import { s3 } from "../lib/s3Client";
import { ApiError } from "../utils/ApiError";
import { randomUUID } from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_DOCUMENT_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
];

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "audio/mpeg": "mp3",
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/zip": "zip",
};

const generatePresignedUrl = async (fileName: string, mimeType: string, fileSize: number) => {
  if (!fileName || typeof fileName !== "string") {
    throw new ApiError(400, "fileName is required");
  }
  if (!mimeType || typeof mimeType !== "string") {
    throw new ApiError(400, "mimeType is required");
  }
  if (typeof fileSize !== "number" || fileSize <= 0) {
    throw new ApiError(400, "fileSize must be a positive number");
  }

  if (fileSize > 20 * 1024 * 1024) {
    throw new ApiError(400, "File size exceeds the maximum limit of 20MB");
  }

  const isImage = mimeType.startsWith("image/");
  const isAudio = mimeType.startsWith("audio/");
  const isDocument = ALLOWED_DOCUMENT_MIMES.includes(mimeType);

  if (!isImage && !isAudio && !isDocument) {
    throw new ApiError(400, "Invalid file type. Only image, audio, and supported document files are allowed.");
  }

  const extension = MIME_TO_EXTENSION[mimeType] ?? "bin";
  const objectKey = `attachments/${randomUUID()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.SUPABASE_BUCKET_NAME!,
    Key: objectKey,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  return { uploadUrl, objectKey };
};

export default { generatePresignedUrl };