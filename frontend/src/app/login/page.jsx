"use client";

import Header from "@/components/Other/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { AUTH_API } from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // setError(null);
    // setLoading(true);
    // try {
    //   const res = await AUTH_API.post("/auth/login", {
    //     email,
    //     password,
    //   });
    //   if (res.status !== 200) {
    //     setError(res.data.message);
    //     return;
    //   }
    //   console.log("Login successful:", res.data);
    //   router.push("/dashboard");
    // } catch (err) {
    //   setError(err.response?.data?.message || "An error occurred during login");
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
              Welcome Back to{" "}
              <span className='bg-linear-to-r from-[#9D5CFF] to-[#6C2BD9] bg-clip-text text-transparent'>
                WiseVote
              </span>
            </h1>
            <p className='text-[#CCCCCC] text-lg'>
              Securely log in to cast your vote or manage your account.
            </p>
          </div>

          {/* Login Card */}
          <section
            aria-labelledby='login-heading'
            className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-8 sm:p-10 shadow-2xl'
          >
            <h2
              id='login-heading'
              className='text-2xl font-semibold text-white text-center mb-8'
            >
              Log in to your account
            </h2>

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

            <form onSubmit={handleSubmit} className='space-y-6'>
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
                  autoComplete='current-password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200'
                  placeholder='Enter your password'
                  disabled={loading}
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    disabled={loading}
                    className='h-4 w-4 rounded border-[#333333] bg-[#2A2A2A] text-[#6C2BD9] focus:ring-[#9D5CFF] focus:ring-2'
                  />
                  <label
                    htmlFor='remember-me'
                    className='ml-2 block text-sm text-[#CCCCCC] select-none'
                  >
                    Remember me
                  </label>
                </div>

                <div className='text-sm'>
                  <a
                    href='/forgot-password'
                    className='font-medium text-[#9D5CFF] hover:text-[#6C2BD9] transition-colors duration-200'
                    tabIndex={loading ? -1 : 0}
                  >
                    Forgot your password?
                  </a>
                </div>
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
                    Logging in...
                  </div>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className='mt-8 text-center'>
              <p className='text-[#888888] text-sm'>
                Don't have an account?{" "}
                <a
                  href='/signup'
                  className='font-medium text-[#9D5CFF] hover:text-[#6C2BD9] transition-colors duration-200'
                >
                  Sign up now
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Login;
