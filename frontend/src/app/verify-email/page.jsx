"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AUTH_API } from "@/lib/api";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("pending");
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);

  const router = useRouter();

  const verifyEmail = async () => {
    try {
      const res = await AUTH_API.post(`/verify-email?token=${token}`);
      if (res.status === 200) {
        setSuccess(true);
        setMessage(
          "Your email has been successfully verified! You can now log in.",
        );
        setStatus("redirecting");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
      if (res.status !== 200) {
        setSuccess(false);
        setMessage(res.data.message);
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage(
        "An error occurred during verification. Please try again later.",
      );
      setSuccess(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(
        "Invalid verification link. Please check your email and try again.",
      );
      return;
    }

    verifyEmail();
  }, [token]);

  return (
    <main className='min-h-screen bg-[#0E0E0E] flex flex-col justify-center px-6 py-12 sm:py-16'>
      <div className='max-w-md w-full mx-auto'>
        <section
          aria-labelledby='verification-heading'
          className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-8 sm:p-10 text-center shadow-2xl'
        >
          {/* Header Icon */}
          <div className='mb-6 flex justify-center'>
            <div className='w-16 h-16 bg-linear-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-2xl flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
            </div>
          </div>

          <h1
            id='verification-heading'
            className='text-3xl font-bold text-white mb-2'
          >
            Email Verification
          </h1>

          <p className='text-[#888888] mb-8'>
            Securely verifying your email address
          </p>

          {/* Pending State */}
          {status === "pending" && (
            <div className='space-y-6'>
              <div className='flex flex-col items-center space-y-4'>
                <div className='w-12 h-12 border-4 border-[#333333] border-t-[#9D5CFF] rounded-full animate-spin'></div>
                <p className='text-[#9D5CFF] text-lg font-medium'>
                  Verifying your email, please wait...
                </p>
              </div>
              <div className='w-full bg-[#333333] rounded-full h-1.5 overflow-hidden'>
                <div className='bg-linear-to-r from-[#6C2BD9] to-[#9D5CFF] h-1.5 rounded-full animate-pulse'></div>
              </div>
            </div>
          )}

          {/* Redirecting State */}
          {status === "redirecting" && (
            <div className='space-y-6'>
              <div className='flex flex-col items-center space-y-4'>
                <div className='w-12 h-12 border-4 border-[#333333] border-t-[#6C2BD9] rounded-full animate-spin'></div>
                <p className='text-[#9D5CFF] text-lg font-medium'>
                  Redirecting to login page...
                </p>
              </div>
              <div className='text-[#CCCCCC] text-sm'>
                You will be redirected automatically in a few seconds
              </div>
            </div>
          )}

          {/* Success State */}
          {success && (
            <div className='space-y-6'>
              <div className='bg-green-500/10 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm'>
                <div className='flex items-center justify-center gap-3 mb-3'>
                  <svg
                    className='w-6 h-6 text-green-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.154-.114l4-5.5z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='text-green-400 font-semibold text-lg'>
                    Success!
                  </span>
                </div>
                <p className='text-green-300 text-center'>{message}</p>
              </div>
              <div className='flex items-center justify-center gap-2 text-[#888888] text-sm'>
                <div className='w-2 h-2 bg-[#6C2BD9] rounded-full animate-pulse'></div>
                Redirecting to login...
              </div>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className='space-y-6'>
              <div className='bg-red-500/10 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm'>
                <div className='flex items-center justify-center gap-3 mb-3'>
                  <svg
                    className='w-6 h-6 text-red-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='text-red-400 font-semibold text-lg'>
                    Verification Failed
                  </span>
                </div>
                <p className='text-red-300 text-center'>{message}</p>
              </div>

              <div className='flex flex-col gap-4'>
                <a
                  href='/register'
                  className='w-full bg-linear-to-r from-[#6C2BD9] to-[#9D5CFF] text-white font-semibold rounded-lg px-6 py-3.5 hover:from-[#5A1FB8] hover:to-[#8A4AFF] focus:outline-none focus:ring-4 focus:ring-[#6C2BD9]/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-center'
                >
                  Go to Register
                </a>
                <a
                  href='/login'
                  className='w-full border border-[#333333] text-[#CCCCCC] font-semibold rounded-lg px-6 py-3.5 hover:border-[#9D5CFF] hover:bg-[#9D5CFF]/10 transition-all duration-200 text-center'
                >
                  Back to Login
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default VerifyEmail;
