import { AttachmentInput } from "../types/attachmenttype";

export function buildMessagePreview(content: string | null , attachments: AttachmentInput[]): string {
    if(content && content.trim() !== "") return content;
    if(attachments.length > 1) return ` ${attachments.length} files`;
    const a = attachments[0];
    switch (a?.mimeType.split("/")[0]) {
        case "image": return "📷 Photo";
        case "audio": return "🎤 Voice message";
        default: return `📄 ${a?.fileName ?? "Attachment"}`;
  }
}

export function withAttachmentUrls<T extends { attachments: { objectKey: string }[] }>(message: T) {
  return {
    ...message,
    attachments: message.attachments.map(a => ({
      ...a,
      url: `${process.env.SUPABASE_PUBLIC_URL_BASE}/${a.objectKey}`
    }))
  };
}