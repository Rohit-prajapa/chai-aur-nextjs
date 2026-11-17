"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("nothing");

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);

      await axios.post("/api/users/logout");

      toast.success("Logout successful!");

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Unable to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get user details

const getUserDetails = async () => {
  try {
    const res = await axios.get("/api/users/me");

    console.log("User Details:", res.data);

    setData(res.data.user._id);

    toast.success("User details fetched successfully!");

  } catch (error) {
    console.error("Error fetching user details:", error);
    toast.error("Unable to fetch user details.");
  }
};


  // Fetch user details when page loads
  // useEffect(() => {
  //   getUserDetails();
  // }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5">
      <h1 className="text-3xl font-bold">Profile</h1>

      <h2>
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>

      <hr className="w-1/2" />

      <button
        onClick={logout}
        disabled={loading}
        className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Logging out..." : "Logout"}
      </button>

      <button
        onClick={getUserDetails}
        className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Get User Details
      </button>
    </div>
  );
}
