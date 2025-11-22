"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";
import PrimaryBTN from "@/components/other/PrimaryBTN";

const MunicipalElection = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [maxVotes, setMaxVotes] = useState(0);

  const electionLists = [
    {
      id: 1,
      name: "Urban Development Alliance",
      color: "from-[#6C2BD9] to-[#9D5CFF]",
      candidates: [
        {
          id: 1,
          name: "Sarah Johnson",
          position: "Mayor Candidate",
          experience: "Former City Councilor",
        },
        {
          id: 2,
          name: "Michael Chen",
          position: "Council Candidate",
          experience: "Urban Planner",
        },
        {
          id: 3,
          name: "Elena Rodriguez",
          position: "Council Candidate",
          experience: "Community Organizer",
        },
        {
          id: 4,
          name: "David Kim",
          position: "Council Candidate",
          experience: "Environmental Engineer",
        },
      ],
    },
    {
      id: 2,
      name: "Community First Coalition",
      color: "from-[#10B981] to-[#059669]",
      candidates: [
        {
          id: 5,
          name: "Robert Martinez",
          position: "Mayor Candidate",
          experience: "Business Leader",
        },
        {
          id: 6,
          name: "Lisa Wang",
          position: "Council Candidate",
          experience: "Education Advocate",
        },
        {
          id: 7,
          name: "James Wilson",
          position: "Council Candidate",
          experience: "Public Safety Expert",
        },
      ],
    },
    {
      id: 3,
      name: "Progressive Municipal Party",
      color: "from-[#F59E0B] to-[#D97706]",
      candidates: [
        {
          id: 8,
          name: "Amanda Foster",
          position: "Mayor Candidate",
          experience: "Technology Innovator",
        },
        {
          id: 9,
          name: "Kevin O'Neil",
          position: "Council Candidate",
          experience: "Housing Specialist",
        },
        {
          id: 10,
          name: "Maria Garcia",
          position: "Council Candidate",
          experience: "Transportation Expert",
        },
        {
          id: 11,
          name: "Thomas Brown",
          position: "Council Candidate",
          experience: "Healthcare Advocate",
        },
      ],
    },
  ];

  // Calculate maximum votes based on the largest list
  useEffect(() => {
    const maxCandidates = Math.max(
      ...electionLists.map((list) => list.candidates.length),
    );
    setMaxVotes(maxCandidates);
  }, []);

  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidates((prev) => {
      if (prev.includes(candidateId)) {
        // Remove candidate if already selected
        return prev.filter((id) => id !== candidateId);
      } else {
        // Add candidate if under max limit
        if (prev.length < maxVotes) {
          return [...prev, candidateId];
        }
        return prev;
      }
    });
  };

  const handleSelectAllFromList = (listId) => {
    const list = electionLists.find((l) => l.id === listId);
    const listCandidateIds = list.candidates.map((c) => c.id);

    setSelectedCandidates((prev) => {
      // Remove any candidates from this list that are already selected
      const filtered = prev.filter((id) => !listCandidateIds.includes(id));

      // Calculate how many more we can select
      const remainingSlots = maxVotes - filtered.length;
      const candidatesToAdd = listCandidateIds.slice(0, remainingSlots);

      return [...filtered, ...candidatesToAdd];
    });
  };

  const handleDeselectAllFromList = (listId) => {
    const list = electionLists.find((l) => l.id === listId);
    const listCandidateIds = list.candidates.map((c) => c.id);

    setSelectedCandidates((prev) =>
      prev.filter((id) => !listCandidateIds.includes(id)),
    );
  };

  const isListFullySelected = (listId) => {
    const list = electionLists.find((l) => l.id === listId);
    const listCandidateIds = list.candidates.map((c) => c.id);
    return listCandidateIds.every((id) => selectedCandidates.includes(id));
  };

  const getSelectedCandidatesData = () => {
    return selectedCandidates
      .map((id) => {
        for (const list of electionLists) {
          const candidate = list.candidates.find((c) => c.id === id);
          if (candidate) return { ...candidate, listName: list.name };
        }
        return null;
      })
      .filter(Boolean);
  };

  const handleVote = () => {
    if (selectedCandidates.length > 0) {
      setHasVoted(true);
      console.log("Voted for candidates:", getSelectedCandidatesData());
      // Add your vote submission logic here
    }
  };

  if (hasVoted) {
    return (
      <>
        <Header />
        <main className='min-h-screen bg-[#0E0E0E] py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-12 shadow-2xl'>
              <div className='w-20 h-20 bg-linear-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-6'>
                <svg
                  className='w-10 h-10 text-white'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.154-.114l4-5.5z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h1 className='text-3xl font-bold text-white mb-4'>
                Vote Submitted Successfully!
              </h1>
              <p className='text-[#CCCCCC] text-lg mb-8'>
                Thank you for participating in the municipal election. Your
                votes have been recorded securely.
              </p>
              <PrimaryBTN
                text='Return to Dashboard'
                onClickFunc={() => (window.location.href = "/dashboard")}
                disabled={false}
              />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className='min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Header Section */}
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-white mb-4'>
              Municipal <span className='text-[#9D5CFF]'>Election 2024</span>
            </h1>
            <p className='text-[#CCCCCC] text-lg max-w-2xl mx-auto'>
              Select up to {maxVotes} candidates across all lists. Choose
              candidates from any list combination.
            </p>

            {/* Voting Info Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto'>
              <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
                <div className='text-[#9D5CFF] font-bold text-2xl mb-2'>
                  {maxVotes}
                </div>
                <p className='text-[#CCCCCC] text-sm'>Maximum Votes</p>
              </div>
              <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
                <div className='text-white font-bold text-2xl mb-2'>
                  {selectedCandidates.length}
                </div>
                <p className='text-[#CCCCCC] text-sm'>Selected Candidates</p>
              </div>
              <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
                <div className='text-[#10B981] font-bold text-2xl mb-2'>
                  {maxVotes - selectedCandidates.length}
                </div>
                <p className='text-[#CCCCCC] text-sm'>Votes Remaining</p>
              </div>
            </div>
          </div>

          {/* Election Lists */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12'>
            {electionLists.map((list) => (
              <div
                key={list.id}
                className='bg-[#1A1A1A] rounded-2xl border border-[#333333] shadow-2xl overflow-hidden'
              >
                {/* List Header with Bulk Actions */}
                <div className={`bg-linear-to-r ${list.color} p-6`}>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-white font-bold text-xl'>
                      {list.name}
                    </h3>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleSelectAllFromList(list.id)}
                        disabled={selectedCandidates.length >= maxVotes}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          selectedCandidates.length >= maxVotes
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => handleDeselectAllFromList(list.id)}
                        className='px-3 py-1 rounded-lg text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition-all'
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <p className='text-white/80 text-sm mt-2'>
                    {list.candidates.length} candidates •{" "}
                    {isListFullySelected(list.id)
                      ? "✓ All selected"
                      : "Select individually"}
                  </p>
                </div>

                {/* Candidates List */}
                <div className='p-6 space-y-3'>
                  {list.candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedCandidates.includes(candidate.id)
                          ? "border-[#9D5CFF] bg-[#6C2BD9]/10"
                          : "border-[#333333] bg-[#2A2A2A] hover:border-[#666666]"
                      } ${
                        selectedCandidates.length >= maxVotes &&
                        !selectedCandidates.includes(candidate.id)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleCandidateSelect(candidate.id)}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                          <h4 className='text-white font-semibold text-lg'>
                            {candidate.name}
                          </h4>
                          <p className='text-[#CCCCCC] text-sm'>
                            {candidate.position}
                          </p>
                          <p className='text-[#888888] text-xs mt-1'>
                            {candidate.experience}
                          </p>
                        </div>
                        <div className='flex items-center'>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedCandidates.includes(candidate.id)
                                ? "border-[#9D5CFF] bg-[#9D5CFF]"
                                : "border-[#666666]"
                            }`}
                          >
                            {selectedCandidates.includes(candidate.id) && (
                              <div className='w-2 h-2 bg-white rounded-full'></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Vote Summary & Submission */}
          <div className='text-center'>
            <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-8 max-w-4xl mx-auto'>
              <h3 className='text-2xl font-semibold text-white mb-6'>
                Review Your Selections
              </h3>

              {/* Selected Candidates Summary */}
              {selectedCandidates.length > 0 ? (
                <div className='mb-8'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
                    {getSelectedCandidatesData().map((candidate, index) => (
                      <div
                        key={candidate.id}
                        className='bg-[#2A2A2A] rounded-xl p-4 border border-[#9D5CFF]'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-[#9D5CFF] font-semibold'>
                            #{index + 1}
                          </span>
                          <span className='text-[#888888] text-xs'>
                            {candidate.listName}
                          </span>
                        </div>
                        <h4 className='text-white font-semibold'>
                          {candidate.name}
                        </h4>
                        <p className='text-[#CCCCCC] text-sm'>
                          {candidate.position}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className='max-w-md mx-auto mb-6'>
                    <div className='flex justify-between text-sm text-[#CCCCCC] mb-2'>
                      <span>Selected: {selectedCandidates.length}</span>
                      <span>Maximum: {maxVotes}</span>
                    </div>
                    <div className='w-full bg-[#333333] rounded-full h-3 overflow-hidden'>
                      <div
                        className='bg-linear-to-r from-[#6C2BD9] to-[#9D5CFF] h-3 rounded-full transition-all duration-300'
                        style={{
                          width: `${
                            (selectedCandidates.length / maxVotes) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='bg-[#2A2A2A] rounded-xl p-8 mb-8 border border-[#333333]'>
                  <div className='w-16 h-16 bg-[#333333] rounded-2xl flex items-center justify-center mx-auto mb-4'>
                    <svg
                      className='w-8 h-8 text-[#666666]'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                      />
                    </svg>
                  </div>
                  <p className='text-[#888888]'>
                    No candidates selected yet. Choose up to {maxVotes}{" "}
                    candidates from the lists above.
                  </p>
                </div>
              )}

              <PrimaryBTN
                text={
                  selectedCandidates.length > 0
                    ? `Submit ${selectedCandidates.length} Vote(s)`
                    : "Select Candidates to Vote"
                }
                onClickFunc={handleVote}
                disabled={selectedCandidates.length === 0}
              />

              <p className='text-[#888888] text-sm mt-4'>
                You can select candidates from any list combination. Maximum{" "}
                {maxVotes} votes allowed.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MunicipalElection;
