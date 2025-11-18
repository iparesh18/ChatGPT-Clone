import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatPopup from "../components/ChatPopup";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";
import { api } from "../lib/api";
import { socket } from "../lib/socket";

const ChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChatTitle, setCurrentChatTitle] = useState("New chat");
  const [messages, setMessages] = useState([]);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // LOAD CHATS
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chat");
        const list = res.data.chats || [];
        setChats(list);

        if (list.length > 0) {
          const first = list[0];
          const id = first._id || first.id;
          setCurrentChatId(id);
          setCurrentChatTitle(first.title);
          loadMessages(id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchChats();
  }, []);

  // SOCKET LISTENER
  useEffect(() => {
    const handler = (payload) => {
      if (payload.chat !== currentChatId) return;

      setMessages((prev) => [
        ...prev,
        { role: "model", content: payload.content },
      ]);
      setIsSending(false);
    };

    socket.on("ai-response", handler);
    return () => socket.off("ai-response", handler);
  }, [currentChatId]);

  const loadMessages = async (chatId) => {
    setLoadingMessages(true);
    try {
      const res = await api.get(`/chat/${chatId}/messages`);
      setMessages(res.data.messages || []);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // SEND MESSAGE
  const handleSend = () => {
    if (!input.trim() || !currentChatId) return;

    const msg = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setIsSending(true);

    socket.emit("ai-message", { chat: currentChatId, content: msg });
  };

  // DELETE CHAT
  const handleDeleteChat = async (id) => {
    try {
      await api.delete(`/chat/${id}`);

      const updated = chats.filter((c) => (c._id || c.id) !== id);
      setChats(updated);

      if (id === currentChatId) {
        if (updated.length === 0) {
          setCurrentChatId(null);
          setCurrentChatTitle("New chat");
          setMessages([]);
          return;
        }

        const first = updated[0];
        const newId = first._id || first.id;

        setCurrentChatId(newId);
        setCurrentChatTitle(first.title);
        loadMessages(newId);
      }
    } catch (e) {
      console.error("Delete chat error:", e.response?.data || e);
    }
  };

  // ❗ Disable input if:
  // - No chat created
  // - AI is currently sending
  const isInputDisabled = !currentChatId || isSending;

  return (
    <div className="h-screen flex bg-[#212121] text-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={(chat) => {
          if (!chat) return setSidebarOpen(false);

          const id = chat._id || chat.id;
          setCurrentChatId(id);
          setCurrentChatTitle(chat.title);
          loadMessages(id);
          setSidebarOpen(false);
        }}
        onNewChatClick={() => setIsNewChatOpen(true)}
        onDeleteChat={handleDeleteChat}
      />

      <main className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-12 border-b border-white/10 flex items-center justify-between px-4 md:px-6">
          <button
            className="md:hidden text-xs border border-white/20 px-3 py-1 rounded-md"
            onClick={() => setSidebarOpen(true)}
          >
            Menu
          </button>
        <h1 className="hidden md:block text-xl">Potential</h1>
          <span className="block mx-auto text-sm text-gray-300 truncate max-w-xs">
            {currentChatTitle}
          </span>

          <div className="w-12" />
        </header>

        {/* MESSAGE LIST */}
        {loadingMessages ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            Loading...
          </div>
        ) : (
          <MessageList messages={messages} isSending={isSending} />
        )}

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isInputDisabled}
        />
      </main>

      <ChatPopup
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onCreate={async (title) => {
          const res = await api.post("/chat", { title });
          const newChat = res.data.chat;

          setChats((prev) => [newChat, ...prev]);
          setCurrentChatId(newChat._id);
          setCurrentChatTitle(newChat.title);
          setMessages([]);
          setIsNewChatOpen(false);
        }}
      />
    </div>
  );
};

export default ChatPage;
