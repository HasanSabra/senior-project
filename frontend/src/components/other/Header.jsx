import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { AUTH_API } from "@/lib/api";
import PrimaryBTN from "./PrimaryBTN";
import Link from "next/link";

const Header = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const userData = Cookies.get("user");

    if (userData) {
      setUser(JSON.parse(userData));
      setToken(true);
    }
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    const res = await AUTH_API.post("/logout");

    if (res.data.success) {
      router.push("/login");
    }
  };

  const handleHelp = () => {
    console.log("Help clicked");
  };

  return (
    <header className='flex justify-between items-center bg-[#0E0E0E] text-white px-6 py-4 border-b border-[#333333]'>
      {/* Left Section */}
      <div className='flex items-center gap-12'>
        {/* Logo */}
        <Link
          className='font-bold text-2xl cursor-pointer hover:text-[#CCCCCC] transition-colors'
          href={"/"}
        >
          WiseVote
        </Link>

        {/* Municipality & Timer */}
        <div className='flex items-center gap-4 bg-[#1A1A1A] px-4 py-2 rounded-lg border border-[#333333]'>
          <span className='font-semibold text-[#CCCCCC] text-sm uppercase tracking-wide'>
            Municipality
          </span>
          <span className='text-[#666666]'>:</span>
          <div className='flex items-center gap-2'>
            <span className='font-mono font-bold text-[#9D5CFF] text-lg'>
              18:16:25
            </span>
            <div className='w-2 h-2 bg-[#6C2BD9] rounded-full animate-pulse'></div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className='flex items-center gap-8'>
        {/* Language Toggle */}
        <div className='flex items-center gap-6'>
          <div className='relative bg-[#1A1A1A] rounded-full p-1 border border-[#333333]'>
            <button className='relative flex items-center gap-2 px-3 py-1 text-sm font-medium'>
              <span className='text-[#888888]'>Ar</span>
              <span className='text-[#CCCCCC]'>En</span>
              <div className='absolute left-1 top-1 w-6 h-6 bg-[linear-gradient(180deg,rgba(108,43,217,0.9)_0%,rgba(164,94,229,0.9)_100%)] rounded-full transition-transform duration-300 transform translate-x-7'></div>
            </button>
          </div>

          {/* Help Link */}
          <button
            onClick={handleHelp}
            className='font-semibold text-[#CCCCCC] hover:text-[#9D5CFF] transition-colors text-sm uppercase tracking-wide'
          >
            HELP
          </button>

          {/* User Info */}
          <div className='flex items-center gap-2 bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333333]'>
            <div className='w-2 h-2 bg-[#6C2BD9] rounded-full'></div>
            <span className='font-semibold text-[#CCCCCC] text-sm'>
              USER:{" "}
              <span className='text-[#888888]'>
                {user ? `${user?.first_name} ${user?.last_name}` : "N/A"}
              </span>
            </span>
          </div>
        </div>

        {/* Login Button */}
        <PrimaryBTN
          onClickFunc={token ? handleLogout : handleLogin}
          text={token ? "Logout" : "Login"}
          disabled={false}
        />
      </div>
    </header>
  );
};

export default Header;
