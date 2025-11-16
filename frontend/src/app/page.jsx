"use client";

import React from "react";

import Header from "@/components/other/Header";
import PrimaryBTN from "@/components/other/PrimaryBTN";
import ListingCard from "@/components/landing/ListingCard";
import Footer from "@/components/other/Footer";

const Home = () => {
  const handleVoteNow = () => {
    console.log("Vote Now clicked");
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className='min-h-screen flex items-center justify-between px-8 py-16 bg-linear-to-br from-[#0E0E0E] to-[#1A1A1A]'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Hero Content */}
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col gap-6'>
              <h1 className='font-bold text-5xl lg:text-6xl leading-tight'>
                Online Voting{" "}
                <span className='bg-linear-to-r from-[#9D5CFF] to-[#6C2BD9] bg-clip-text text-transparent'>
                  System
                </span>
              </h1>

              <p className='text-xl lg:text-2xl text-[#CCCCCC] leading-relaxed'>
                Our advanced electronic voting system provides strong encryption
                and tamper-resistant results. Developed for modern electronic
                processes, it offers real-time oversight, voter authentication,
                and seamless user experience. Enabling organizations to attain
                equitable, effective, and inclusive digital electoral process.
                Experience the future of democracy—digitally secure and
                accessible to all.
              </p>
            </div>

            <div className='flex gap-4'>
              <PrimaryBTN
                disabled={false}
                onClickFunc={handleVoteNow}
                text='Vote Now'
              />
              <button className='px-6 py-2 border border-[#333333] text-white rounded-lg hover:border-[#9D5CFF] hover:bg-[#9D5CFF]/10 transition-all duration-300 font-semibold'>
                Learn More
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className='flex justify-center lg:justify-end'>
            <div className='relative'>
              <img
                src='/Hero.png'
                alt='Modern voting system interface showing secure election process'
                className='w-full max-w-lg rounded-2xl shadow-2xl'
              />
              <div className='absolute inset-0 bg-linear-to-t from-[#0E0E0E]/50 to-transparent rounded-2xl'></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-8 bg-[#0E0E0E]'>
        <div className='max-w-6xl mx-auto'>
          {/* Section Header */}
          <div className='flex flex-col gap-6 text-center mb-16'>
            <h2 className='font-bold text-4xl lg:text-5xl'>
              Why Choose <span className='text-[#9D5CFF]'>WiseVote</span>?
            </h2>
            <p className='text-xl text-[#888888] max-w-3xl mx-auto leading-relaxed'>
              WiseVote offers a secure and transparent platform for online
              elections, ensuring every vote counts. Our system is designed for
              ease of use and accessibility, making voting simple for everyone.
            </p>
          </div>

          {/* Features Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <ListingCard
              img='/EnhancedSecurity.png'
              imgAlt='Enhanced Security Shield Icon'
              title='Enhanced Security'
              description='Our system employs advanced encryption and multi-factor authentication to protect the integrity of every vote and ensure tamper-proof results.'
            />

            <ListingCard
              img='/DataPrivacy.png'
              imgAlt='Data Privacy Lock Icon'
              title='Data Privacy'
              description='We prioritize privacy, ensuring all voter data is securely stored and handled with the utmost confidentiality and compliance.'
            />

            <ListingCard
              img='/UserFriendly.png'
              imgAlt='User Friendly Interface Icon'
              title='User-Friendly'
              description='WiseVote is designed for ease of use, making the voting process simple and accessible for all users regardless of technical expertise.'
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
