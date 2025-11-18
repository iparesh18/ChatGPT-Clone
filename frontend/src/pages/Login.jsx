import React, { useState } from "react";
import { api } from "../lib/api";

const Login = ({ onSuccess, switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/login", { email, password });
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-full max-w-sm bg-[#050816] border border-white/10 rounded-2xl p-5 shadow-2xl">
        <h1 className="text-lg font-semibold mb-1">Welcome back</h1>
        <p className="text-xs text-gray-400 mb-4">
          Login to continue chatting with your assistant.
        </p>

        {error && (
          <div className="mb-3 text-[11px] text-red-400 bg-red-900/20 border border-red-500/40 rounded-md px-2 py-1.5">
            {error}
          </div>
        )}

        <label className="block text-xs mb-1 text-gray-300">Email</label>
        <input
          className="w-full mb-3 bg-[#020617] border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <label className="block text-xs mb-1 text-gray-300">Password</label>
        <input
          className="w-full mb-4 bg-[#020617] border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mb-3 bg-white text-black text-sm font-medium py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-[11px] text-gray-400 text-center">
          Don&apos;t have an account?{" "}
          <button
            onClick={switchToRegister}
            className="text-emerald-400 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;


