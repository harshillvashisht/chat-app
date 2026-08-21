import { api } from "./axios";

export async function uploadAttachment(file: File) {
    const { data } = await api.post("attachments/presign", {
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size
    });

    const { uploadUrl, objectKey } = data.data;

    const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
    });

    if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
    }

    return { objectKey, mimeType: file.type, fileName: file.name, fileSize: file.size };
}