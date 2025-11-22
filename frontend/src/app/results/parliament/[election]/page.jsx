"use client";

import React, { useState } from "react";
import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";

const ParliamentResults = () => {
  const [selectedConstituency, setSelectedConstituency] = useState("all");
  const [activeTab, setActiveTab] = useState("winners");

  // Mock data for election results
  const constituencies = [
    { id: "all", name: "All Constituencies" },
    { id: "north", name: "Northern Constituency" },
    { id: "south", name: "Southern Constituency" },
    { id: "east", name: "Eastern Constituency" },
    { id: "west", name: "Western Constituency" },
    { id: "central", name: "Central Constituency" },
  ];

  const electionResults = {
    north: {
      name: "Northern Constituency",
      winners: [
        {
          id: 1,
          name: "Sarah Johnson",
          list: "National Progress Party",
          votes: 45231,
          percentage: 38.5,
        },
        {
          id: 2,
          name: "Michael Chen",
          list: "National Progress Party",
          votes: 42156,
          percentage: 35.9,
        },
        {
          id: 3,
          name: "Robert Martinez",
          list: "Unity Coalition",
          votes: 39872,
          percentage: 33.9,
        },
      ],
      lists: [
        {
          name: "National Progress Party",
          votes: 152389,
          percentage: 42.1,
          seats: 2,
        },
        { name: "Unity Coalition", votes: 128765, percentage: 35.6, seats: 1 },
        {
          name: "Democratic Alliance",
          votes: 81234,
          percentage: 22.3,
          seats: 0,
        },
      ],
      candidates: [
        {
          name: "Sarah Johnson",
          list: "National Progress Party",
          votes: 45231,
          percentage: 38.5,
          elected: true,
        },
        {
          name: "Michael Chen",
          list: "National Progress Party",
          votes: 42156,
          percentage: 35.9,
          elected: true,
        },
        {
          name: "Robert Martinez",
          list: "Unity Coalition",
          votes: 39872,
          percentage: 33.9,
          elected: true,
        },
        {
          name: "Lisa Wang",
          list: "Unity Coalition",
          votes: 38765,
          percentage: 33.0,
          elected: false,
        },
        {
          name: "James Wilson",
          list: "Unity Coalition",
          votes: 32128,
          percentage: 27.3,
          elected: false,
        },
        {
          name: "Amanda Foster",
          list: "Democratic Alliance",
          votes: 41234,
          percentage: 35.1,
          elected: false,
        },
        {
          name: "Kevin O'Neil",
          list: "Democratic Alliance",
          votes: 40000,
          percentage: 34.1,
          elected: false,
        },
      ],
    },
    south: {
      name: "Southern Constituency",
      winners: [
        {
          id: 4,
          name: "David Thompson",
          list: "Unity Coalition",
          votes: 51234,
          percentage: 41.2,
        },
        {
          id: 5,
          name: "Elena Rodriguez",
          list: "National Progress Party",
          votes: 48765,
          percentage: 39.3,
        },
        {
          id: 6,
          name: "Maria Garcia",
          list: "Democratic Alliance",
          votes: 24321,
          percentage: 19.5,
        },
      ],
      lists: [
        { name: "Unity Coalition", votes: 145678, percentage: 39.8, seats: 1 },
        {
          name: "National Progress Party",
          votes: 138912,
          percentage: 38.0,
          seats: 1,
        },
        {
          name: "Democratic Alliance",
          votes: 81234,
          percentage: 22.2,
          seats: 1,
        },
      ],
      candidates: [
        {
          name: "David Thompson",
          list: "Unity Coalition",
          votes: 51234,
          percentage: 41.2,
          elected: true,
        },
        {
          name: "Elena Rodriguez",
          list: "National Progress Party",
          votes: 48765,
          percentage: 39.3,
          elected: true,
        },
        {
          name: "Maria Garcia",
          list: "Democratic Alliance",
          votes: 24321,
          percentage: 19.5,
          elected: true,
        },
        {
          name: "Thomas Brown",
          list: "National Progress Party",
          votes: 42123,
          percentage: 33.9,
          elected: false,
        },
        {
          name: "Rachel Green",
          list: "Unity Coalition",
          votes: 39876,
          percentage: 32.1,
          elected: false,
        },
        {
          name: "Alex Kim",
          list: "Democratic Alliance",
          votes: 28976,
          percentage: 23.3,
          elected: false,
        },
      ],
    },
    east: {
      name: "Eastern Constituency",
      winners: [
        {
          id: 7,
          name: "John Smith",
          list: "Democratic Alliance",
          votes: 38765,
          percentage: 35.8,
        },
        {
          id: 8,
          name: "Emma Wilson",
          list: "National Progress Party",
          votes: 36543,
          percentage: 33.7,
        },
        {
          id: 9,
          name: "Chris Lee",
          list: "Unity Coalition",
          votes: 32987,
          percentage: 30.5,
        },
      ],
      lists: [
        {
          name: "Democratic Alliance",
          votes: 118765,
          percentage: 37.2,
          seats: 1,
        },
        {
          name: "National Progress Party",
          votes: 112345,
          percentage: 35.2,
          seats: 1,
        },
        { name: "Unity Coalition", votes: 87654, percentage: 27.6, seats: 1 },
      ],
      candidates: [
        {
          name: "John Smith",
          list: "Democratic Alliance",
          votes: 38765,
          percentage: 35.8,
          elected: true,
        },
        {
          name: "Emma Wilson",
          list: "National Progress Party",
          votes: 36543,
          percentage: 33.7,
          elected: true,
        },
        {
          name: "Chris Lee",
          list: "Unity Coalition",
          votes: 32987,
          percentage: 30.5,
          elected: true,
        },
        {
          name: "Sophia Martinez",
          list: "Democratic Alliance",
          votes: 31234,
          percentage: 28.8,
          elected: false,
        },
        {
          name: "Daniel Kim",
          list: "National Progress Party",
          votes: 29876,
          percentage: 27.6,
          elected: false,
        },
        {
          name: "Olivia Chen",
          list: "Unity Coalition",
          votes: 27654,
          percentage: 25.5,
          elected: false,
        },
      ],
    },
  };

  const overallResults = {
    totalVotes: 1256789,
    totalSeats: 9,
    lists: [
      {
        name: "National Progress Party",
        votes: 452189,
        percentage: 36.0,
        seats: 4,
        color: "from-[#6C2BD9] to-[#9D5CFF]",
      },
      {
        name: "Unity Coalition",
        votes: 412345,
        percentage: 32.8,
        seats: 3,
        color: "from-[#10B981] to-[#059669]",
      },
      {
        name: "Democratic Alliance",
        votes: 392255,
        percentage: 31.2,
        seats: 2,
        color: "from-[#F59E0B] to-[#D97706]",
      },
    ],
  };

  const getWinningCandidates = () => {
    if (selectedConstituency === "all") {
      return Object.values(electionResults).flatMap(
        (constituency) => constituency.winners,
      );
    }
    return electionResults[selectedConstituency]?.winners || [];
  };

  const getListResults = () => {
    if (selectedConstituency === "all") {
      return overallResults.lists;
    }
    return electionResults[selectedConstituency]?.lists || [];
  };

  const getCandidateResults = () => {
    if (selectedConstituency === "all") {
      return Object.values(electionResults).flatMap(
        (constituency) => constituency.candidates,
      );
    }
    return electionResults[selectedConstituency]?.candidates || [];
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <Header />

      <main className='min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
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
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h1 className='text-4xl font-bold text-white mb-4'>
              Parliamentary Election{" "}
              <span className='text-[#9D5CFF]'>Results 2024</span>
            </h1>
            <p className='text-[#CCCCCC] text-lg max-w-2xl mx-auto'>
              Official results for the Members of Parliament elections. View
              winning candidates and vote breakdowns.
            </p>
          </div>

          {/* Overall Statistics */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 text-center'>
              <div className='text-[#9D5CFF] font-bold text-3xl mb-2'>
                {formatNumber(overallResults.totalVotes)}
              </div>
              <p className='text-[#CCCCCC]'>Total Votes Cast</p>
            </div>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 text-center'>
              <div className='text-white font-bold text-3xl mb-2'>
                {overallResults.totalSeats}
              </div>
              <p className='text-[#CCCCCC]'>Total Seats</p>
            </div>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 text-center'>
              <div className='text-[#10B981] font-bold text-3xl mb-2'>
                {constituencies.length - 1}
              </div>
              <p className='text-[#CCCCCC]'>Constituencies</p>
            </div>
          </div>

          {/* Controls */}
          <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 mb-8'>
            <div className='flex flex-col lg:flex-row gap-6 justify-between items-center'>
              {/* Constituency Selector */}
              <div className='flex-1 w-full'>
                <label className='block text-[#CCCCCC] text-sm font-medium mb-2'>
                  Select Constituency
                </label>
                <select
                  value={selectedConstituency}
                  onChange={(e) => setSelectedConstituency(e.target.value)}
                  className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]'
                >
                  {constituencies.map((constituency) => (
                    <option key={constituency.id} value={constituency.id}>
                      {constituency.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Tabs */}
              <div className='flex gap-2 bg-[#2A2A2A] rounded-lg p-1'>
                {[
                  { id: "winners", label: "Winning Candidates" },
                  { id: "lists", label: "List Results" },
                  { id: "candidates", label: "All Candidates" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
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

          {/* Results Content */}
          <div className='space-y-8'>
            {/* Winning Candidates Section */}
            {activeTab === "winners" && (
              <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
                  <h2 className='text-xl font-semibold text-white'>
                    {selectedConstituency === "all"
                      ? "All Winning Candidates"
                      : `${electionResults[selectedConstituency]?.name} Winners`}
                  </h2>
                </div>
                <div className='p-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {getWinningCandidates().map((candidate, index) => (
                      <div
                        key={candidate.id}
                        className='bg-[#2A2A2A] rounded-xl border border-[#333333] p-6'
                      >
                        <div className='flex items-center justify-between mb-4'>
                          <span className='text-[#9D5CFF] font-bold text-2xl'>
                            #{index + 1}
                          </span>
                          <span className='bg-[#10B981] text-white text-xs font-medium px-2 py-1 rounded-full'>
                            ELECTED
                          </span>
                        </div>
                        <h3 className='text-white font-bold text-lg mb-2'>
                          {candidate.name}
                        </h3>
                        <p className='text-[#CCCCCC] text-sm mb-4'>
                          {candidate.list}
                        </p>
                        <div className='space-y-2'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-[#888888]'>Votes:</span>
                            <span className='text-white font-medium'>
                              {formatNumber(candidate.votes)}
                            </span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span className='text-[#888888]'>Percentage:</span>
                            <span className='text-[#10B981] font-medium'>
                              {candidate.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* List Results Section */}
            {activeTab === "lists" && (
              <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
                  <h2 className='text-xl font-semibold text-white'>
                    {selectedConstituency === "all"
                      ? "Overall List Results"
                      : `${electionResults[selectedConstituency]?.name} List Results`}
                  </h2>
                </div>
                <div className='p-6'>
                  <div className='space-y-6'>
                    {getListResults().map((list, index) => (
                      <div
                        key={list.name}
                        className='bg-[#2A2A2A] rounded-xl border border-[#333333] p-6'
                      >
                        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4'>
                          <div className='flex items-center gap-4'>
                            <div
                              className={`w-4 h-12 bg-linear-to-r ${
                                overallResults.lists.find(
                                  (l) => l.name === list.name,
                                )?.color || "from-[#6C2BD9] to-[#9D5CFF]"
                              } rounded-lg`}
                            ></div>
                            <div>
                              <h3 className='text-white font-bold text-xl'>
                                {list.name}
                              </h3>
                              <p className='text-[#CCCCCC] text-sm'>
                                {list.seats} Seat{list.seats !== 1 ? "s" : ""} •{" "}
                                {list.percentage}% of votes
                              </p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='text-white font-bold text-2xl'>
                              {formatNumber(list.votes)}
                            </div>
                            <div className='text-[#CCCCCC] text-sm'>votes</div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className='w-full bg-[#333333] rounded-full h-3 overflow-hidden'>
                          <div
                            className='h-3 rounded-full transition-all duration-500'
                            style={{
                              width: `${list.percentage}%`,
                              background: `linear-gradient(to right, ${
                                list.name === "National Progress Party"
                                  ? "#6C2BD9, #9D5CFF"
                                  : list.name === "Unity Coalition"
                                  ? "#10B981, #059669"
                                  : "#F59E0B, #D97706"
                              })`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* All Candidates Section */}
            {activeTab === "candidates" && (
              <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
                  <h2 className='text-xl font-semibold text-white'>
                    {selectedConstituency === "all"
                      ? "All Candidates"
                      : `${electionResults[selectedConstituency]?.name} Candidates`}
                  </h2>
                </div>
                <div className='p-6'>
                  <div className='overflow-x-auto'>
                    <table className='w-full'>
                      <thead>
                        <tr className='border-b border-[#333333]'>
                          <th className='px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]'>
                            Candidate
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]'>
                            List
                          </th>
                          <th className='px-4 py-3 text-right text-sm font-semibold text-[#CCCCCC]'>
                            Votes
                          </th>
                          <th className='px-4 py-3 text-right text-sm font-semibold text-[#CCCCCC]'>
                            Percentage
                          </th>
                          <th className='px-4 py-3 text-center text-sm font-semibold text-[#CCCCCC]'>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-[#333333]'>
                        {getCandidateResults().map((candidate, index) => (
                          <tr
                            key={index}
                            className='hover:bg-[#2A2A2A] transition-colors'
                          >
                            <td className='px-4 py-3'>
                              <div className='text-white font-medium'>
                                {candidate.name}
                              </div>
                            </td>
                            <td className='px-4 py-3'>
                              <span className='text-[#CCCCCC] text-sm'>
                                {candidate.list}
                              </span>
                            </td>
                            <td className='px-4 py-3 text-right'>
                              <div className='text-white font-medium'>
                                {formatNumber(candidate.votes)}
                              </div>
                            </td>
                            <td className='px-4 py-3 text-right'>
                              <div className='text-[#CCCCCC]'>
                                {candidate.percentage}%
                              </div>
                            </td>
                            <td className='px-4 py-3 text-center'>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  candidate.elected
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                }`}
                              >
                                {candidate.elected ? "Elected" : "Not Elected"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary Section */}
          <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-8 mt-8'>
            <h3 className='text-xl font-semibold text-white mb-6 text-center'>
              Election Summary
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {overallResults.lists.map((list) => (
                <div key={list.name} className='text-center'>
                  <div
                    className={`w-16 h-16 bg-linear-to-r ${list.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}
                  >
                    <span className='text-white font-bold text-xl'>
                      {list.seats}
                    </span>
                  </div>
                  <h4 className='text-white font-semibold mb-1'>{list.name}</h4>
                  <p className='text-[#CCCCCC] text-sm'>
                    {list.seats} Seats • {list.percentage}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ParliamentResults;
