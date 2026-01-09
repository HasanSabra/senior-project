"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const DashboardRedirect = () => {
  const [message, setMessage] = useState("Loading... Please wait.");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleLogic = () => {
    setTimeout(() => {
      try {
        let user = null;
        const userCookie = Cookies.get("user");
        if (userCookie) {
          user = JSON.parse(userCookie);
        } else {
          return;
        }
        const routes = {
          admin: "/admin/dashboard",
          voter: "/elections",
          parliamentary_representative: "/elections",
          municipal_member: "/elections",
          non_voter: "/elections",
        };
        const route = routes[user?.role];
        if (route) {
          router.push(route);
        } else {
          throw new Error("Invalid user role");
        }
      } catch (error) {
        console.error("Invalid user", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  useEffect(() => {
    handleLogic();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#0E0E0E] via-[#1A1A1A] to-[#2A2A2A] p-6">
      <div className="flex flex-col items-center space-y-8 max-w-md text-center">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <div className="w-20 h-20 bg-linear-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-2xl flex items-center justify-center shadow-2xl">
            <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
          </div>
          <div className="absolute inset-0 w-20 h-20 border-2 border-[#9D5CFF] rounded-2xl animate-ping opacity-20"></div>
        </div>

        {/* Loading Content */}
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Spinner */}
          <div className="relative">
            <div
              className="w-16 h-16 border-4 border-[#333333] border-t-[#9D5CFF] rounded-full animate-spin"
              aria-label="Loading spinner"
              role="status"
            />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#6C2BD9] rounded-full animate-spin animation-delay-[-0.5s]"></div>
          </div>

          {/* Messages */}
          <div className="flex flex-col space-y-3">
            <h1 className="text-2xl font-bold text-white">
              Welcome to <span className="text-[#9D5CFF]">WiseVote</span>
            </h1>
            <p className="text-[#CCCCCC] text-lg font-medium">{message}</p>
            <p className="text-[#888888] text-sm">
              Redirecting you to your personalized dashboard...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-64 bg-[#333333] rounded-full h-2 overflow-hidden">
            <div
              className="bg-linear-to-r from-[#6C2BD9] to-[#9D5CFF] h-2 rounded-full animate-progress"
              style={{
                animation: "progress 3s ease-in-out forwards",
              }}
            />
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 text-[#888888] text-sm">
            <svg
              className="w-4 h-4 text-[#6C2BD9]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.154-.114l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            Secure authentication in progress
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animation-delay-\\[-0\\.5s\\] {
          animation-delay: -0.5s;
        }
      `}</style>
    </div>
  );
};

export default DashboardRedirect;
