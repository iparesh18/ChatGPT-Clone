import React from "react";

const Sidebar = ({
  isOpen,
  chats,
  currentChatId,
  onSelectChat,
  onNewChatClick,
  onDeleteChat,
}) => {
  return (
    <>
      {/* MOBILE BACKDROP */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => onSelectChat(null)}
      />

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30 w-64 
          bg-[#191818] border-r border-white/10 flex flex-col
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* New Chat */}
        <div className="p-3 border-b border-white/10">
        <h1 className="mb-5 text-2xl">ChatGPT Clone</h1>
          <button
            onClick={onNewChatClick}
            className="w-full text-left px-3 py-2 text-sm rounded-md bg-black/30 hover:bg-[#1f2937] border border-white/10"
          >
            + New chat
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 text-sm">
          {chats.length === 0 ? (
            <div className="text-xs text-gray-500 px-2 py-2">No chats yet.</div>
          ) : (
            chats.map((chat) => {
              const id = chat._id || chat.id;

              return (
                <div
                  key={id}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs ${
                    id === currentChatId
                      ? "bg-black/30 text-white"
                      : "text-gray-300 hover:bg-[#111827]"
                  }`}
                >
                  {/* Select chat */}
                  <button
                    className="truncate flex-1 text-left"
                    onClick={() => onSelectChat(chat)}
                  >
                    {chat.title || "New chat"}
                  </button>

                  {/* Delete chat */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(id);
                    }}
                    className="ml-2 text-gray-400 hover:text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-white/10 text-[11px] text-gray-500">
          ChatGPT Clone – Potential
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
