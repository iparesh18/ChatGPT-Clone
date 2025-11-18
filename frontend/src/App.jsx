import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";

const App = () => {
  console.log("LOADED APP.JSX -- REAL FILE");

  const [view, setView] = useState("login"); // "login" | "register" | "chat"

  if (view === "login") {
    return (
      <Login
        onSuccess={() => setView("chat")}
        switchToRegister={() => setView("register")}
      />
    );
  }

  if (view === "register") {
    return <Register switchToLogin={() => setView("login")} />;
  }

  return <ChatPage />;
};

export default App;
