"use client";

import Footer from "@/components/other/Footer";
import Header from "@/components/other/Header";
import PrimaryBTN from "@/components/other/PrimaryBTN";
import React, { useState } from "react";
import { CANDIDATE_API } from "@/lib/api";

const ApplyAsCandidate = () => {
  const [formData, setFormData] = useState({
    election: "",
    list: "",
    about: "",
    position: "",
    experience: "",
    qualifications: "",
    manifesto: "",
  });

  const elections = [
    { id: "", name: "Select an election" },
    { id: "parliamentary", name: "Parliamentary Election 2024" },
    { id: "municipal", name: "Municipal Election 2024" },
    { id: "mayoral", name: "Mayoral Election 2024" },
    { id: "speaker", name: "Speaker of Parliament Election" },
  ];

  const lists = [
    { id: "", name: "Select a list" },
    { id: "uda", name: "Urban Development Alliance" },
    { id: "cfc", name: "Community First Coalition" },
    { id: "pmp", name: "Progressive Municipal Party" },
    { id: "independent", name: "Independent" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset position when election changes
    if (name === "election") {
      setFormData((prev) => ({
        ...prev,
        position: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Candidate application submitted:", formData);
    // Add your submission logic here
  };

  const getCurrentPositions = () => {
    return (
      positions[formData.election] || [{ id: "", name: "Select position" }]
    );
  };

  return (
    <>
      <Header />

      <main className='min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Header Section */}
          <div className='text-center mb-12'>
            <div className='w-20 h-20 bg-linear-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-3xl flex items-center justify-center mx-auto mb-6'>
              <svg
                className='w-10 h-10 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            </div>
            <h1 className='text-4xl font-bold text-white mb-4'>
              Apply as <span className='text-[#9D5CFF]'>Candidate</span>
            </h1>
            <p className='text-[#CCCCCC] text-lg max-w-2xl mx-auto'>
              Submit your application to become a candidate in upcoming
              elections. Help shape the future of your community.
            </p>
          </div>

          {/* Application Form */}
          <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] shadow-2xl overflow-hidden'>
            {/* Form Header */}
            <div className='bg-linear-to-r from-[#6C2BD9] to-[#9D5CFF] px-6 py-4'>
              <h2 className='text-xl font-semibold text-white'>
                Candidate Application Form
              </h2>
              <p className='text-white/80 text-sm'>
                Complete all fields to submit your application
              </p>
            </div>

            <form onSubmit={handleSubmit} className='p-6 sm:p-8'>
              <div className='space-y-6'>
                {/* Election Selection */}
                <div>
                  <label className='block text-[#CCCCCC] text-sm font-medium mb-2'>
                    Election Type *
                  </label>
                  <select
                    name='election'
                    value={formData.election}
                    onChange={handleInputChange}
                    required
                    className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200'
                  >
                    {elections.map((election) => (
                      <option key={election.id} value={election.id}>
                        {election.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* List Selection */}
                <div>
                  <label className='block text-[#CCCCCC] text-sm font-medium mb-2'>
                    Political List *
                  </label>
                  <select
                    name='list'
                    value={formData.list}
                    onChange={handleInputChange}
                    required
                    className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200'
                  >
                    {lists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className='block text-[#CCCCCC] text-sm font-medium mb-2'>
                    Professional Experience *
                  </label>
                  <textarea
                    name='experience'
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    placeholder='Describe your professional background, previous roles, and relevant experience...'
                    rows='3'
                    className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200 resize-none'
                  />
                </div>

                {/* Qualifications */}
                <div>
                  <label className='block text-[#CCCCCC] text-sm font-medium mb-2'>
                    Qualifications & Education *
                  </label>
                  <textarea
                    name='qualifications'
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    required
                    placeholder='List your educational qualifications, certifications, and relevant training...'
                    rows='3'
                    className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200 resize-none'
                  />
                </div>

                {/* About Section */}
                <div>
                  <label className='block text-[#CCCCCC] text-sm font-medium mb-2'>
                    Personal Statement *
                  </label>
                  <textarea
                    name='about'
                    value={formData.about}
                    onChange={handleInputChange}
                    required
                    placeholder="Introduce yourself to voters. Share your vision, values, and why you're running for office..."
                    rows='4'
                    className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200 resize-none'
                  />
                </div>

                {/* Manifesto */}
                <div>
                  <label className='block text-[#CCCCCC] text-sm font-medium mb-2'>
                    Campaign Manifesto *
                  </label>
                  <textarea
                    name='manifesto'
                    value={formData.manifesto}
                    onChange={handleInputChange}
                    required
                    placeholder='Outline your key policy proposals, campaign promises, and what you plan to achieve if elected...'
                    rows='5'
                    className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200 resize-none'
                  />
                </div>

                {/* Terms and Conditions */}
                <div className='flex items-start space-x-3'>
                  <input
                    type='checkbox'
                    required
                    className='mt-1 w-4 h-4 text-[#6C2BD9] bg-[#2A2A2A] border-[#333333] rounded focus:ring-[#9D5CFF] focus:ring-2'
                  />
                  <label className='text-[#CCCCCC] text-sm'>
                    I certify that all information provided is true and
                    accurate. I understand that providing false information may
                    result in disqualification and legal consequences. I agree
                    to abide by the election rules and code of conduct.
                  </label>
                </div>

                {/* Submit Button */}
                <div className='pt-4'>
                  <PrimaryBTN
                    text='Submit Application'
                    onClickFunc={handleSubmit}
                    disabled={false}
                    type='submit'
                  />
                </div>
              </div>
            </form>

            {/* Form Footer */}
            <div className='bg-[#2A2A2A] px-6 py-4 border-t border-[#333333]'>
              <div className='flex items-center justify-center gap-2 text-[#888888] text-sm'>
                <svg
                  className='w-4 h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                    clipRule='evenodd'
                  />
                </svg>
                Your application will be reviewed by the election committee
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 text-center'>
              <div className='w-12 h-12 bg-[#6C2BD9] rounded-xl flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 className='text-white font-semibold mb-2'>
                Eligibility Check
              </h3>
              <p className='text-[#CCCCCC] text-sm'>
                Ensure you meet all eligibility requirements before applying
              </p>
            </div>

            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 text-center'>
              <div className='w-12 h-12 bg-[#9D5CFF] rounded-xl flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
              </div>
              <h3 className='text-white font-semibold mb-2'>
                Secure Submission
              </h3>
              <p className='text-[#CCCCCC] text-sm'>
                All applications are encrypted and securely stored
              </p>
            </div>

            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 text-center'>
              <div className='w-12 h-12 bg-[#10B981] rounded-xl flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 className='text-white font-semibold mb-2'>Review Process</h3>
              <p className='text-[#CCCCCC] text-sm'>
                Applications are typically reviewed within 5-7 business days
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ApplyAsCandidate;
