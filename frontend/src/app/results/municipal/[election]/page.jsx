"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";

import { RESULT_USER_API } from "@/lib/api";
import { useParams } from "next/navigation";

const MunicipalityResults = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [electionData, setElectionData] = useState(null);
  const [selectedList, setSelectedList] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  const electionId = useParams().election;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // For testing, let's use mock data with debugging
        // const userId = localStorage.getItem('userId') || 1; // Try to get from localStorage
        // console.log("Fetching for user ID:", userId, "election ID:", electionId);

        // TEST ENDPOINT - Remove this when backend is fixed
        // const response = await fetch(`http://localhost:5000/api/results/municipality/${electionId}`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });

        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }

        // const result = await response.json();
        // console.log("API Response:", result);

        const response = await RESULT_USER_API.get(
          `/municipality/${electionId}`,
        );

        if (!response.data.success) {
          setError(response.data.message);
          return;
        }

        const processedData = processElectionData(response.data.data);
        setElectionData(processedData);
      } catch (err) {
        console.error("Fetch error details:", err);
        setError({
          message: err.message,
          details:
            "Please check if you're logged in and the backend server is running.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [electionId]);

  const processElectionData = (data) => {
    const election = data.election;

    if (!election.lists || election.lists.length === 0) {
      return {
        ...election,
        lists: [],
        all_candidates: [],
        winners: [],
        top_candidates: [],
        has_data: false,
        statistics: {
          turnout: 0,
          total_candidates: 0,
          total_lists: 0,
          total_seats_won: 0,
          total_votes: election.total_votes || 0,
          total_voters: election.total_voters || 0,
        },
      };
    }

    // Calculate total seats available (15 per election, not per list)
    const TOTAL_SEATS_AVAILABLE = 15;

    // Process lists
    const processedLists = election.lists.map((list, index) => {
      const percentage =
        election.total_votes > 0
          ? ((list.total_votes / election.total_votes) * 100).toFixed(1)
          : 0;

      const seatsWon = list.candidates.filter(
        (candidate) => candidate.is_winner,
      ).length;

      const colors = [
        "from-[#6C2BD9] to-[#9D5CFF]",
        "from-[#10B981] to-[#34D399]",
        "from-[#F59E0B] to-[#FBBF24]",
        "from-[#EF4444] to-[#F87171]",
        "from-[#3B82F6] to-[#60A5FA]",
      ];

      return {
        ...list,
        percentage: parseFloat(percentage),
        seats_won: seatsWon,
        color: colors[index % colors.length],
        // Sort candidates by votes
        candidates: [...list.candidates].sort((a, b) => b.votes - a.votes),
      };
    });

    // Get all candidates
    const allCandidates = [];
    election.lists.forEach((list) => {
      list.candidates.forEach((candidate) => {
        allCandidates.push({
          ...candidate,
          list_name: list.list_name,
          list_id: list.list_id,
          list_color: list.color,
        });
      });
    });

    // Get winners
    const winners = allCandidates
      .filter((candidate) => candidate.is_winner)
      .sort((a, b) => b.votes - a.votes);

    // Get top candidates
    const topCandidates = [...allCandidates]
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 6);

    return {
      ...election,
      lists: processedLists,
      all_candidates: allCandidates,
      winners: winners,
      top_candidates: topCandidates,
      has_data: true,
      total_seats_available: TOTAL_SEATS_AVAILABLE,
      statistics: {
        turnout:
          election.total_votes > 0 && election.total_voters > 0
            ? ((election.total_votes / election.total_voters) * 100).toFixed(1)
            : 0,
        total_candidates: allCandidates.length,
        total_lists: election.lists.length,
        total_seats_won: winners.length,
        total_votes: election.total_votes,
        total_voters: election.total_voters,
        total_seats_available: TOTAL_SEATS_AVAILABLE,
      },
    };
  };

  const formatNumber = (num) => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
  };

  const getFilteredCandidates = () => {
    if (!electionData || !electionData.has_data) return [];

    let candidates = [...electionData.all_candidates];

    if (selectedList !== "all") {
      candidates = candidates.filter(
        (candidate) => candidate.list_id.toString() === selectedList,
      );
    }

    return candidates.sort((a, b) => b.votes - a.votes);
  };

  const getWinnersByList = (listId = null) => {
    if (!electionData || !electionData.has_data) return [];

    let winners = [...electionData.winners];

    if (listId) {
      winners = winners.filter((winner) => winner.list_id === listId);
    }

    return winners;
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
            <div className="text-white text-lg">
              Loading election results...
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !electionData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#0E0E0E] py-8 px:4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
            <div className="text-red-400 text-lg">
              {error || "No data available"}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!electionData.has_data) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-2xl p-8 text-center">
              <div className="text-yellow-400 text-2xl font-bold mb-4">
                No Election Data Available
              </div>
              <div className="text-yellow-300 text-lg mb-2">
                No election results found for your area.
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const filteredCandidates = getFilteredCandidates();
  const winners = getWinnersByList();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {electionData.election_name}
            </h1>
            <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto">
              Official results for the municipal election in{" "}
              <span className="text-[#9D5CFF] font-semibold">
                {electionData.village_name}
              </span>
              .
            </p>
          </div>

          {/* Overall Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center">
              <div className="text-[#9D5CFF] font-bold text-2xl mb-1">
                {formatNumber(electionData.statistics.total_voters)}
              </div>
              <p className="text-[#CCCCCC] text-sm">Registered Voters</p>
            </div>
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center">
              <div className="text-white font-bold text-2xl mb-1">
                {electionData.statistics.turnout}%
              </div>
              <p className="text-[#CCCCCC] text-sm">Voter Turnout</p>
            </div>
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center">
              <div className="text-[#10B981] font-bold text-2xl mb-1">
                {formatNumber(electionData.statistics.total_votes)}
              </div>
              <p className="text-[#CCCCCC] text-sm">Votes Cast</p>
            </div>
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center">
              <div className="text-[#F59E0B] font-bold text-2xl mb-1">
                {electionData.statistics.total_seats_won}/
                {electionData.total_seats_available}
              </div>
              <p className="text-[#CCCCCC] text-sm">Seats Filled</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* List Selector */}
              <div>
                <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                  Filter by List
                </label>
                <select
                  value={selectedList}
                  onChange={(e) => setSelectedList(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                >
                  <option value="all">All Lists</option>
                  {electionData.lists.map((list) => (
                    <option key={list.list_id} value={list.list_id}>
                      {list.list_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area Info */}
              <div>
                <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                  Electoral Area
                </label>
                <div className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white flex items-center justify-between">
                  <span>{electionData.village_name}</span>
                  <span className="text-[#9D5CFF] text-sm">Village</span>
                </div>
              </div>

              {/* Results Tabs */}
              <div>
                <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                  View Results
                </label>
                <div className="flex gap-2 bg-[#2A2A2A] rounded-lg p-1">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "candidates", label: "Candidates" },
                    { id: "lists", label: "Lists" },
                    { id: "winners", label: "Winners" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-[#6C2BD9] text-white"
                          : "text-[#CCCCCC] hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Content */}
          <div className="space-y-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Overall List Performance */}
                <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden">
                  <div className="bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]">
                    <h2 className="text-xl font-semibold text-white">
                      List Performance
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {electionData.lists.map((list) => (
                        <div
                          key={list.list_id}
                          className="bg-[#2A2A2A] rounded-xl border border-[#333333] p-6"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-4 h-12 bg-gradient-to-r ${list.color} rounded-lg`}
                              ></div>
                              <div>
                                <h3 className="text-white font-bold text-xl">
                                  {list.list_name}
                                </h3>
                                <p className="text-[#CCCCCC] text-sm">
                                  {list.seats_won} seats won • {list.percentage}
                                  % of votes
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold text-2xl">
                                {formatNumber(list.total_votes)}
                              </div>
                              <div className="text-[#CCCCCC] text-sm">
                                votes
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-[#333333] rounded-full h-3 overflow-hidden">
                            <div
                              className="h-3 rounded-full transition-all duration-500"
                              style={{
                                width: `${list.percentage}%`,
                                background: `linear-gradient(to right, ${list.color.split(" ")[1]}, ${list.color.split(" ")[3]})`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Candidates */}
                <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden">
                  <div className="bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]">
                    <h2 className="text-xl font-semibold text-white">
                      Top Performing Candidates
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {electionData.top_candidates.map((candidate, index) => (
                        <div
                          key={candidate.candidate_id}
                          className="bg-[#2A2A2A] rounded-xl border border-[#333333] p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[#9D5CFF] font-bold text-2xl">
                              #{index + 1}
                            </span>
                            {candidate.is_winner && (
                              <span className="bg-[#10B981] text-white text-xs font-medium px-2 py-1 rounded-full">
                                ELECTED
                              </span>
                            )}
                          </div>
                          <h3 className="text-white font-bold text-lg mb-2">
                            {candidate.candidate_name}
                          </h3>
                          <p className="text-[#CCCCCC] text-sm mb-1">
                            {candidate.list_name}
                          </p>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-[#888888] text-sm">
                              Votes:
                            </span>
                            <span className="text-white font-medium">
                              {formatNumber(candidate.votes)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Candidates Tab */}
            {activeTab === "candidates" && (
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden">
                <div className="bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        All Candidates
                      </h2>
                      <p className="text-[#CCCCCC] text-sm">
                        {filteredCandidates.length} candidates found
                      </p>
                    </div>
                    <div className="text-sm text-[#CCCCCC]">
                      Showing:{" "}
                      {selectedList === "all"
                        ? "All Lists"
                        : electionData.lists.find(
                            (l) => l.list_id.toString() === selectedList,
                          )?.list_name}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#333333]">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                            Rank
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                            Candidate
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                            List
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                            Votes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#333333]">
                        {filteredCandidates.map((candidate, index) => (
                          <tr
                            key={candidate.candidate_id}
                            className="hover:bg-[#2A2A2A] transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <span
                                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                                    index < 3
                                      ? "bg-[#6C2BD9] text-white"
                                      : "bg-[#333333] text-[#CCCCCC]"
                                  }`}
                                >
                                  {index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-white font-medium">
                                {candidate.candidate_name}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${candidate.list_color}`}
                                ></div>
                                <span className="text-[#CCCCCC] text-sm">
                                  {candidate.list_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {candidate.is_winner ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                  Elected
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                                  Candidate
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-white font-medium">
                                {formatNumber(candidate.votes)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Lists Tab */}
            {activeTab === "lists" && (
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden">
                <div className="bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]">
                  <h2 className="text-xl font-semibold text-white">
                    List Details
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {electionData.lists.map((list) => {
                      // Calculate how many seats this list could potentially win
                      // List 13: 4 winners out of 6 candidates (66.7% of their candidates won)
                      // List 14: 11 winners out of 15 candidates (73.3% of their candidates won)
                      const winRate =
                        list.candidates.length > 0
                          ? (
                              (list.seats_won / list.candidates.length) *
                              100
                            ).toFixed(1)
                          : 0;

                      return (
                        <div
                          key={list.list_id}
                          className="bg-[#2A2A2A] rounded-xl border border-[#333333] p-6"
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <h3 className="text-white font-bold text-xl mb-2">
                                {list.list_name}
                              </h3>
                              <p className="text-[#CCCCCC] text-sm">
                                {list.village_name}
                              </p>
                            </div>
                            <div
                              className={`w-16 h-16 bg-gradient-to-r ${list.color} rounded-2xl flex items-center justify-center`}
                            >
                              <div className="text-center">
                                <span className="text-white font-bold text-xl block">
                                  {list.seats_won}
                                </span>
                                <span className="text-white text-xs">
                                  seats
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-[#1A1A1A] rounded-lg p-3">
                                <div className="text-[#CCCCCC] text-xs mb-1">
                                  Vote Share
                                </div>
                                <div className="text-white font-bold text-lg">
                                  {list.percentage}%
                                </div>
                              </div>
                              <div className="bg-[#1A1A1A] rounded-lg p-3">
                                <div className="text-[#CCCCCC] text-xs mb-1">
                                  Total Votes
                                </div>
                                <div className="text-white font-bold text-lg">
                                  {formatNumber(list.total_votes)}
                                </div>
                              </div>
                            </div>

                            <div className="bg-[#1A1A1A] rounded-lg p-3">
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-[#CCCCCC] text-xs">
                                  Win Rate
                                </div>
                                <div className="text-white text-sm">
                                  {list.seats_won} of {list.candidates.length}{" "}
                                  candidates
                                </div>
                              </div>
                              <div className="w-full bg-[#333333] rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] transition-all duration-500"
                                  style={{
                                    width: `${winRate}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="text-right text-[#CCCCCC] text-xs mt-1">
                                {winRate}% success rate
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="text-[#CCCCCC] text-sm font-semibold">
                                Candidates ({list.candidates.length})
                              </h4>
                              <div className="text-xs text-[#CCCCCC]">
                                {list.seats_won} elected
                              </div>
                            </div>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                              {list.candidates.map((candidate) => (
                                <div
                                  key={candidate.candidate_id}
                                  className="flex justify-between items-center text-sm py-2 px-3 rounded-lg hover:bg-[#333333] transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        candidate.is_winner
                                          ? "bg-green-500"
                                          : "bg-gray-500"
                                      }`}
                                    ></div>
                                    <span className="text-white truncate">
                                      {candidate.candidate_name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-[#CCCCCC]">
                                      {formatNumber(candidate.votes)} votes
                                    </span>
                                    <span
                                      className={`px-2 py-1 rounded text-xs ${
                                        candidate.is_winner
                                          ? "bg-green-500/20 text-green-400"
                                          : "bg-gray-500/20 text-gray-400"
                                      }`}
                                    >
                                      {candidate.is_winner
                                        ? "Elected"
                                        : "Candidate"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Winners Tab */}
            {activeTab === "winners" && (
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden">
                <div className="bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Election Winners
                      </h2>
                      <p className="text-[#CCCCCC] text-sm">
                        {winners.length} elected officials •{" "}
                        {electionData.total_seats_available} total seats
                      </p>
                    </div>
                    <div className="text-sm text-[#10B981] font-medium">
                      {(
                        (winners.length / electionData.total_seats_available) *
                        100
                      ).toFixed(0)}
                      % seats filled
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {winners.map((winner, index) => {
                      // Find list-specific ranking
                      const listWinners = winners.filter(
                        (w) => w.list_id === winner.list_id,
                      );
                      const listRank =
                        listWinners.findIndex(
                          (w) => w.candidate_id === winner.candidate_id,
                        ) + 1;

                      return (
                        <div
                          key={winner.candidate_id}
                          className="bg-[#2A2A2A] rounded-xl border border-[#333333] p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {winner.candidate_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div>
                                <div className="text-white font-bold">
                                  {winner.candidate_name}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div
                                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${winner.list_color}`}
                                  ></div>
                                  <span className="text-[#9D5CFF] text-xs">
                                    {winner.list_name}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-[#10B981] font-bold text-xl">
                              #{index + 1}
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-[#333333]">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-[#CCCCCC] text-xs">
                                  Votes Received
                                </div>
                                <div className="text-white font-bold text-lg">
                                  {formatNumber(winner.votes)}
                                </div>
                              </div>
                              <div>
                                <div className="text-[#CCCCCC] text-xs">
                                  List Rank
                                </div>
                                <div className="text-white font-bold text-lg">
                                  #{listRank}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary Section */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-8 mt-8">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">
              Election Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {electionData.lists.map((list) => (
                <div key={list.list_id} className="text-center">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${list.color} rounded-2xl flex flex-col items-center justify-center mx-auto mb-3`}
                  >
                    <span className="text-white font-bold text-2xl">
                      {list.seats_won}
                    </span>
                    <span className="text-white/80 text-xs">seats won</span>
                  </div>
                  <h4 className="text-white font-semibold mb-1 truncate">
                    {list.list_name}
                  </h4>
                  <p className="text-[#CCCCCC] text-sm">
                    {list.seats_won} Seat{list.seats_won !== 1 ? "s" : ""} •{" "}
                    {list.percentage}%
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {list.total_votes} votes
                  </p>
                </div>
              ))}
              {/* Total Summary Card */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] rounded-2xl flex flex-col items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-2xl">
                    {electionData.statistics.total_seats_won}
                  </span>
                  <span className="text-white/80 text-xs">
                    of {electionData.total_seats_available}
                  </span>
                </div>
                <h4 className="text-white font-semibold mb-1">Total Seats</h4>
                <p className="text-[#CCCCCC] text-sm">
                  {(
                    (electionData.statistics.total_seats_won /
                      electionData.total_seats_available) *
                    100
                  ).toFixed(0)}
                  % filled
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {electionData.statistics.total_candidates} candidates
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MunicipalityResults;
