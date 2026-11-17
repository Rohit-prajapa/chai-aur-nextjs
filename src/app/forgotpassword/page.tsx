"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("/api/users/forgotpassword", {
        email: email.trim().toLowerCase(),
      });

      toast.success(response.data.message);
      setEmail("");
    } catch (error) {
      console.error("Forgot Password Error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            "Unable to send reset link. Please try again later.",
        );
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">🔐</div>

          <h1 className="text-3xl font-bold text-white">Forgot Password?</h1>

          <p className="mt-3 text-sm text-gray-400">
            No worries! Enter your registered email address and we will send you a
            password reset link.
          </p>
        </div>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
