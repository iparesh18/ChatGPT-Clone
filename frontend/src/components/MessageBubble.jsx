import React from "react";

const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full max-w-3xl mx-auto ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`flex items-start gap-3 max-w-[85%]`}>
        {/* Avatar */}
        {/* {!isUser && (
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-bold shrink-0">
            AI
          </div>
        )} */}

        {/* Bubble */}
        <div
          className={`
            rounded-2xl px-3 py-2 border border-white/10 text-[13px] whitespace-pre-wrap leading-relaxed 
            ${isUser ? "bg-gray-300 text-black" : "bg-white/10 text-gray-200"}
          `}
        >
          {content}
        </div>

        {/* User avatar RIGHT side */}
        {/* {isUser && (
          <div className="w-7 h-7 rounded-full bg-gray-500/10 flex items-center justify-center text-[11px] font-bold shrink-0">
            You
          </div>
        )} */}
      </div>
    </div>
  );
};

export default MessageBubble;
