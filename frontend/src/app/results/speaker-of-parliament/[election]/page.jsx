"use client";

import React, { useState } from "react";
import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";

const SpeakerResults = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for speaker election results
  const electionData = {
    totalVoters: 450,
    votesCast: 432,
    invalidVotes: 8,
    validVotes: 424,
    turnout: 96.0,
    rounds: [
      {
        round: 1,
        candidates: [
          {
            id: 1,
            name: "Dr. Sarah Johnson",
            party: "Independent",
            votes: 156,
            percentage: 36.8,
            status: "advanced",
            image: "/candidate1.jpg",
          },
          {
            id: 2,
            name: "Hon. Michael Chen",
            party: "Unity Coalition",
            votes: 142,
            percentage: 33.5,
            status: "advanced",
            image: "/candidate2.jpg",
          },
          {
            id: 3,
            name: "Elena Rodriguez",
            party: "National Progress Party",
            votes: 98,
            percentage: 23.1,
            status: "eliminated",
            image: "/candidate3.jpg",
          },
          {
            id: 4,
            name: "Sir David Thompson",
            party: "Democratic Alliance",
            votes: 28,
            percentage: 6.6,
            status: "eliminated",
            image: "/candidate4.jpg",
          },
        ],
      },
      {
        round: 2,
        candidates: [
          {
            id: 1,
            name: "Dr. Sarah Johnson",
            party: "Independent",
            votes: 238,
            percentage: 56.1,
            status: "winner",
            image: "/candidate1.jpg",
          },
          {
            id: 2,
            name: "Hon. Michael Chen",
            party: "Unity Coalition",
            votes: 186,
            percentage: 43.9,
            status: "runner-up",
            image: "/candidate2.jpg",
          },
        ],
      },
    ],
    votingBreakdown: {
      byParty: [
        { party: "National Progress Party", votes: 145, percentage: 34.2 },
        { party: "Unity Coalition", votes: 132, percentage: 31.1 },
        { party: "Democratic Alliance", votes: 98, percentage: 23.1 },
        { party: "Independents", votes: 49, percentage: 11.6 },
      ],
      byRegion: [
        { region: "Northern MPs", votes: 112, turnout: 95.7 },
        { region: "Southern MPs", votes: 108, turnout: 96.4 },
        { region: "Eastern MPs", votes: 98, turnout: 94.2 },
        { region: "Western MPs", votes: 106, turnout: 97.2 },
      ],
    },
    winner: {
      id: 1,
      name: "Dr. Sarah Johnson",
      party: "Independent",
      finalVotes: 238,
      finalPercentage: 56.1,
      margin: 52,
      image: "/candidate1.jpg",
      biography:
        "Former Constitutional Law Professor with 15 years of parliamentary experience. PhD in Political Science and author of the Parliamentary Procedures Guide. Known for her impartiality and deep understanding of constitutional matters.",
      statement:
        "I am deeply honored by the trust my colleagues have placed in me. I pledge to uphold the dignity and integrity of this House, ensuring fair debate and adherence to our cherished parliamentary traditions.",
    },
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      winner: { color: "from-[#10B981] to-[#059669]", text: "ELECTED SPEAKER" },
      "runner-up": { color: "from-[#F59E0B] to-[#D97706]", text: "RUNNER-UP" },
      advanced: { color: "from-[#6C2BD9] to-[#9D5CFF]", text: "ADVANCED" },
      eliminated: { color: "from-[#6B7280] to-[#4B5563]", text: "ELIMINATED" },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r ${config.color} text-white`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <>
      <Header />

      <main className='min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-6xl mx-auto'>
          {/* Header Section */}
          <div className='text-center mb-12'>
            <div className='w-24 h-24 bg-linear-to-br from-[#10B981] to-[#059669] rounded-3xl flex items-center justify-center mx-auto mb-6'>
              <svg
                className='w-12 h-12 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z'
                />
              </svg>
            </div>
            <h1 className='text-4xl font-bold text-white mb-4'>
              Speaker of Parliament{" "}
              <span className='text-[#9D5CFF]'>Election Results</span>
            </h1>
            <p className='text-[#CCCCCC] text-lg max-w-2xl mx-auto'>
              Official results for the election of the Speaker of Parliament.
              Detailed breakdown of voting rounds and outcomes.
            </p>
          </div>

          {/* Winner Announcement */}
          <div className='bg-linear-to-r from-[#10B981] to-[#059669] rounded-2xl p-8 mb-8 text-center'>
            <div className='max-w-2xl mx-auto'>
              <div className='w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl font-bold text-gray-800'>
                  {electionData.winner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <h2 className='text-3xl font-bold text-white mb-2'>
                Congratulations!
              </h2>
              <h3 className='text-2xl font-bold text-white mb-2'>
                {electionData.winner.name}
              </h3>
              <p className='text-white/90 text-lg mb-4'>
                Has been elected as the new Speaker of Parliament
              </p>
              <div className='bg-white/20 rounded-lg p-4 inline-block'>
                <p className='text-white font-semibold'>
                  {electionData.winner.finalVotes} votes (
                  {electionData.winner.finalPercentage}%)
                </p>
              </div>
            </div>
          </div>

          {/* Election Statistics */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
              <div className='text-[#9D5CFF] font-bold text-2xl mb-1'>
                {electionData.totalVoters}
              </div>
              <p className='text-[#CCCCCC] text-sm'>Total MPs</p>
            </div>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
              <div className='text-white font-bold text-2xl mb-1'>
                {electionData.votesCast}
              </div>
              <p className='text-[#CCCCCC] text-sm'>Votes Cast</p>
            </div>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
              <div className='text-[#10B981] font-bold text-2xl mb-1'>
                {electionData.turnout}%
              </div>
              <p className='text-[#CCCCCC] text-sm'>Turnout</p>
            </div>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
              <div className='text-[#F59E0B] font-bold text-2xl mb-1'>
                {electionData.validVotes}
              </div>
              <p className='text-[#CCCCCC] text-sm'>Valid Votes</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 mb-8'>
            <div className='flex flex-wrap gap-2'>
              {[
                { id: "overview", label: "Election Overview" },
                { id: "round1", label: "First Round" },
                { id: "round2", label: "Second Round" },
                { id: "breakdown", label: "Voting Breakdown" },
                { id: "winner", label: "Speaker Profile" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#6C2BD9] text-white"
                      : "text-[#CCCCCC] hover:text-white hover:bg-[#2A2A2A]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Content */}
          <div className='space-y-8'>
            {/* Election Overview */}
            {activeTab === "overview" && (
              <div className='space-y-6'>
                <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-8'>
                  <h3 className='text-2xl font-semibold text-white mb-6 text-center'>
                    Election Summary
                  </h3>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Final Results */}
                    <div>
                      <h4 className='text-white font-semibold mb-4'>
                        Final Results
                      </h4>
                      <div className='space-y-4'>
                        {electionData.rounds[1].candidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className='bg-[#2A2A2A] rounded-xl p-4 border border-[#333333]'
                          >
                            <div className='flex items-center justify-between mb-2'>
                              <h5 className='text-white font-semibold'>
                                {candidate.name}
                              </h5>
                              {getStatusBadge(candidate.status)}
                            </div>
                            <p className='text-[#CCCCCC] text-sm mb-3'>
                              {candidate.party}
                            </p>
                            <div className='flex justify-between items-center'>
                              <span className='text-white font-bold text-lg'>
                                {candidate.votes} votes
                              </span>
                              <span className='text-[#10B981] font-semibold'>
                                {candidate.percentage}%
                              </span>
                            </div>
                            <div className='w-full bg-[#333333] rounded-full h-2 mt-2 overflow-hidden'>
                              <div
                                className='h-2 rounded-full bg-linear-to-r from-[#6C2BD9] to-[#9D5CFF]'
                                style={{ width: `${candidate.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Election Details */}
                    <div>
                      <h4 className='text-white font-semibold mb-4'>
                        Election Details
                      </h4>
                      <div className='bg-[#2A2A2A] rounded-xl p-6 border border-[#333333]'>
                        <div className='space-y-4'>
                          <div className='flex justify-between'>
                            <span className='text-[#CCCCCC]'>
                              Winning Margin:
                            </span>
                            <span className='text-white font-semibold'>
                              {electionData.winner.margin} votes
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-[#CCCCCC]'>
                              Invalid Votes:
                            </span>
                            <span className='text-[#F59E0B] font-semibold'>
                              {electionData.invalidVotes}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-[#CCCCCC]'>
                              Voting Rounds:
                            </span>
                            <span className='text-white font-semibold'>
                              {electionData.rounds.length}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-[#CCCCCC]'>
                              Initial Candidates:
                            </span>
                            <span className='text-white font-semibold'>
                              {electionData.rounds[0].candidates.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Round 1 Results */}
            {activeTab === "round1" && (
              <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
                  <h2 className='text-xl font-semibold text-white'>
                    First Round Results
                  </h2>
                  <p className='text-[#CCCCCC] text-sm'>
                    Initial voting with all four candidates
                  </p>
                </div>
                <div className='p-6'>
                  <div className='space-y-4'>
                    {electionData.rounds[0].candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className='bg-[#2A2A2A] rounded-xl border border-[#333333] p-6'
                      >
                        <div className='flex items-center justify-between mb-4'>
                          <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-linear-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-xl flex items-center justify-center'>
                              <span className='text-white font-bold'>
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <h3 className='text-white font-bold text-lg'>
                                {candidate.name}
                              </h3>
                              <p className='text-[#CCCCCC] text-sm'>
                                {candidate.party}
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
                                {candidate.votes}
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
            )}

            {/* Round 2 Results */}
            {activeTab === "round2" && (
              <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
                  <h2 className='text-xl font-semibold text-white'>
                    Second Round Results
                  </h2>
                  <p className='text-[#CCCCCC] text-sm'>
                    Final runoff between the top two candidates
                  </p>
                </div>
                <div className='p-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {electionData.rounds[1].candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className={`bg-[#2A2A2A] rounded-xl border-2 p-6 ${
                          candidate.status === "winner"
                            ? "border-[#10B981] shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                            : "border-[#333333]"
                        }`}
                      >
                        <div className='text-center'>
                          <div className='w-16 h-16 bg-linear-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-2xl flex items-center justify-center mx-auto mb-4'>
                            <span className='text-white font-bold text-lg'>
                              {candidate.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <h3 className='text-white font-bold text-xl mb-2'>
                            {candidate.name}
                          </h3>
                          <p className='text-[#CCCCCC] text-sm mb-4'>
                            {candidate.party}
                          </p>
                          {getStatusBadge(candidate.status)}
                        </div>

                        <div className='mt-6 space-y-3'>
                          <div className='flex justify-between items-center'>
                            <span className='text-[#CCCCCC]'>Votes:</span>
                            <span className='text-white font-bold text-2xl'>
                              {candidate.votes}
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-[#CCCCCC]'>Percentage:</span>
                            <span className='text-[#10B981] font-bold text-2xl'>
                              {candidate.percentage}%
                            </span>
                          </div>
                        </div>

                        <div className='w-full bg-[#333333] rounded-full h-4 mt-4 overflow-hidden'>
                          <div
                            className='h-4 rounded-full bg-linear-to-r from-[#6C2BD9] to-[#9D5CFF] transition-all duration-1000'
                            style={{ width: `${candidate.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Voting Breakdown */}
            {activeTab === "breakdown" && (
              <div className='space-y-6'>
                {/* By Party */}
                <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                  <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
                    <h3 className='text-xl font-semibold text-white'>
                      Voting Breakdown by Party
                    </h3>
                  </div>
                  <div className='p-6'>
                    <div className='space-y-4'>
                      {electionData.votingBreakdown.byParty.map(
                        (party, index) => (
                          <div
                            key={party.party}
                            className='flex items-center justify-between p-4 bg-[#2A2A2A] rounded-xl border border-[#333333]'
                          >
                            <span className='text-white font-medium'>
                              {party.party}
                            </span>
                            <div className='flex items-center gap-4'>
                              <span className='text-[#CCCCCC] text-sm'>
                                {party.votes} votes
                              </span>
                              <span className='text-[#10B981] font-semibold'>
                                {party.percentage}%
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* By Region */}
                <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                  <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
                    <h3 className='text-xl font-semibold text-white'>
                      Voting by MP Region
                    </h3>
                  </div>
                  <div className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {electionData.votingBreakdown.byRegion.map(
                        (region, index) => (
                          <div
                            key={region.region}
                            className='bg-[#2A2A2A] rounded-xl p-4 border border-[#333333]'
                          >
                            <h4 className='text-white font-semibold mb-2'>
                              {region.region}
                            </h4>
                            <div className='flex justify-between text-sm'>
                              <span className='text-[#CCCCCC]'>Votes:</span>
                              <span className='text-white'>{region.votes}</span>
                            </div>
                            <div className='flex justify-between text-sm'>
                              <span className='text-[#CCCCCC]'>Turnout:</span>
                              <span className='text-[#10B981]'>
                                {region.turnout}%
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Winner Profile */}
            {activeTab === "winner" && (
              <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                <div className='bg-linear-to-r from-[#10B981] to-[#059669] p-8 text-center'>
                  <div className='w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4'>
                    <span className='text-2xl font-bold text-gray-800'>
                      {electionData.winner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h2 className='text-3xl font-bold text-white mb-2'>
                    {electionData.winner.name}
                  </h2>
                  <p className='text-white/90 text-xl'>
                    Speaker of Parliament Elect
                  </p>
                </div>

                <div className='p-8'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    <div>
                      <h3 className='text-xl font-semibold text-white mb-4'>
                        Biography
                      </h3>
                      <p className='text-[#CCCCCC] leading-relaxed'>
                        {electionData.winner.biography}
                      </p>
                    </div>

                    <div>
                      <h3 className='text-xl font-semibold text-white mb-4'>
                        Election Statement
                      </h3>
                      <div className='bg-[#2A2A2A] rounded-xl p-6 border border-[#333333]'>
                        <p className='text-[#CCCCCC] italic leading-relaxed'>
                          "{electionData.winner.statement}"
                        </p>
                      </div>

                      <div className='mt-6 grid grid-cols-2 gap-4'>
                        <div className='bg-[#2A2A2A] rounded-xl p-4 text-center'>
                          <div className='text-[#10B981] font-bold text-2xl'>
                            {electionData.winner.finalVotes}
                          </div>
                          <p className='text-[#CCCCCC] text-sm'>Final Votes</p>
                        </div>
                        <div className='bg-[#2A2A2A] rounded-xl p-4 text-center'>
                          <div className='text-[#9D5CFF] font-bold text-2xl'>
                            {electionData.winner.finalPercentage}%
                          </div>
                          <p className='text-[#CCCCCC] text-sm'>Support</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default SpeakerResults;
