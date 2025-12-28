"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";
import PrimaryBTN from "@/components/other/PrimaryBTN";

import { PARLIAMENTARY_API } from "@/lib/api";

import { useParams } from "next/navigation";

const ParliamentElection = () => {
  const [selectedList, setSelectedList] = useState(null);
  const [preferentialCandidate, setPreferentialCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [electionData, setElectionData] = useState(null);

  const electionId = useParams().election;

  useEffect(() => {
    fetchElectionData();
    checkVotingStatus();
  }, [electionId]);

  const fetchElectionData = async () => {
    try {
      setLoading(true);

      const response = await PARLIAMENTARY_API.get(`/${electionId}`);

      if (!response.data.success) {
        setError(response.data.message);
        return;
      }

      console.log(response.data.data);

      setElectionData(response.data.data);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error initializing election:", err);
      setError("Error loading election data");
      setLoading(false);
    }
  };

  const checkVotingStatus = async () => {
    try {
      const response = await PARLIAMENTARY_API.get(`/has-voted/${electionId}`);

      if (!response.data.success) {
        setError(response.data.message);
        return;
      }

      setHasVoted(response.data.hasVoted);
    } catch (err) {
      console.error("Error checking voting status:", err);
    }
  };

  const handleListSelect = (listId) => {
    setSelectedList(listId);
    setPreferentialCandidate(null);
  };

  const handlePreferentialVote = (candidateId) => {
    if (selectedList) {
      setPreferentialCandidate(candidateId);
    }
  };

  const handleVote = async () => {
    if (!selectedList) return;

    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate vote submission
      const voteData = {
        candidate: preferentialCandidate,
        list_id: selectedList,
        election_id: electionId,
        timestamp: new Date().toISOString(),
      };

      console.log("Vote submitted:", voteData);

      // Save to localStorage (replace with actual API call)
      localStorage.setItem(`voted_${electionId}`, "true");
      localStorage.setItem(`vote_data_${electionId}`, JSON.stringify(voteData));

      setHasVoted(true);
      setError(null);
    } catch (err) {
      console.error("Error submitting vote:", err);
      setError("Failed to submit vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedListData = () => {
    if (!electionData?.lists) return null;
    return electionData.lists.find((list) => list.id === selectedList);
  };

  // Loading state
  if (loading && !electionData) {
    return (
      <>
        <Header />
        <main className='min-h-screen bg-[#0E0E0E] py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-7xl mx-auto'>
            {/* Skeleton Header */}
            <div className='text-center mb-12'>
              <div className='h-8 bg-[#333333] rounded-full w-48 mx-auto mb-4 animate-pulse'></div>
              <div className='h-6 bg-[#333333] rounded w-3/4 mx-auto mb-8 animate-pulse'></div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='h-24 bg-[#1A1A1A] rounded-lg border border-[#333333] animate-pulse'
                  ></div>
                ))}
              </div>
            </div>

            {/* Skeleton Lists */}
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 animate-pulse'
                >
                  <div className='h-8 bg-[#333333] rounded w-3/4 mb-4'></div>
                  <div className='h-4 bg-[#333333] rounded w-full mb-2'></div>
                  <div className='h-4 bg-[#333333] rounded w-2/3'></div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error && !electionData) {
    return (
      <>
        <Header />
        <main className='min-h-screen bg-[#0E0E0E] py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-12 shadow-2xl'>
              <div className='w-20 h-20 bg-[#EF4444] rounded-2xl flex items-center justify-center mx-auto mb-6'>
                <svg
                  className='w-10 h-10 text-white'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h1 className='text-2xl font-bold text-white mb-4'>
                Error Loading Election
              </h1>
              <p className='text-[#CCCCCC] text-lg mb-8'>{error}</p>
              <div className='flex justify-center gap-4'>
                <PrimaryBTN
                  text='Try Again'
                  onClickFunc={() => window.location.reload()}
                  disabled={false}
                />
                <PrimaryBTN
                  text='Go to Dashboard'
                  onClickFunc={() => (window.location.href = "/dashboard")}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (hasVoted) {
    return (
      <>
        <Header />
        <main className='min-h-screen bg-[#0E0E0E] py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-12 shadow-2xl'>
              <div className='w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-6'>
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
                Thank you for participating in the election. Your vote has been
                recorded securely and cannot be changed.
              </p>
              <div className='flex justify-center gap-4'>
                <PrimaryBTN
                  text='Return to Dashboard'
                  onClickFunc={() => (window.location.href = "/dashboard")}
                  disabled={false}
                />
              </div>
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
          {/* Election Info Header */}
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-3 bg-[#1A1A1A] border border-[#333333] rounded-full px-4 py-2 mb-4'>
              <div className='w-2 h-2 bg-[#6C2BD9] rounded-full animate-pulse'></div>
              <span className='text-[#9D5CFF] text-sm font-semibold'>
                LIVE ELECTION
              </span>
            </div>
            <h1 className='text-4xl font-bold text-white mb-4'>
              {electionData?.election_name}
              <span className='text-[#9D5CFF] block'>2024</span>
            </h1>

            {/* Election Details */}
            <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto'>
              <div className='bg-[#1A1A1A] border border-[#333333] rounded-lg p-4'>
                <p className='text-[#888888] text-sm'>Total Candidates</p>
                <p className='text-white font-bold text-2xl'>
                  {electionData?.total_candidates || "0"}
                </p>
              </div>
              <div className='bg-[#1A1A1A] border border-[#333333] rounded-lg p-4'>
                <p className='text-[#888888] text-sm'>Lists</p>
                <p className='text-white font-bold text-2xl'>
                  {electionData?.lists?.length || "0"}
                </p>
              </div>
              <div className='bg-[#1A1A1A] border border-[#333333] rounded-lg p-4'>
                <p className='text-[#888888] text-sm'>Your Eligibility</p>
                <p className='text-[#10B981] font-bold text-2xl'>Verified</p>
              </div>
            </div>
          </div>

          {/* Voting System Info */}
          <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 mb-8'>
            <h3 className='text-white font-semibold text-lg mb-4'>
              Voting System Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 bg-[#6C2BD9] rounded-lg flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                  <p className='text-[#CCCCCC] text-sm'>
                    <span className='text-white font-medium'>Required:</span>{" "}
                    Vote for one list
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 bg-[#9D5CFF] rounded-lg flex items-center justify-center'>
                    <span className='text-white text-xs'>?</span>
                  </div>
                  <p className='text-[#CCCCCC] text-sm'>
                    <span className='text-white font-medium'>Optional:</span>{" "}
                    Preferential vote for one candidate
                  </p>
                </div>
              </div>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 bg-[#10B981] rounded-lg flex items-center justify-center'>
                    <span className='text-white text-xs'>!</span>
                  </div>
                  <p className='text-[#CCCCCC] text-sm'>
                    <span className='text-white font-medium'>Note:</span> You
                    must be 18+ years old
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 bg-[#EF4444] rounded-lg flex items-center justify-center'>
                    <span className='text-white text-xs'>×</span>
                  </div>
                  <p className='text-[#CCCCCC] text-sm'>
                    <span className='text-white font-medium'>
                      Irreversible:
                    </span>{" "}
                    Vote cannot be changed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Election Lists */}
          <div
            className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12'
            id='lists-section'
          >
            {electionData?.lists?.map((list) => (
              <div
                key={list.list_id}
                className={`bg-[#1A1A1A] rounded-2xl border-2 shadow-xl overflow-hidden transition-all duration-300 ${
                  selectedList === list.list_id
                    ? "border-[#9D5CFF] shadow-[0_0_20px_rgba(157,92,255,0.4)] transform scale-[1.02]"
                    : "border-[#333333] hover:border-[#666666] hover:shadow-[0_0_10px_rgba(157,92,255,0.2)]"
                }`}
              >
                {/* List Header */}
                <div
                  className={`bg-gradient-to-r p-6 text-center cursor-pointer transition-all duration-300`}
                  onClick={() => handleListSelect(list.list_id)}
                >
                  <h3 className='text-white font-bold text-xl mb-2'>
                    {list.list_name}
                  </h3>
                  <p className='text-white/80 text-sm'>
                    {list.candidates?.length || 0} Candidates
                  </p>
                </div>

                {/* List Details */}
                <div className='p-6 border-b border-[#333333]'>
                  <p className='text-[#CCCCCC] text-sm mb-4 line-clamp-2'>
                    {list.list_description || "No description available"}
                  </p>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-[#9D5CFF] font-medium'>
                      {selectedList === list.list_id
                        ? "Selected"
                        : "Click to select"}
                    </span>
                  </div>
                </div>

                {/* Candidates List - Only show if this list is selected */}
                {selectedList === list.list_id && (
                  <div className='p-6'>
                    <div className='mb-6'>
                      <h4 className='text-white font-semibold text-lg mb-3'>
                        Preferential Vote (Optional)
                      </h4>
                      <p className='text-[#888888] text-sm mb-4'>
                        Select one candidate to give them your preferential vote
                      </p>
                    </div>

                    <div className='space-y-3 max-h-80 overflow-y-auto pr-2'>
                      {list.candidates?.map((candidate) => (
                        <div
                          key={candidate.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            preferentialCandidate === candidate.candidate_id
                              ? "border-[#9D5CFF] bg-gradient-to-r from-[#6C2BD9]/20 to-[#9D5CFF]/10"
                              : "border-[#333333] bg-[#2A2A2A] hover:border-[#666666]"
                          }`}
                          onClick={() =>
                            handlePreferentialVote(candidate.candidate_id)
                          }
                        >
                          <div className='flex items-start gap-4'>
                            <div className='w-12 h-12 bg-gradient-to-br from-[#1A1A1A] to-[#333333] rounded-lg flex items-center justify-center'>
                              <span className='text-white font-bold'>
                                {candidate.first_name.charAt(0)}
                              </span>
                            </div>
                            <div className='flex-1'>
                              <div className='flex items-center justify-between'>
                                <h4 className='text-white font-semibold'>
                                  {candidate.fisrt_name} {candidate.last_name}
                                </h4>
                                <div className='flex items-center'>
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                      preferentialCandidate ===
                                      candidate.candidate_id
                                        ? "border-[#9D5CFF] bg-[#9D5CFF]"
                                        : "border-[#666666]"
                                    }`}
                                  >
                                    {preferentialCandidate ===
                                      candidate.candidate_id && (
                                      <div className='w-1.5 h-1.5 bg-white rounded-full'></div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {candidate.party && (
                                <p className='text-[#CCCCCC] text-sm mt-1'>
                                  {candidate.party}
                                </p>
                              )}
                              {candidate.experience && (
                                <p className='text-[#888888] text-xs mt-2 line-clamp-2'>
                                  {candidate.experience}
                                </p>
                              )}
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

          {/* Vote Confirmation */}
          {selectedList && (
            <div className='text-center'>
              <div className='bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-2xl border border-[#333333] p-8 max-w-3xl mx-auto shadow-2xl'>
                <h3 className='text-2xl font-bold text-white mb-6'>
                  Confirm Your Vote
                </h3>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
                  {/* Selected List */}
                  <div className='relative bg-[#2A2A2A] rounded-xl p-6 border-2 border-[#9D5CFF]'>
                    <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                      <div className='bg-[#9D5CFF] text-white text-xs font-bold px-4 py-1 rounded-full'>
                        PRIMARY VOTE
                      </div>
                    </div>
                    <div className='text-center pt-4'>
                      <div className='w-16 h-16 bg-gradient-to-r from-[#6C2BD9] to-[#9D5CFF] rounded-xl flex items-center justify-center mx-auto mb-4'>
                        <span className='text-white font-bold text-xl'>
                          {getSelectedListData()?.name?.charAt(0)}
                        </span>
                      </div>
                      <h4 className='text-white font-bold text-xl mb-2'>
                        {getSelectedListData()?.name}
                      </h4>
                      <p className='text-[#CCCCCC] text-sm'>
                        List ID: {selectedList}
                      </p>
                    </div>
                  </div>

                  {/* Preferential Vote */}
                  <div
                    className={`relative rounded-xl p-6 border-2 ${
                      preferentialCandidate
                        ? "border-[#9D5CFF] bg-[#2A2A2A]"
                        : "border-[#333333] bg-[#1A1A1A]"
                    }`}
                  >
                    <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                      <div
                        className={`text-xs font-bold px-4 py-1 rounded-full ${
                          preferentialCandidate
                            ? "bg-[#9D5CFF] text-white"
                            : "bg-[#333333] text-[#888888]"
                        }`}
                      >
                        {preferentialCandidate
                          ? "PREFERENTIAL VOTE"
                          : "NO PREFERENTIAL VOTE"}
                      </div>
                    </div>
                    <div className='text-center pt-4'>
                      {preferentialCandidate ? (
                        <>
                          <div className='w-16 h-16 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center mx-auto mb-4'>
                            <span className='text-white font-bold text-xl'>
                              {getSelectedListData()
                                ?.candidates?.find(
                                  (c) => c.id === preferentialCandidate,
                                )
                                ?.name?.charAt(0)}
                            </span>
                          </div>
                          <h4 className='text-white font-bold text-xl mb-2'>
                            {
                              getSelectedListData()?.candidates?.find(
                                (c) => c.id === preferentialCandidate,
                              )?.name
                            }
                          </h4>
                          <p className='text-[#CCCCCC] text-sm'>
                            Optional Selection
                          </p>
                        </>
                      ) : (
                        <>
                          <div className='w-16 h-16 bg-[#333333] rounded-xl flex items-center justify-center mx-auto mb-4'>
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
                          <p className='text-[#888888] text-sm'>
                            No preferential vote selected
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <PrimaryBTN
                    text={loading ? "Submitting..." : "Submit Vote"}
                    onClickFunc={handleVote}
                    disabled={loading || !selectedList}
                  />

                  {error && (
                    <div className='bg-[#EF4444]/10 border border-[#EF4444] rounded-lg p-4'>
                      <p className='text-[#EF4444] text-sm'>{error}</p>
                    </div>
                  )}

                  <p className='text-[#888888] text-sm'>
                    By submitting, you confirm that you are eligible to vote and
                    understand that this action is irreversible.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Selection Prompt */}
          {!selectedList && electionData?.lists && (
            <div className='text-center'>
              <div className='bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-2xl border border-[#333333] p-12'>
                <div className='w-20 h-20 bg-gradient-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse'>
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
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-white mb-3'>
                  Ready to Vote?
                </h3>
                <p className='text-[#CCCCCC] text-lg mb-6 max-w-xl mx-auto'>
                  Choose a political list from the options above to begin the
                  voting process
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
