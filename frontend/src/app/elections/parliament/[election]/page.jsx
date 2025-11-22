"use client";

import React, { useState } from "react";
import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";
import PrimaryBTN from "@/components/other/PrimaryBTN";

const ParliamentElection = () => {
  const [selectedList, setSelectedList] = useState(null);
  const [preferentialCandidate, setPreferentialCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const electionLists = [
    {
      id: 1,
      name: "National Progress Party",
      color: "from-[#6C2BD9] to-[#9D5CFF]",
      candidates: [
        {
          id: 1,
          name: "Sarah Johnson",
          party: "NPP",
          experience: "Former Minister of Education",
        },
        {
          id: 2,
          name: "Michael Chen",
          party: "NPP",
          experience: "Economic Advisor",
        },
        {
          id: 3,
          name: "Elena Rodriguez",
          party: "NPP",
          experience: "Human Rights Advocate",
        },
      ],
    },
    {
      id: 2,
      name: "Unity Coalition",
      color: "from-[#10B981] to-[#059669]",
      candidates: [
        {
          id: 4,
          name: "David Thompson",
          party: "UC",
          experience: "Former Mayor",
        },
        {
          id: 5,
          name: "Lisa Wang",
          party: "UC",
          experience: "Environmental Scientist",
        },
        {
          id: 6,
          name: "James Wilson",
          party: "UC",
          experience: "Healthcare Reform Leader",
        },
      ],
    },
    {
      id: 3,
      name: "Democratic Alliance",
      color: "from-[#F59E0B] to-[#D97706]",
      candidates: [
        {
          id: 7,
          name: "Robert Martinez",
          party: "DA",
          experience: "Legal Scholar",
        },
        {
          id: 8,
          name: "Amanda Foster",
          party: "DA",
          experience: "Technology Innovator",
        },
        {
          id: 9,
          name: "Kevin O'Neil",
          party: "DA",
          experience: "Foreign Policy Expert",
        },
      ],
    },
  ];

  const handleListSelect = (listId) => {
    setSelectedList(listId);
    setPreferentialCandidate(null); // Reset preferential vote when changing list
  };

  const handlePreferentialVote = (candidateId) => {
    if (selectedList) {
      setPreferentialCandidate(candidateId);
    }
  };

  const handleVote = () => {
    if (selectedList) {
      setHasVoted(true);
      const selectedListData = electionLists.find(
        (list) => list.id === selectedList,
      );
      const preferentialCandidateData = preferentialCandidate
        ? selectedListData.candidates.find(
            (c) => c.id === preferentialCandidate,
          )
        : null;

      console.log("Voted for list:", selectedListData.name);
      console.log(
        "Preferential vote:",
        preferentialCandidateData?.name || "None",
      );
      // Add your vote submission logic here
    }
  };

  const getSelectedListData = () => {
    return electionLists.find((list) => list.id === selectedList);
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
                Thank you for participating in the parliamentary election. Your
                vote has been recorded securely.
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
        <div className='max-w-6xl mx-auto'>
          {/* Header Section */}
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-white mb-4'>
              Parliamentary{" "}
              <span className='text-[#9D5CFF]'>Election 2024</span>
            </h1>
            <p className='text-[#CCCCCC] text-lg max-w-2xl mx-auto'>
              Select your preferred list and optionally choose one candidate for
              preferential voting.
            </p>
            <div className='mt-6 bg-[#1A1A1A] border border-[#333333] rounded-lg p-4 inline-block'>
              <p className='text-[#CCCCCC] text-sm'>
                <span className='text-[#9D5CFF] font-semibold'>
                  Voting System:
                </span>{" "}
                Vote for one list + optional preferential vote
              </p>
            </div>
          </div>

          {/* Voting Instructions */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-8 h-8 bg-[#6C2BD9] rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>1</span>
                </div>
                <h3 className='text-white font-semibold'>Choose Your List</h3>
              </div>
              <p className='text-[#CCCCCC] text-sm'>
                Select one political list that you want to support in the
                parliamentary election.
              </p>
            </div>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-8 h-8 bg-[#9D5CFF] rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>2</span>
                </div>
                <h3 className='text-white font-semibold'>
                  Preferential Vote (Optional)
                </h3>
              </div>
              <p className='text-[#CCCCCC] text-sm'>
                Optionally select one candidate from your chosen list for
                preferential voting.
              </p>
            </div>
          </div>

          {/* Election Lists */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12'>
            {electionLists.map((list) => (
              <div
                key={list.id}
                className={`bg-[#1A1A1A] rounded-2xl border-2 shadow-2xl overflow-hidden transition-all duration-200 ${
                  selectedList === list.id
                    ? "border-[#9D5CFF] shadow-[0_0_20px_rgba(157,92,255,0.3)]"
                    : "border-[#333333] hover:border-[#666666]"
                }`}
              >
                {/* List Header */}
                <div
                  className={`bg-linear-to-r ${list.color} p-6 text-center cursor-pointer`}
                  onClick={() => handleListSelect(list.id)}
                >
                  <h3 className='text-white font-bold text-xl'>{list.name}</h3>
                </div>

                {/* Candidates List - Only show if this list is selected */}
                {selectedList === list.id && (
                  <div className='p-6 border-t border-[#333333]'>
                    <div className='mb-4'>
                      <h4 className='text-white font-semibold text-lg mb-2'>
                        Preferential Vote (Optional)
                      </h4>
                      <p className='text-[#888888] text-sm'>
                        Select one candidate to give them your preferential vote
                      </p>
                    </div>

                    <div className='space-y-3'>
                      {list.candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            preferentialCandidate === candidate.id
                              ? "border-[#9D5CFF] bg-[#6C2BD9]/10"
                              : "border-[#333333] bg-[#2A2A2A] hover:border-[#666666]"
                          }`}
                          onClick={() => handlePreferentialVote(candidate.id)}
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex-1'>
                              <h4 className='text-white font-semibold text-lg'>
                                {candidate.name}
                              </h4>
                              <p className='text-[#CCCCCC] text-sm'>
                                {candidate.party}
                              </p>
                              <p className='text-[#888888] text-xs mt-1'>
                                {candidate.experience}
                              </p>
                            </div>
                            <div className='flex items-center'>
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  preferentialCandidate === candidate.id
                                    ? "border-[#9D5CFF] bg-[#9D5CFF]"
                                    : "border-[#666666]"
                                }`}
                              >
                                {preferentialCandidate === candidate.id && (
                                  <div className='w-2 h-2 bg-white rounded-full'></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Vote Summary & Submission */}
          {selectedList && (
            <div className='text-center'>
              <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-8 max-w-2xl mx-auto'>
                <h3 className='text-2xl font-semibold text-white mb-6'>
                  Confirm Your Vote
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                  {/* Selected List */}
                  <div className='bg-[#2A2A2A] rounded-xl p-4 border border-[#9D5CFF]'>
                    <h4 className='text-[#9D5CFF] font-semibold mb-2'>
                      Your List Vote
                    </h4>
                    <p className='text-white font-semibold text-lg'>
                      {getSelectedListData()?.name}
                    </p>
                    <p className='text-[#CCCCCC] text-sm mt-1'>
                      Primary Selection
                    </p>
                  </div>

                  {/* Preferential Vote */}
                  <div
                    className={`rounded-xl p-4 border ${
                      preferentialCandidate
                        ? "border-[#9D5CFF] bg-[#2A2A2A]"
                        : "border-[#333333] bg-[#1A1A1A]"
                    }`}
                  >
                    <h4
                      className={`font-semibold mb-2 ${
                        preferentialCandidate
                          ? "text-[#9D5CFF]"
                          : "text-[#888888]"
                      }`}
                    >
                      Preferential Vote
                    </h4>
                    {preferentialCandidate ? (
                      <>
                        <p className='text-white font-semibold text-lg'>
                          {
                            getSelectedListData()?.candidates.find(
                              (c) => c.id === preferentialCandidate,
                            )?.name
                          }
                        </p>
                        <p className='text-[#CCCCCC] text-sm mt-1'>
                          Optional Selection
                        </p>
                      </>
                    ) : (
                      <p className='text-[#888888] text-sm'>
                        No preferential vote selected
                      </p>
                    )}
                  </div>
                </div>

                <PrimaryBTN
                  text='Submit Vote'
                  onClickFunc={handleVote}
                  disabled={false}
                />

                <p className='text-[#888888] text-sm mt-4'>
                  Your list vote is required. Preferential vote is optional.
                  Vote cannot be changed after submission.
                </p>
              </div>
            </div>
          )}

          {/* Selection Prompt */}
          {!selectedList && (
            <div className='text-center'>
              <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-12'>
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
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-white mb-2'>
                  Select a List to Continue
                </h3>
                <p className='text-[#888888]'>
                  Click on a political list above to make your selection
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ParliamentElection;
