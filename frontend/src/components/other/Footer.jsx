import React from "react";
import PrimaryBTN from "./PrimaryBTN";

const Footer = () => {
  const handleGetStarted = () => {
    console.log("Get Started clicked");
    // Add navigation logic here
  };

  const handleTerms = () => {
    console.log("Terms of Service clicked");
  };

  const handlePrivacy = () => {
    console.log("Privacy Policy clicked");
  };

  const handleContact = () => {
    console.log("Contact Us clicked");
  };

  return (
    <footer className='bg-[#0E0E0E] text-white border-t border-[#333333]'>
      {/* Main CTA Section */}
      <div className='max-w-6xl mx-auto px-6 py-12'>
        <div className='flex flex-col items-center text-center gap-6 mb-12'>
          <h1 className='font-bold text-4xl md:text-3xl bg-linear-to-r from-white to-[#CCCCCC] bg-clip-text text-transparent'>
            Ready to Vote?
          </h1>
          <p className='font-semibold text-xl md:text-lg text-[#CCCCCC] max-w-2xl leading-relaxed'>
            Join thousands of voters who trust WiseVote for secure and
            transparent online elections.
          </p>
          <div className='mt-4'>
            <PrimaryBTN
              disabled={false}
              onClickFunc={handleGetStarted}
              text='Get Started'
            />
          </div>
        </div>

        {/* Links Section */}
        <div className='flex flex-col items-center gap-8 pt-8 border-t border-[#333333]'>
          <div className='flex justify-center gap-12 font-semibold text-[#888888] text-base'>
            <button
              onClick={handleTerms}
              className='hover:text-[#9D5CFF] transition-colors duration-200 cursor-pointer'
            >
              Terms of Service
            </button>
            <button
              onClick={handlePrivacy}
              className='hover:text-[#9D5CFF] transition-colors duration-200 cursor-pointer'
            >
              Privacy Policy
            </button>
            <button
              onClick={handleContact}
              className='hover:text-[#9D5CFF] transition-colors duration-200 cursor-pointer'
            >
              Contact Us
            </button>
          </div>

          {/* Copyright */}
          <div className='text-center'>
            <p className='text-[#666666] text-sm font-medium'>
              © {new Date().getFullYear()} WiseVote. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
