import React from "react";

const ChatInput = ({ value, onChange, onSend, disabled }) => {
  const handleKeyDown = (e) => {
    if (disabled) return; // ⛔ Don't allow typing/send before chat exists

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-white/10 px-4 py-3 bg-[#212121] sticky bottom-0">
      <div className="max-w-3xl mx-auto flex items-center gap-2">
        <textarea
          className={`
            flex-1 resize-none bg-[#303030] border border-white/10 rounded-xl 
            px-3 py-2 text-sm outline-none min-h-12 max-h-44
            ${disabled ? "opacity-40 cursor-not-allowed" : "focus:border-white"}
          `}
          placeholder={
            disabled
              ? "Create a new chat to start messaging..."
              : "Message ChatGPT..."
          }
          value={value}
          onChange={(e) => !disabled && onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        <button
          onClick={() => !disabled && onSend()}
          disabled={disabled}
          className="h-12 px-4 rounded-xl bg-white text-black text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
