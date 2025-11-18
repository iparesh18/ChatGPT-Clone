import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, isSending }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
      {/* Empty UI */}
      {messages.length === 0 && !isSending && (
        <div className="h-full flex items-center justify-center text-sm text-gray-500/50 flex-col gap-2">
          <h1 className="text-3xl">ChatGPT Clone</h1>
          <h5 className=" text-xl">Create New Chat</h5>
          Ask anything.
        </div>
      )}

      {/* Message bubbles */}
      {messages.map((m) => (
        <MessageBubble
          key={m._id || m.tempId}
          role={m.role}
          content={m.content}
        />
      ))}

      {/* AI Floating shimmer (not typing... but loading effect) */}
      {isSending && (
        <div className="flex gap-3 text-sm max-w-3xl mx-auto">
        

          {/* shimmer bubble */}
          <div className="relative bg-[#212121] border border-white/5 rounded-2xl px-3 py-3 text-gray-300 overflow-hidden">
            {/* shimmer lines */}
            <div className="h-4 w-32 bg-gray-600/30 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-600/20 rounded"></div>

            {/* floating sweep animation */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.2s_infinite]"></div>
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
