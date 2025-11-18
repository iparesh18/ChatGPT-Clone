import React, { useState } from "react";
import { api } from "../lib/api";

const Register = ({ switchToLogin }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    setMessage("");

    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", {
        fullName: { firstName, lastName },
        email,
        password,
      });
      setMessage("Registration successful! You can now login.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-full max-w-sm bg-[#050816] border border-white/10 rounded-2xl p-5 shadow-2xl">
        <h1 className="text-lg font-semibold mb-1">Create your account</h1>
        <p className="text-xs text-gray-400 mb-4">
          Register to start using your custom ChatGPT.
        </p>

        {error && (
          <div className="mb-3 text-[11px] text-red-400 bg-red-900/20 border border-red-500/40 rounded-md px-2 py-1.5">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-3 text-[11px] text-emerald-400 bg-emerald-900/20 border border-emerald-500/40 rounded-md px-2 py-1.5">
            {message}
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs mb-1 text-gray-300">
              First name
            </label>
            <input
              className="w-full mb-3 bg-[#020617] border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs mb-1 text-gray-300">
              Last name
            </label>
            <input
              className="w-full mb-3 bg-[#020617] border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <label className="block text-xs mb-1 text-gray-300">Email</label>
        <input
          className="w-full mb-3 bg-[#020617] border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <label className="block text-xs mb-1 text-gray-300">Password</label>
        <input
          className="w-full mb-4 bg-[#020617] border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full mb-3 bg-white text-black text-sm font-medium py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-[11px] text-gray-400 text-center">
          Already have an account?{" "}
          <button
            onClick={switchToLogin}
            className="text-emerald-400 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
