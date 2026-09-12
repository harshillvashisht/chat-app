import { Paperclip } from "lucide-react";

export default function MessageInput( { text,  onChangeText,  selectedFiles, onFileSelected, onRemoveFile, onSend  }: { text: string;  onChangeText: (text: string) => void; selectedFiles: File[]; onFileSelected: (file: FileList) => void; onRemoveFile: (index: number) => void; onSend: () => void }) {
  return (
    <div className="border-t border-[#1f2530] bg-[#0d1117] px-3.5 py-2.5">
      <form className="flex items-center gap-2.5" onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}>
        <input
          type="text"
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border-0 bg-transparent px-0 py-1 text-[13px] text-[#e8e8e6] outline-none placeholder:text-[#5a5e66] focus:ring-0"
        />

        {selectedFiles.map((file, index) => (
          <div key={`${file.name}-${file.lastModified}-${index}`}>
            <span>{file.name}</span>

            <button type="button" onClick={() => onRemoveFile(index)}>
              ×
            </button>
          </div>
        ))}

        <label className="flex cursor-pointer items-center text-[#8b8f98] transition hover:text-[#2dd4bf]">
          <Paperclip size={18} />
          <input 
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files) {
                onFileSelected(e.target.files);
                e.target.value = "";
              }
            }}
          />
        </label>

        <button
          type="submit"
          className="bg-transparent text-[13px] font-medium text-[#2dd4bf] transition hover:text-[#e8e8e6]"
        >
          Send
        </button>
      </form>
    </div>
  );
}