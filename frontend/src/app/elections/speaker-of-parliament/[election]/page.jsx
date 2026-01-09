"use client";

import React, { useState } from "react";
import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";
import PrimaryBTN from "@/components/other/PrimaryBTN";

const SpeakerElection = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const candidates = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      party: "Independent",
      experience:
        "Former Constitutional Law Professor, 15 years parliamentary experience",
      qualifications:
        "PhD in Political Science, Author of Parliamentary Procedures Guide",
      image: "/candidate1.jpg",
    },
    {
      id: 2,
      name: "Hon. Michael Chen",
      party: "Unity Coalition",
      experience:
        "Served as Deputy Speaker for 8 years, Former Minister of Justice",
      qualifications: "Law Degree, Certified Mediator, Fluent in 4 languages",
      image: "/candidate2.jpg",
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      party: "National Progress Party",
      experience: "Chair of Parliamentary Ethics Committee, 12 years as MP",
      qualifications:
        "Masters in Public Administration, International Relations Expert",
      image: "/candidate3.jpg",
    },
    {
      id: 4,
      name: "Sir David Thompson",
      party: "Democratic Alliance",
      experience:
        "Former Chief Justice, Parliamentary Legal Advisor for 10 years",
      qualifications: "Former Chief Justice, Constitutional Law Expert",
      image: "/candidate4.jpg",
    },
  ];

  const handleVote = () => {
    if (selectedCandidate) {
      setHasVoted(true);
      const candidate = candidates.find((c) => c.id === selectedCandidate);
      // Add your vote submission logic here
    }
  };

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
                Vote for Speaker Submitted!
              </h1>
              <p className="text-[#CCCCCC] text-lg mb-6">
                Your vote for the Speaker of Parliament has been recorded
                securely.
              </p>
              <div className="bg-[#2A2A2A] rounded-xl p-6 border border-[#9D5CFF] max-w-md mx-auto mb-6">
                <p className="text-[#9D5CFF] font-semibold mb-2">
                  Your Selection:
                </p>
                <p className="text-white text-xl font-bold">
                  {candidates.find((c) => c.id === selectedCandidate)?.name}
                </p>
                <p className="text-[#CCCCCC] text-sm">
                  {candidates.find((c) => c.id === selectedCandidate)?.party}
                </p>
              </div>
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
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-linear-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Election for{" "}
              <span className="text-[#9D5CFF]">Speaker of Parliament</span>
            </h1>
            <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto mb-6">
              Select one candidate to serve as the Speaker of Parliament. The
              Speaker will preside over parliamentary sessions and maintain
              order and decorum.
            </p>

            {/* Election Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center">
                <div className="text-[#9D5CFF] font-bold text-2xl mb-2">1</div>
                <p className="text-[#CCCCCC] text-sm">Vote Required</p>
              </div>
              <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center">
                <div className="text-white font-bold text-2xl mb-2">
                  {candidates.length}
                </div>
                <p className="text-[#CCCCCC] text-sm">Candidates</p>
              </div>
              <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center">
                <div className="text-[#10B981] font-bold text-2xl mb-2">
                  {selectedCandidate ? "1" : "0"}
                </div>
                <p className="text-[#CCCCCC] text-sm">Selected</p>
              </div>
            </div>
          </div>

          {/* Voting Instructions */}
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#6C2BD9] rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-white"
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
                <h3 className="text-white font-semibold text-lg mb-2">
                  About the Speaker's Role
                </h3>
                <p className="text-[#CCCCCC] text-sm">
                  The Speaker of Parliament presides over parliamentary debates,
                  maintains order, interprets parliamentary rules, and
                  represents the parliament to the outside world. Select the
                  candidate you believe is most qualified to uphold the dignity
                  and integrity of this important office.
                </p>
              </div>
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`bg-[#1A1A1A] rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${
                  selectedCandidate === candidate.id
                    ? "border-[#9D5CFF] shadow-[0_0_30px_rgba(157,92,255,0.3)] bg-[#6C2BD9]/5"
                    : "border-[#333333] hover:border-[#666666] hover:bg-[#2A2A2A]"
                }`}
                onClick={() => setSelectedCandidate(candidate.id)}
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Candidate Image */}
                  <div className="shrink-0">
                    <div className="w-20 h-20 bg-linear-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-2xl flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#2A2A2A] rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-white font-bold text-xl mb-1">
                          {candidate.name}
                        </h3>
                        <span className="inline-block bg-[#333333] text-[#CCCCCC] px-3 py-1 rounded-full text-sm font-medium">
                          {candidate.party}
                        </span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedCandidate === candidate.id
                            ? "border-[#9D5CFF] bg-[#9D5CFF]"
                            : "border-[#666666]"
                        }`}
                      >
                        {selectedCandidate === candidate.id && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-[#9D5CFF] font-semibold text-sm mb-1">
                          Experience
                        </h4>
                        <p className="text-[#CCCCCC] text-sm">
                          {candidate.experience}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[#9D5CFF] font-semibold text-sm mb-1">
                          Qualifications
                        </h4>
                        <p className="text-[#CCCCCC] text-sm">
                          {candidate.qualifications}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vote Confirmation */}
          <div className="text-center">
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-white mb-6">
                {selectedCandidate
                  ? "Confirm Your Selection"
                  : "Select a Candidate"}
              </h3>

              {selectedCandidate && (
                <div className="mb-8">
                  <div className="bg-[#2A2A2A] rounded-xl p-6 border border-[#9D5CFF] mb-4">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-linear-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-2xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {candidates
                            .find((c) => c.id === selectedCandidate)
                            ?.name.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="text-left">
                        <h4 className="text-white font-bold text-xl">
                          {
                            candidates.find((c) => c.id === selectedCandidate)
                              ?.name
                          }
                        </h4>
                        <p className="text-[#CCCCCC]">
                          {
                            candidates.find((c) => c.id === selectedCandidate)
                              ?.party
                          }
                        </p>
                      </div>
                    </div>
                    <p className="text-[#CCCCCC] text-sm text-center">
                      "I pledge to uphold the dignity and integrity of the
                      Parliament"
                    </p>
                  </div>
                </div>
              )}

              <PrimaryBTN
                text={
                  selectedCandidate
                    ? "Cast Vote for Speaker"
                    : "Select a Candidate to Vote"
                }
                onClickFunc={handleVote}
                disabled={!selectedCandidate}
              />

              <p className="text-[#888888] text-sm mt-4">
                Your vote is final and cannot be changed once submitted
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default SpeakerElection;
