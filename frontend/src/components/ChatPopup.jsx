import React, { useState } from "react";

const ChatPopup = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    const finalTitle = title.trim() || "New chat";
    onCreate(finalTitle);
    setTitle("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
      <div className="bg-[#0b0d12] border border-white/10 rounded-2xl p-5 w-full max-w-sm shadow-2xl">
        <h2 className="text-sm font-medium mb-2">Start a new chat</h2>
        <p className="text-xs text-gray-400 mb-3">
          Give your chat a title (you can change it later).
        </p>
        <input
          type="text"
          className="w-full bg-[#020617] border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500"
          placeholder="Chat title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
        />
        <div className="mt-4 flex justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-white/10 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-3 py-1.5 rounded-md bg-white text-black font-medium"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
