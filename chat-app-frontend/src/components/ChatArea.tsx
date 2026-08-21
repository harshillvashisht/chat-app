import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { Chat, UIMessage } from "../types/chat";
import { useState } from "react";
import { sendMessage } from "../services/messageApi";
import { uploadAttachment } from "../services/attachmentApi";

type ChatAreaProps = {
  messages: UIMessage[];
  selectedChat: Chat | null;
  currentUser: { id: number; username: string } | null;
  onOptimisticMessage: (message: UIMessage) => void;
  onMessageFailed: (clientMessageId: string) => void;
  onRetryMessage: (message: UIMessage) => void;
};

export default function ChatArea({ messages, selectedChat, currentUser, onOptimisticMessage , onMessageFailed, onRetryMessage }: ChatAreaProps) {

  const [text, setText] = useState("");
  const [SelectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    const trimmedText = text.trim();
    
    if ((trimmedText === "" && SelectedFiles.length === 0) || !selectedChat || !currentUser) return;

    setUploadError(null); // Reset upload error before sending
    const clientMessageId = crypto.randomUUID();
    const filesToUpload = SelectedFiles;
    setSelectedFiles([]); // Clear the selected files after sending
    let attachments: { objectKey: string; mimeType: string; fileName: string; fileSize: number }[] = [];
    try {
      attachments = await Promise.all(filesToUpload.map(uploadAttachment));
    } catch (error) {
      setUploadError("Error uploading attachments.");
      console.error("Error uploading attachments:", error);
      return;
    }

    const previewAttachments = attachments.map((a, i) => ({
        ...a,
        url: URL.createObjectURL(filesToUpload[i])
    }));
      

    const optimisticMessage: UIMessage = {
          clientMessageId,
          chatId: selectedChat.id,
          senderId: currentUser.id,
          content: trimmedText,
          createdAt: new Date().toISOString(),
          status: "sending",
          attachments: previewAttachments,
          lastMessagePreview: trimmedText || (attachments.length > 0 ? `${attachments.length} file(s)` : "")
    };

    onOptimisticMessage(optimisticMessage);

    setText("");

     try {
        await sendMessage(
            selectedChat.id,
            trimmedText,
            clientMessageId,
            attachments
        );
    } catch (error) {
        onMessageFailed(clientMessageId);
        console.error(error);
    }
 
  };  

  const handleFileSelected = (file: FileList) => {
    const filesArray = Array.from(file);
    setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  }

  return (
    <main className="flex-1 flex flex-col bg-gray-50">
      <ChatHeader selectedChat={selectedChat} />

      <MessageList messages={messages} currentUser={currentUser} onRetryMessage={onRetryMessage} />
      {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
      <MessageInput text={text} onChangeText={setText} selectedFiles={SelectedFiles} onFileSelected={handleFileSelected}  onRemoveFile={handleRemoveFile} onSend={handleSendMessage} />
    </main>
  );
}