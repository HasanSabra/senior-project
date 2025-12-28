"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";
import PrimaryBTN from "@/components/other/PrimaryBTN";

import { MAYORAL_API } from "@/lib/api";

const MunicipalElection = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [electionData, setElectionData] = useState(null);
  const [maxVotes, setMaxVotes] = useState(0);

  const election_id = useParams().election;

  useEffect(() => {
    fetchElectionData();
    checkIfUserHasVoted();
  }, []);

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await MAYORAL_API.get(`/${election_id}`);

      console.log("API Response:", res.data);

      if (!res.data.success) {
        setError(res.data.message || "Failed to load election data");
        setLoading(false);
        return;
      }

      setElectionData(res.data.data);

      const maxCandidates = Math.max(
        ...(data?.lists?.map((list) => {
          return list?.candidates ? list.candidates.length : 0;
        }) || [0]), // Fallback if no lists
      );

      setMaxVotes(maxCandidates);
      setLoading(false);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load election data. Please try again.");
      setLoading(false);
    }
  };

  const checkIfUserHasVoted = async () => {
    try {
      const res = await MAYORAL_API.get(`/has-voted/${election_id}`);

      if (res.data.error) {
        setError(res.data.message);
        return;
      }

      setHasVoted(res.data.hasVoted);
    } catch (err) {
      console.error("Error checking vote status:", err);
    }
  };

  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidates((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      } else {
        if (prev.length < maxVotes) {
          return [...prev, candidateId];
        }
        return prev;
      }
    });
  };

  const handleSelectAllFromList = (listId) => {
    const list = electionData.lists.find((l) => l.list_id === listId);
    const listCandidateIds = list.candidates.map((c) => c.candidate_id);

    setSelectedCandidates((prev) => {
      const filtered = prev.filter((id) => !listCandidateIds.includes(id));

      const remainingSlots = maxVotes - filtered.length;
      const candidatesToAdd = listCandidateIds.slice(0, remainingSlots);

      return [...filtered, ...candidatesToAdd];
    });
  };

  const handleDeselectAllFromList = (listId) => {
    const list = electionData.lists.find((l) => l.list_id === listId);
    const listCandidateIds = list.candidates?.map((c) => c.candidate_id);

    setSelectedCandidates((prev) =>
      prev.filter((id) => !listCandidateIds.includes(id)),
    );
  };

  const isListFullySelected = (listId) => {
    const list = electionData.lists.find((l) => l.list_id === listId);
    const listCandidateIds = list?.candidates?.map((c) => c.candidate_id);
    return listCandidateIds?.every((id) => selectedCandidates.includes(id));
  };

  const getSelectedCandidatesData = () => {
    return selectedCandidates
      .map((id) => {
        for (const list of electionData.lists) {
          const candidate = list.candidates.find((c) => c.candidate_id === id);
          if (candidate) return { ...candidate, listName: list.list_name };
        }
        return null;
      })
      .filter(Boolean);
  };

  const handleVote = async () => {
    if (selectedCandidates.length === 0) return;

    try {
      setLoading(true);

      const voteData = {
        candidates: selectedCandidates,
      };

      const res = await MAYORAL_API.post(`/vote/${election_id}`, voteData, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.data.success) {
        setError(res.data.message);
        throw new Error(res.data.message);
      }

      setHasVoted(true);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to submit vote");
      setLoading(false);
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
                Thank you for participating in the municipal election. You
                selected {selectedCandidates.length} candidate(s) out of a
                maximum of {maxVotes}.
              </p>

              {selectedCandidates.length > 0 && (
                <div className='bg-[#2A2A2A] rounded-xl p-6 border border-[#9D5CFF] max-w-2xl mx-auto mb-8'>
                  <p className='text-[#9D5CFF] font-semibold mb-4 text-lg'>
                    Your Selections:
                  </p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {getSelectedCandidatesData().map((candidate, index) => (
                      <div
                        key={candidate.id}
                        className='bg-[#1A1A1A] rounded-lg p-4'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-[#9D5CFF] font-semibold'>
                            #{index + 1}
                          </span>
                          <span className='text-[#888888] text-xs'>
                            {candidate.listName}
                          </span>
                        </div>
                        <p className='text-white font-medium'>
                          {candidate.full_name}
                        </p>
                        <p className='text-[#CCCCCC] text-sm'>
                          {candidate.position}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

  if (loading) {
    return (
      <>
        <Header />
        <main className='min-h-screen bg-[#0E0E0E] flex items-center justify-center'>
          <div className='text-center'>
            <div className='w-16 h-16 border-4 border-[#333333] border-t-[#9D5CFF] rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-white'>Loading election data...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className='min-h-screen bg-[#0E0E0E] py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-12'>
              <div className='w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-red-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h1 className='text-2xl font-bold text-white mb-4'>
                Error Loading Election
              </h1>
              <p className='text-[#CCCCCC] mb-6'>{error}</p>
              <button
                onClick={fetchElectionData}
                className='px-6 py-3 bg-[#6C2BD9] text-white rounded-lg hover:bg-[#9D5CFF] transition-colors'
              >
                Try Again
              </button>
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
              Select up to{" "}
              <span className='text-[#9D5CFF] font-semibold'>{maxVotes}</span>{" "}
              candidates across all lists. The maximum is based on the list with
              the most candidates ({maxVotes}).
            </p>

            {/* Voting Info Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto'>
              <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
                <div className='text-[#9D5CFF] font-bold text-2xl mb-2'>
                  {maxVotes}
                </div>
                <p className='text-[#CCCCCC] text-sm'>Maximum Votes</p>
                <p className='text-[#888888] text-xs mt-1'>
                  (Largest list size)
                </p>
              </div>
              <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
                <div className='text-white font-bold text-2xl mb-2'>
                  {selectedCandidates.length}
                </div>
                <p className='text-[#CCCCCC] text-sm'>Selected Candidates</p>
              </div>
              <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
                <div
                  className={`font-bold text-2xl mb-2 ${
                    maxVotes - selectedCandidates.length === 0
                      ? "text-[#F59E0B]"
                      : "text-[#10B981]"
                  }`}
                >
                  {maxVotes - selectedCandidates.length}
                </div>
                <p className='text-[#CCCCCC] text-sm'>Votes Remaining</p>
              </div>
            </div>
          </div>

          {/* Election Lists */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12'>
            {electionData?.lists?.map((list) => (
              <div
                key={list.list_id}
                className='bg-[#1A1A1A] rounded-2xl border border-[#333333] shadow-2xl overflow-hidden'
              >
                {/* List Header with Bulk Actions */}
                <div className={`bg-linear-to-r p-6`}>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-white font-bold text-xl'>
                      {list.list_name}
                    </h3>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleSelectAllFromList(list.list_id)}
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
                        onClick={() => handleDeselectAllFromList(list.list_id)}
                        className='px-3 py-1 rounded-lg text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition-all'
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <p className='text-white/80 text-sm mt-2'>
                    {list?.candidates?.length} candidates • {list?.seats_number}{" "}
                    seats •{" "}
                    {isListFullySelected(list?.list_id)
                      ? "✓ All selected"
                      : "Select individually"}
                  </p>
                </div>

                {/* Candidates List */}
                <div className='p-6 space-y-3'>
                  {list.candidates?.map((candidate) => (
                    <div
                      key={candidate.candidate_id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedCandidates.includes(candidate.candidate_id)
                          ? "border-[#9D5CFF] bg-[#6C2BD9]/10"
                          : "border-[#333333] bg-[#2A2A2A] hover:border-[#666666]"
                      } ${
                        selectedCandidates.length >= maxVotes &&
                        !selectedCandidates.includes(candidate.candidate_id)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        handleCandidateSelect(candidate.candidate_id)
                      }
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                          <h4 className='text-white font-semibold text-lg'>
                            {candidate.first_name} {candidate.last_name}
                          </h4>
                          <p className='text-[#CCCCCC] text-sm'>
                            {candidate.denomination}
                          </p>
                          <p className='text-[#888888] text-xs mt-1'>
                            {candidate.experience}
                          </p>
                        </div>
                        <div className='flex items-center'>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedCandidates.includes(
                                candidate.candidate_id,
                              )
                                ? "border-[#9D5CFF] bg-[#9D5CFF]"
                                : "border-[#666666]"
                            }`}
                          >
                            {selectedCandidates.includes(
                              candidate.candidate_id,
                            ) && (
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
                        key={candidate.candidate_id}
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
                          {candidate.first_name} {candidate.last_name}
                        </h4>
                        <p className='text-[#CCCCCC] text-sm'>
                          {candidate.denomination}
                        </p>
                        <p className='text-[#888888] text-xs mt-2 truncate'>
                          {candidate.experience}
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
                    <p className='text-[#888888] text-xs mt-2'>
                      Based on the largest list ({maxVotes} candidates)
                    </p>
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
                  <p className='text-[#666666] text-sm mt-2'>
                    Maximum votes is {maxVotes} (based on the list with most
                    candidates)
                  </p>
                </div>
              )}

              <PrimaryBTN
                text={
                  loading
                    ? "Submitting..."
                    : selectedCandidates.length > 0
                    ? `Submit ${selectedCandidates.length} Vote(s)`
                    : "Select Candidates to Vote"
                }
                onClickFunc={handleVote}
                disabled={selectedCandidates.length === 0 || loading}
              />

              <p className='text-[#888888] text-sm mt-4'>
                You can select candidates from any list combination. Maximum{" "}
                {maxVotes} votes allowed (largest list size).
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
