"use client";

import React, { useState } from "react";
import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";

const MayoralResults = () => {
  const [selectedCity, setSelectedCity] = useState("all");
  const [activeTab, setActiveTab] = useState("winners");

  // Mock data for mayoral election results
  const cities = [
    { id: "all", name: "All Cities" },
    { id: "capital", name: "Capital City" },
    { id: "northville", name: "Northville" },
    { id: "southport", name: "Southport" },
    { id: "eastwood", name: "Eastwood" },
    { id: "westhaven", name: "Westhaven" },
  ];

  const electionData = {
    overall: {
      totalCities: 6,
      totalVoters: 1250000,
      votesCast: 987500,
      turnout: 79.0,
      decidedInFirstRound: 4,
      wentToRunoff: 2,
    },
    cities: {
      capital: {
        name: "Capital City",
        totalVoters: 450000,
        votesCast: 360000,
        turnout: 80.0,
        rounds: [
          {
            round: 1,
            candidates: [
              {
                id: 1,
                name: "Sarah Johnson",
                party: "Urban Development Alliance",
                votes: 156000,
                percentage: 43.3,
                status: "advanced",
                experience: "Former City Councilor, 8 years experience",
                image: "/candidate1.jpg",
              },
              {
                id: 2,
                name: "Michael Chen",
                party: "Community First Coalition",
                votes: 142000,
                percentage: 39.4,
                status: "advanced",
                experience: "Business Leader, Urban Planning Expert",
                image: "/candidate2.jpg",
              },
              {
                id: 3,
                name: "Robert Martinez",
                party: "Progressive Municipal Party",
                votes: 62000,
                percentage: 17.3,
                status: "eliminated",
                experience: "Environmental Advocate, Former NGO Director",
                image: "/candidate3.jpg",
              },
            ],
          },
          {
            round: 2,
            candidates: [
              {
                id: 1,
                name: "Sarah Johnson",
                party: "Urban Development Alliance",
                votes: 198000,
                percentage: 55.0,
                status: "winner",
                experience: "Former City Councilor, 8 years experience",
                image: "/candidate1.jpg",
              },
              {
                id: 2,
                name: "Michael Chen",
                party: "Community First Coalition",
                votes: 162000,
                percentage: 45.0,
                status: "runner-up",
                experience: "Business Leader, Urban Planning Expert",
                image: "/candidate2.jpg",
              },
            ],
          },
        ],
        winner: {
          id: 1,
          name: "Sarah Johnson",
          party: "Urban Development Alliance",
          finalVotes: 198000,
          finalPercentage: 55.0,
          margin: 36000,
          slogan: "Building a Sustainable Future Together",
          priorities: [
            "Urban Development",
            "Public Transportation",
            "Green Spaces",
          ],
        },
      },
      northville: {
        name: "Northville",
        totalVoters: 180000,
        votesCast: 144000,
        turnout: 80.0,
        rounds: [
          {
            round: 1,
            candidates: [
              {
                id: 4,
                name: "Emma Wilson",
                party: "Community First Coalition",
                votes: 79200,
                percentage: 55.0,
                status: "winner",
                experience: "Former Deputy Mayor, Education Reformer",
                image: "/candidate4.jpg",
              },
              {
                id: 5,
                name: "David Kim",
                party: "Urban Development Alliance",
                votes: 43200,
                percentage: 30.0,
                status: "runner-up",
                experience: "Infrastructure Specialist, Engineer",
                image: "/candidate5.jpg",
              },
              {
                id: 6,
                name: "Lisa Wang",
                party: "Independent",
                votes: 21600,
                percentage: 15.0,
                status: "eliminated",
                experience: "Local Business Owner, Community Organizer",
                image: "/candidate6.jpg",
              },
            ],
          },
        ],
        winner: {
          id: 4,
          name: "Emma Wilson",
          party: "Community First Coalition",
          finalVotes: 79200,
          finalPercentage: 55.0,
          margin: 36000,
          slogan: "Putting Community First",
          priorities: ["Education", "Public Safety", "Local Business Support"],
        },
      },
      southport: {
        name: "Southport",
        totalVoters: 220000,
        votesCast: 176000,
        turnout: 80.0,
        rounds: [
          {
            round: 1,
            candidates: [
              {
                id: 7,
                name: "James Anderson",
                party: "Progressive Municipal Party",
                votes: 95000,
                percentage: 54.0,
                status: "winner",
                experience: "Environmental Scientist, Climate Activist",
                image: "/candidate7.jpg",
              },
              {
                id: 8,
                name: "Maria Garcia",
                party: "Urban Development Alliance",
                votes: 81000,
                percentage: 46.0,
                status: "runner-up",
                experience: "Former City Planner, Housing Expert",
                image: "/candidate8.jpg",
              },
            ],
          },
        ],
        winner: {
          id: 7,
          name: "James Anderson",
          party: "Progressive Municipal Party",
          finalVotes: 95000,
          finalPercentage: 54.0,
          margin: 14000,
          slogan: "Green Growth, Smart Development",
          priorities: ["Climate Action", "Affordable Housing", "Public Health"],
        },
      },
      eastwood: {
        name: "Eastwood",
        totalVoters: 150000,
        votesCast: 120000,
        turnout: 80.0,
        winner: {
          id: 9,
          name: "Thomas Clark",
          party: "Urban Development Alliance",
          finalVotes: 68000,
          finalPercentage: 56.7,
          margin: 16000,
          slogan: "Progress Through Partnership",
          priorities: [
            "Economic Growth",
            "Infrastructure",
            "Community Services",
          ],
        },
      },
      westhaven: {
        name: "Westhaven",
        totalVoters: 200000,
        votesCast: 160000,
        turnout: 80.0,
        winner: {
          id: 10,
          name: "Rachel Green",
          party: "Community First Coalition",
          finalVotes: 92000,
          finalPercentage: 57.5,
          margin: 24000,
          slogan: "A Better Quality of Life for All",
          priorities: ["Healthcare", "Education", "Public Spaces"],
        },
      },
    },
    allWinners: [
      {
        city: "Capital City",
        mayor: "Sarah Johnson",
        party: "Urban Development Alliance",
        votes: 198000,
        percentage: 55.0,
        margin: 36000,
        previousMayor: "John Smith",
        term: "2024-2028",
      },
      {
        city: "Northville",
        mayor: "Emma Wilson",
        party: "Community First Coalition",
        votes: 79200,
        percentage: 55.0,
        margin: 36000,
        previousMayor: "Robert Brown",
        term: "2024-2028",
      },
      {
        city: "Southport",
        mayor: "James Anderson",
        party: "Progressive Municipal Party",
        votes: 95000,
        percentage: 54.0,
        margin: 14000,
        previousMayor: "Maria Garcia",
        term: "2024-2028",
      },
      {
        city: "Eastwood",
        mayor: "Thomas Clark",
        party: "Urban Development Alliance",
        votes: 68000,
        percentage: 56.7,
        margin: 16000,
        previousMayor: "Thomas Clark",
        term: "2024-2028",
      },
      {
        city: "Westhaven",
        mayor: "Rachel Green",
        party: "Community First Coalition",
        votes: 92000,
        percentage: 57.5,
        margin: 24000,
        previousMayor: "Michael Taylor",
        term: "2024-2028",
      },
    ],
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      winner: { color: "from-[#10B981] to-[#059669]", text: "ELECTED MAYOR" },
      "runner-up": { color: "from-[#F59E0B] to-[#D97706]", text: "RUNNER-UP" },
      advanced: { color: "from-[#6C2BD9] to-[#9D5CFF]", text: "ADVANCED" },
      eliminated: { color: "from-[#6B7280] to-[#4B5563]", text: "ELIMINATED" },
    };

    const config = statusConfig[status] || statusConfig.eliminated;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r ${config.color} text-white`}
      >
        {config.text}
      </span>
    );
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "MA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getCurrentData = () => {
    if (selectedCity === "all") {
      return {
        winners: electionData.allWinners,
        currentCity: null,
        rounds: [],
      };
    }

    const city = electionData.cities[selectedCity];
    if (!city) {
      return {
        winners: [],
        currentCity: null,
        rounds: [],
      };
    }

    return {
      winners: city.winner
        ? [
            {
              city: city.name,
              mayor: city.winner.name,
              party: city.winner.party,
              votes: city.winner.finalVotes,
              percentage: city.winner.finalPercentage,
              margin: city.winner.margin,
              term: "2024-2028",
            },
          ]
        : [],
      currentCity: city,
      rounds: city.rounds || [],
    };
  };

  const { winners, currentCity, rounds } = getCurrentData();

  return (
    <>
      <Header />

      <main className='min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-6xl mx-auto'>
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
                  d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                />
              </svg>
            </div>
            <h1 className='text-4xl font-bold text-white mb-4'>
              Mayoral Election{" "}
              <span className='text-[#9D5CFF]'>Results 2024</span>
            </h1>
            <p className='text-[#CCCCCC] text-lg max-w-2xl mx-auto'>
              Official results for mayoral elections across all cities. Track
              winning candidates and election details.
            </p>
          </div>

          {/* Overall Statistics */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
              <div className='text-[#9D5CFF] font-bold text-2xl mb-1'>
                {electionData.overall.totalCities}
              </div>
              <p className='text-[#CCCCCC] text-sm'>Cities</p>
            </div>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
              <div className='text-white font-bold text-2xl mb-1'>
                {electionData.overall.turnout}%
              </div>
              <p className='text-[#CCCCCC] text-sm'>Avg. Turnout</p>
            </div>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
              <div className='text-[#10B981] font-bold text-2xl mb-1'>
                {electionData.overall.decidedInFirstRound}
              </div>
              <p className='text-[#CCCCCC] text-sm'>1st Round Wins</p>
            </div>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
              <div className='text-[#F59E0B] font-bold text-2xl mb-1'>
                {electionData.overall.wentToRunoff}
              </div>
              <p className='text-[#CCCCCC] text-sm'>Runoff Elections</p>
            </div>
          </div>

          {/* Controls */}
          <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 mb-8'>
            <div className='flex flex-col lg:flex-row gap-6 justify-between items-center'>
              {/* City Selector */}
              <div className='flex-1 w-full'>
                <label className='block text-[#CCCCCC] text-sm font-medium mb-2'>
                  Select City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]'
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Tabs */}
              <div className='flex gap-2 bg-[#2A2A2A] rounded-lg p-1'>
                {[
                  { id: "winners", label: "Elected Mayors" },
                  { id: "rounds", label: "Voting Rounds" },
                  { id: "details", label: "Election Details" },
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
            {/* Elected Mayors Tab */}
            {activeTab === "winners" && (
              <div className='space-y-6'>
                {selectedCity === "all" ? (
                  // All Cities View
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {winners.map((winner, index) => (
                      <div
                        key={winner.city}
                        className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6'
                      >
                        <div className='text-center mb-4'>
                          <div className='w-16 h-16 bg-linear-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-3'>
                            <span className='text-white font-bold text-lg'>
                              {getInitials(winner.mayor)}
                            </span>
                          </div>
                          <h3 className='text-white font-bold text-lg mb-1'>
                            {winner.mayor || "No Data"}
                          </h3>
                          <p className='text-[#CCCCCC] text-sm mb-2'>
                            {winner.city}
                          </p>
                          <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#10B981]/20 text-green-400 border border-green-500/30'>
                            ELECTED MAYOR
                          </span>
                        </div>

                        <div className='space-y-3 mt-4'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-[#888888]'>Party:</span>
                            <span className='text-white'>
                              {winner.party || "Unknown"}
                            </span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span className='text-[#888888]'>Votes:</span>
                            <span className='text-white font-medium'>
                              {formatNumber(winner.votes)}
                            </span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span className='text-[#888888]'>Percentage:</span>
                            <span className='text-[#10B981] font-medium'>
                              {winner.percentage}%
                            </span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span className='text-[#888888]'>Margin:</span>
                            <span className='text-[#9D5CFF] font-medium'>
                              {formatNumber(winner.margin)}
                            </span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span className='text-[#888888]'>Term:</span>
                            <span className='text-white'>
                              {winner.term || "2024-2028"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single City View
                  <div className='bg-linear-to-r from-[#10B981] to-[#059669] rounded-2xl p-8 text-center'>
                    <div className='max-w-2xl mx-auto'>
                      <div className='w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4'>
                        <span className='text-2xl font-bold text-gray-800'>
                          {getInitials(winners[0]?.mayor)}
                        </span>
                      </div>
                      <h2 className='text-3xl font-bold text-white mb-2'>
                        Congratulations!
                      </h2>
                      <h3 className='text-2xl font-bold text-white mb-2'>
                        {winners[0]?.mayor || "No Data"}
                      </h3>
                      <p className='text-white/90 text-lg mb-4'>
                        Has been elected as Mayor of{" "}
                        {currentCity?.name || "Selected City"}
                      </p>
                      <div className='bg-white/20 rounded-lg p-4 inline-block'>
                        <p className='text-white font-semibold'>
                          {formatNumber(winners[0]?.votes)} votes (
                          {winners[0]?.percentage}%)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Voting Rounds Tab */}
            {activeTab === "rounds" && currentCity && rounds.length > 0 && (
              <div className='space-y-8'>
                {rounds.map((roundData, roundIndex) => (
                  <div
                    key={roundData.round}
                    className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'
                  >
                    <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
                      <h2 className='text-xl font-semibold text-white'>
                        {roundData.round === 1
                          ? "First Round Results"
                          : "Runoff Election Results"}
                      </h2>
                      <p className='text-[#CCCCCC] text-sm'>
                        {currentCity.name} • {currentCity.turnout}% Voter
                        Turnout
                      </p>
                    </div>
                    <div className='p-6'>
                      <div className='space-y-4'>
                        {roundData.candidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className='bg-[#2A2A2A] rounded-xl border border-[#333333] p-6'
                          >
                            <div className='flex items-center justify-between mb-4'>
                              <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 bg-linear-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-xl flex items-center justify-center'>
                                  <span className='text-white font-bold'>
                                    {getInitials(candidate.name)}
                                  </span>
                                </div>
                                <div>
                                  <h3 className='text-white font-bold text-lg'>
                                    {candidate.name}
                                  </h3>
                                  <p className='text-[#CCCCCC] text-sm'>
                                    {candidate.party}
                                  </p>
                                  <p className='text-[#888888] text-xs'>
                                    {candidate.experience}
                                  </p>
                                </div>
                              </div>
                              {getStatusBadge(candidate.status)}
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <div>
                                <div className='flex justify-between text-sm mb-2'>
                                  <span className='text-[#888888]'>Votes:</span>
                                  <span className='text-white font-semibold'>
                                    {formatNumber(candidate.votes)}
                                  </span>
                                </div>
                                <div className='flex justify-between text-sm'>
                                  <span className='text-[#888888]'>
                                    Percentage:
                                  </span>
                                  <span className='text-[#10B981] font-semibold'>
                                    {candidate.percentage}%
                                  </span>
                                </div>
                              </div>
                              <div className='w-full bg-[#333333] rounded-full h-3 overflow-hidden'>
                                <div
                                  className='h-3 rounded-full bg-linear-to-r from-[#6C2BD9] to-[#9D5CFF] transition-all duration-1000'
                                  style={{ width: `${candidate.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Election Details Tab */}
            {activeTab === "details" && currentCity && currentCity.winner && (
              <div className='space-y-6'>
                {/* Winner Profile */}
                <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                  <div className='bg-linear-to-r from-[#10B981] to-[#059669] p-8 text-center'>
                    <div className='w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4'>
                      <span className='text-2xl font-bold text-gray-800'>
                        {getInitials(currentCity.winner.name)}
                      </span>
                    </div>
                    <h2 className='text-3xl font-bold text-white mb-2'>
                      {currentCity.winner.name}
                    </h2>
                    <p className='text-white/90 text-xl'>
                      Mayor Elect of {currentCity.name}
                    </p>
                  </div>

                  <div className='p-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                      <div>
                        <h3 className='text-xl font-semibold text-white mb-4'>
                          Campaign Priorities
                        </h3>
                        <div className='space-y-3'>
                          {currentCity.winner.priorities?.map(
                            (priority, index) => (
                              <div
                                key={index}
                                className='flex items-center gap-3 bg-[#2A2A2A] rounded-xl p-4 border border-[#333333]'
                              >
                                <div className='w-8 h-8 bg-[#6C2BD9] rounded-lg flex items-center justify-center shrink-0'>
                                  <span className='text-white font-bold text-sm'>
                                    {index + 1}
                                  </span>
                                </div>
                                <span className='text-white font-medium'>
                                  {priority}
                                </span>
                              </div>
                            ),
                          ) || (
                            <p className='text-[#CCCCCC]'>
                              No priorities listed
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className='text-xl font-semibold text-white mb-4'>
                          Election Statistics
                        </h3>
                        <div className='bg-[#2A2A2A] rounded-xl p-6 border border-[#333333] space-y-4'>
                          <div className='flex justify-between'>
                            <span className='text-[#CCCCCC]'>
                              Campaign Slogan:
                            </span>
                            <span className='text-white font-semibold text-right'>
                              {currentCity.winner.slogan || "No slogan"}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-[#CCCCCC]'>Final Votes:</span>
                            <span className='text-white font-semibold'>
                              {formatNumber(currentCity.winner.finalVotes)}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-[#CCCCCC]'>
                              Winning Percentage:
                            </span>
                            <span className='text-[#10B981] font-semibold'>
                              {currentCity.winner.finalPercentage}%
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-[#CCCCCC]'>
                              Victory Margin:
                            </span>
                            <span className='text-[#9D5CFF] font-semibold'>
                              {formatNumber(currentCity.winner.margin)} votes
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-[#CCCCCC]'>
                              Voter Turnout:
                            </span>
                            <span className='text-white font-semibold'>
                              {currentCity.turnout}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No Data Message */}
            {activeTab === "rounds" &&
              (!currentCity || rounds.length === 0) && (
                <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-12 text-center'>
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
                        d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
                      />
                    </svg>
                  </div>
                  <h3 className='text-xl font-semibold text-white mb-2'>
                    No Round Data Available
                  </h3>
                  <p className='text-[#888888]'>
                    {selectedCity === "all"
                      ? "Select a specific city to view voting rounds."
                      : "No detailed round data available for this city."}
                  </p>
                </div>
              )}
          </div>

          {/* Party Performance Summary */}
          {selectedCity === "all" && (
            <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-8 mt-8'>
              <h3 className='text-xl font-semibold text-white mb-6 text-center'>
                Party Performance Summary
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='text-center'>
                  <div className='w-16 h-16 bg-linear-to-r from-[#6C2BD9] to-[#9D5CFF] rounded-2xl flex items-center justify-center mx-auto mb-3'>
                    <span className='text-white font-bold text-xl'>2</span>
                  </div>
                  <h4 className='text-white font-semibold mb-1'>
                    Urban Development Alliance
                  </h4>
                  <p className='text-[#CCCCCC] text-sm'>2 Cities Won</p>
                </div>
                <div className='text-center'>
                  <div className='w-16 h-16 bg-linear-to-r from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-3'>
                    <span className='text-white font-bold text-xl'>2</span>
                  </div>
                  <h4 className='text-white font-semibold mb-1'>
                    Community First Coalition
                  </h4>
                  <p className='text-[#CCCCCC] text-sm'>2 Cities Won</p>
                </div>
                <div className='text-center'>
                  <div className='w-16 h-16 bg-linear-to-r from-[#F59E0B] to-[#D97706] rounded-2xl flex items-center justify-center mx-auto mb-3'>
                    <span className='text-white font-bold text-xl'>1</span>
                  </div>
                  <h4 className='text-white font-semibold mb-1'>
                    Progressive Municipal Party
                  </h4>
                  <p className='text-[#CCCCCC] text-sm'>1 City Won</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MayoralResults;
