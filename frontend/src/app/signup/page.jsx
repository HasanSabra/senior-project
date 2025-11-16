"use client";

import Header from "@/components/Other/Header";
// import { AUTH_API } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // setError(null);
    // setLoading(true);
    // // Client-side validation
    // if (password !== confirmPassword) {
    //   setError("Passwords do not match");
    //   setLoading(false);
    //   return;
    // }
    // if (pin.length !== 12) {
    //   setError("Voter PIN must be exactly 12 digits");
    //   setLoading(false);
    //   return;
    // }
    // try {
    //   console.log("Sending register data:", {
    //     pin,
    //     email,
    //     password,
    //     confirmPassword,
    //   });
    //   const res = await AUTH_API.post("/auth/signup", {
    //     pin,
    //     email,
    //     password,
    //     confirmPassword,
    //   });
    //   console.log(res);
    //   if (res.status === 400) {
    //     setError(res.data.message);
    //     setTimeout(() => {
    //       router.push(res.data.redirectTo);
    //     }, 3000);
    //     return;
    //   }
    //   if (res.status !== 200) {
    //     setError(res.data.message);
    //     return;
    //   }
    //   if (res.status === 200) {
    //     setMessage(res.data.message);
    //     setTimeout(() => {
    //       router.push("/login");
    //     }, 5000);
    //   }
    // } catch (err) {
    //   setError(
    //     err.response?.data?.message || "Failed to register. Please try again.",
    //   );
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
      <Header />

      <main className='min-h-[93vh] bg-[#0E0E0E] flex flex-col justify-center px-6 py-12 sm:py-16'>
        <div className='max-w-md w-full mx-auto'>
          {/* Header Section */}
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-white leading-tight mb-4'>
              Join{" "}
              <span className='bg-linear-to-r from-[#9D5CFF] to-[#6C2BD9] bg-clip-text text-transparent'>
                WiseVote
              </span>
            </h1>
            <p className='text-[#CCCCCC] text-lg'>
              Enter your details below to register for the secure eVoting
              system.
            </p>
          </div>

          {/* Registration Card */}
          <section
            aria-labelledby='register-heading'
            className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-8 sm:p-10 shadow-2xl'
          >
            <h2
              id='register-heading'
              className='text-2xl font-semibold text-white text-center mb-8'
            >
              Create your account
            </h2>

            {/* Success Message */}
            {message && (
              <div
                role='banner'
                className='mb-6 rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-green-400 text-center backdrop-blur-sm'
                aria-live='polite'
              >
                <div className='flex items-center justify-center gap-2 mb-2'>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.154-.114l4-5.5z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {message}
                </div>
                <span className='text-sm text-[#CCCCCC]'>
                  You will be redirected to the login page shortly.
                </span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                role='alert'
                className='mb-6 rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-center backdrop-blur-sm'
              >
                <div className='flex items-center justify-center gap-2'>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6' noValidate>
              {/* Voter PIN Field */}
              <div>
                <label
                  htmlFor='pin'
                  className='block text-sm font-medium text-[#CCCCCC] mb-2'
                >
                  Voter PIN
                </label>
                <input
                  id='pin'
                  name='pin'
                  type='text'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  maxLength={12}
                  autoComplete='off'
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200 font-mono text-lg tracking-wider'
                  placeholder='000000000000'
                  aria-describedby='pin-helper'
                  disabled={loading}
                />
                <p
                  id='pin-helper'
                  className='mt-2 text-xs text-[#888888] select-none'
                >
                  Your unique 12-digit voter PIN provided during registration.
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-[#CCCCCC] mb-2'
                >
                  Email address
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200'
                  placeholder='you@example.com'
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-[#CCCCCC] mb-2'
                >
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='new-password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200'
                  placeholder='Create a secure password'
                  disabled={loading}
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-[#CCCCCC] mb-2'
                >
                  Confirm Password
                </label>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  autoComplete='new-password'
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200'
                  placeholder='Re-enter your password'
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-linear-to-r from-[#6C2BD9] to-[#9D5CFF] text-white font-semibold rounded-lg px-6 py-3.5 hover:from-[#5A1FB8] hover:to-[#8A4AFF] focus:outline-none focus:ring-4 focus:ring-[#6C2BD9]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]'
              >
                {loading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    Registering...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className='mt-8 text-center'>
              <p className='text-[#888888] text-sm'>
                Already have an account?{" "}
                <a
                  href='/login'
                  className='font-medium text-[#9D5CFF] hover:text-[#6C2BD9] transition-colors duration-200'
                >
                  Sign in here
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Register;
