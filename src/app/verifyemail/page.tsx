"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [message, setMessage] = useState("Verifying your email...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");
        const userId = searchParams.get("userId");

        if (!token || !userId) {
          setMessage("Verification token or user ID is missing.");
          return;
        }

        const response = await axios.post("/api/users/verifyemail", {
          token,
          userId,
        });

        setMessage(response.data.message);
        toast.success("Email verified successfully!");
      } catch (error) {
        console.error("Verification failed:", error);

        if (axios.isAxiosError(error)) {
          setMessage(
            error.response?.data?.error ||
              "Invalid or expired verification link.",
          );
        } else {
          setMessage("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5">
      <h1 className="text-3xl font-bold">Email Verification</h1>

      <p>{message}</p>

      {loading && <p className="text-gray-500">Please wait...</p>}

      {!loading && (
        <button
          onClick={() => router.push("/login")}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Go to Login
        </button>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p>Loading verification page...</p>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
