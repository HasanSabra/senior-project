"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";
import PrimaryBTN from "@/components/other/PrimaryBTN";

import { VOTE_USER_API } from "@/lib/api";

const MunicipalElection = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [electionData, setElectionData] = useState(null);
  const [maxVotes, setMaxVotes] = useState(0);
  const [userVillageId, setUserVillageId] = useState(undefined);

  const election_id = useParams().election;

  useEffect(() => {
    // Get user's village ID from cookie
    const userData = Cookies.get("user");
    if (userData) {
      const user = JSON.parse(userData);

      // If user has no village assigned, show error
      if (!user.village_id) {
        setError(
          "Your profile is missing village information. Please contact support to update your profile before voting in local elections.",
        );
        setLoading(false);
        return;
      }

      setUserVillageId(user.village_id);
    } else {
      setError("User authentication required. Please log in to vote.");
      setLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    // Only fetch election data after userVillageId is set
    if (userVillageId !== undefined && userVillageId !== null) {
      fetchElectionData();
    }
  }, [userVillageId]);

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate election_id before making API call
      if (
        !election_id ||
        election_id === "undefined" ||
        election_id === "null"
      ) {
        setError("Invalid election ID");
        setLoading(false);
        return;
      }

      const res = await VOTE_USER_API.get(`/${election_id}`);

      if (!res.data.success) {
        setError(res.data.message || "Failed to load election data");
        setLoading(false);
        return;
      }

      // Filter lists and candidates based on user's village for municipal elections
      let filteredData = { ...res.data.data };
      if (userVillageId && filteredData?.lists) {
        // Filter lists that are specifically assigned to user's village only
        const originalListCount = filteredData.lists.length;
        filteredData.lists = filteredData.lists.filter((list) => {
          const hasVillageId =
            list.village_id !== null &&
            list.village_id !== undefined &&
            list.village_id !== "" &&
            list.village_id !== "0";

          // Convert both values to strings for comparison to avoid type issues
          const listVillageStr = String(list.village_id).trim();
          const userVillageStr = String(userVillageId).trim();

          const listMatches = hasVillageId && listVillageStr === userVillageStr;
          return listMatches;
        });

        // Filter candidates within each list - only show candidates from user's village
        filteredData.lists = filteredData.lists
          .map((list) => {
            const originalCandidateCount = list.candidates?.length || 0;

            const filteredCandidates =
              list.candidates?.filter((candidate) => {
                const hasVillageId =
                  candidate.village_id !== null &&
                  candidate.village_id !== undefined &&
                  candidate.village_id !== "" &&
                  candidate.village_id !== "0";

                // Convert both values to strings for comparison to avoid type issues
                const candidateVillageStr = String(candidate.village_id).trim();
                const userVillageStr = String(userVillageId).trim();

                const candidateMatches =
                  hasVillageId && candidateVillageStr === userVillageStr;
                return candidateMatches;
              }) || [];

            return {
              ...list,
              candidates: filteredCandidates,
            };
          })
          .filter((list) => {
            const keepList = list.candidates.length > 0;
            return keepList;
          });
      } else {
        console.error("Village filtering skipped:", {
          userVillageId,
          hasUserVillageId: !!userVillageId,
          hasLists: !!filteredData?.lists,
          listCount: filteredData?.lists?.length || 0,
        });

        // If no village filtering is applied, show warning that all data is visible
        if (filteredData?.lists?.length > 0) {
          console.warn(
            "⚠️ SECURITY WARNING: No village filtering applied! User can see all lists and candidates!",
          );
        }
      }

      setElectionData(filteredData);

      const maxCandidates = Math.max(
        ...(filteredData?.lists?.map((list) => {
          return list?.candidates ? list.candidates.length : 0;
        }) || [0]), // Fallback if no lists
      );

      setMaxVotes(maxCandidates);
      setLoading(false);

      // Only check vote status after successfully loading election data
      checkIfUserHasVoted();
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load election data. Please try again.");
      setLoading(false);
    }
  };

  const checkIfUserHasVoted = async () => {
    try {
      // Validate election_id before making API call
      if (
        !election_id ||
        election_id === "undefined" ||
        election_id === "null"
      ) {
        console.warn("Invalid election_id, skipping vote check:", election_id);
        setHasVoted(false);
        return;
      }

      const res = await VOTE_USER_API.get(`/has-voted/${election_id}`);

      // API returns 200 with hasVoted: false when user hasn't voted
      if (res.data.hasVoted === false) {
        setHasVoted(false);
      } else if (res.data.hasVoted === true) {
        setHasVoted(true);
        setError("You have already voted in this election.");
      }
    } catch (err) {
      console.error("Error checking vote status:", err);
      console.error("Error details:", {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
        endpoint: `/has-voted/${election_id}`,
      });

      // Handle 400 status code - API returns 400 when user has already voted
      if (err.response?.status === 400 && err.response?.data?.hasVoted) {
        setHasVoted(true);
        setError("You have already voted in this election.");
        return;
      }

      // For other errors, don't set error state - let users continue
      // This might be expected if the voting API isn't fully implemented
      setHasVoted(false);
    }
  };

  const handleCandidateSelect = (candidateId) => {
    if (hasVoted) return;

    setSelectedCandidates((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      } else if (prev.length < maxVotes) {
        return [...prev, candidateId];
      }
      return prev;
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
    const listCandidateIds = list?.candidates?.map((c) => c.candidate_id);

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
      const response = await VOTE_USER_API.post(
        `/municipality/${election_id}`,
        {
          candidates: selectedCandidates,
        },
      );

      if (response.data.success) {
        setHasVoted(true);
        setError(null);
      } else {
        setError(response.data.message || "Failed to submit vote");
      }
    } catch (err) {
      console.error("Voting error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit vote. Please try again.",
      );
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#333333] rounded-2xl animate-pulse mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Loading Election...
              </h3>
              <p className="text-[#888888]">
                Please wait while we fetch the election data.
              </p>
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
        <main className="min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Error Loading Election
              </h3>
              <p className="text-[#888888] mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#6C2BD9] text-white rounded-lg hover:bg-[#9D5CFF] transition-colors"
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

  // All logic is now handled by the existing functions that use electionData from the API

  if (hasVoted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#0E0E0E] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-12 shadow-2xl">
              <div className="w-20 h-20 bg-linear-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.154-.114l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Vote Submitted Successfully!
              </h1>
              <p className="text-[#CCCCCC] text-lg mb-8">
                Thank you for participating in the municipal election. Your
                votes have been recorded securely.
              </p>
              <PrimaryBTN
                text="Return to Dashboard"
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

      <main className="min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              {electionData?.name || "Municipal Election"}{" "}
              <span className="text-[#9D5CFF]">2024</span>
            </h1>
            <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto">
              Select up to {maxVotes} candidates across all lists. Choose
              candidates from any list combination.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg max-w-2xl mx-auto">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Voting Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
              <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center">
                <div className="text-[#9D5CFF] font-bold text-2xl mb-2">
                  {maxVotes}
                </div>
                <p className="text-[#CCCCCC] text-sm">Maximum Votes</p>
              </div>
              <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center">
                <div className="text-white font-bold text-2xl mb-2">
                  {selectedCandidates.length}
                </div>
                <p className="text-[#CCCCCC] text-sm">Selected Candidates</p>
              </div>
              <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center">
                <div className="text-[#10B981] font-bold text-2xl mb-2">
                  {maxVotes - selectedCandidates.length}
                </div>
                <p className="text-[#CCCCCC] text-sm">Votes Remaining</p>
              </div>
            </div>
          </div>

          {/* Village Filtering Notification */}
          {userVillageId && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-300 font-medium">
                    Village-Only Election View
                  </p>
                  <p className="text-blue-400 text-sm">
                    You can only see and vote for candidates and lists that are
                    specifically assigned to your village. No candidates from
                    other villages are shown.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Election Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {electionData?.lists?.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-[#333333] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[#666666]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Local Candidates
                </h3>
                <p className="text-[#888888]">
                  No candidates or lists are available for your village in this
                  election.
                </p>
              </div>
            ) : (
              electionData?.lists?.map((list) => (
                <div
                  key={list.list_id}
                  className="bg-[#1A1A1A] rounded-2xl border border-[#333333] shadow-2xl overflow-hidden"
                >
                  {/* List Header with Bulk Actions */}
                  <div className="bg-gradient-to-r from-[#6C2BD9] to-[#9D5CFF] p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-bold text-xl">
                        {list.list_name}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSelectAllFromList(list.list_id)}
                          disabled={selectedCandidates.length >= maxVotes}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                            selectedCandidates.length >= maxVotes
                              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                              : "bg-white/20 text-white hover:bg-white/30"
                          }`}
                        >
                          Select All
                        </button>
                        <button
                          onClick={() =>
                            handleDeselectAllFromList(list.list_id)
                          }
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition-all"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mt-2">
                      {list.candidates.length} candidates •{" "}
                      {isListFullySelected(list.list_id)
                        ? "✓ All selected"
                        : `${list.candidates.filter((c) => selectedCandidates.includes(c.candidate_id)).length} selected`}
                    </p>
                  </div>

                  {/* Candidates List */}
                  <div className="p-6 space-y-3">
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
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-lg">
                              {candidate.first_name} {candidate.last_name}
                            </h4>
                            <p className="text-[#CCCCCC] text-sm">
                              {candidate.experience || "Candidate"}
                            </p>
                            <p className="text-[#888888] text-xs mt-1">
                              {candidate.qual_edu}
                            </p>
                          </div>
                          <div className="flex items-center">
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
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Vote Summary & Submission */}
          <div className="text-center">
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Review Your Selections
              </h3>

              {/* Selected Candidates Summary */}
              {selectedCandidates.length > 0 ? (
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {getSelectedCandidatesData().map((candidate, index) => (
                      <div
                        key={candidate.candidate_id}
                        className="bg-[#2A2A2A] rounded-xl p-4 border border-[#9D5CFF]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#9D5CFF] font-semibold">
                            #{index + 1}
                          </span>
                          <span className="text-[#888888] text-xs">
                            {candidate.listName}
                          </span>
                        </div>
                        <h4 className="text-white font-semibold">
                          {candidate.name}
                        </h4>
                        <p className="text-[#CCCCCC] text-sm">
                          {candidate.experience || "Candidate"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="max-w-md mx-auto mb-6">
                    <div className="flex justify-between text-sm text-[#CCCCCC] mb-2">
                      <span>Selected: {selectedCandidates.length}</span>
                      <span>Maximum: {maxVotes}</span>
                    </div>
                    <div className="w-full bg-[#333333] rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-linear-to-r from-[#6C2BD9] to-[#9D5CFF] h-3 rounded-full transition-all duration-300"
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
                <div className="bg-[#2A2A2A] rounded-xl p-8 mb-8 border border-[#333333]">
                  <div className="w-16 h-16 bg-[#333333] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-[#666666]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <p className="text-[#888888]">
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

              <p className="text-[#888888] text-sm mt-4">
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
