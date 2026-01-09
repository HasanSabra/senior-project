"use client";

import Header from "@/components/other/Header";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ELECTION_ADMIN_API } from "@/lib/api";

const AdminResults = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedElection, setSelectedElection] = useState("");
  const [selectedElectionType, setSelectedElectionType] = useState("");
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [calculationType, setCalculationType] = useState("");
  const [calculatedResults, setCalculatedResults] = useState(null);
  const [activeTab, setActiveTab] = useState("calculate");

  // Create RESULTS_ADMIN_API since it's not in your lib/api
  const RESULTS_ADMIN_API = {
    post: async (endpoint, data) => {
      const response = await fetch(
        `http://localhost:5001/api/admin/results${endpoint}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      return response.json();
    },
  };

  useEffect(() => {
    const userData = Cookies.get("user");
    let cookiesUser = null;

    if (userData) {
      cookiesUser = JSON.parse(userData);
    }

    if (cookiesUser?.role !== "admin") {
      window.location.href = "/dashboard";
      return;
    }

    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await ELECTION_ADMIN_API.get("/");

      if (!response.data.success) {
        setError(response.data.message);
        setLoading(false);
        return;
      }

      const electionsData = response.data.data || [];
      console.log("Fetched elections:", electionsData); // Debug log

      // Log election types to see what we're getting
      electionsData.forEach((election) => {
        console.log(
          `Election: ${election.name}, Type: ${election.election_type}, Type ID: ${election.election_type_id}`,
        );
      });

      setElections(electionsData);
      setLoading(false);
    } catch (err) {
      setError("Failed to load elections");
      setLoading(false);
    }
  };

  const handleElectionSelect = (electionId) => {
    setSelectedElection(electionId);
    setError(null);
    setSuccess(null);

    // Find the selected election to determine its type
    const election = elections.find((e) => e.id === parseInt(electionId));
    if (election) {
      console.log("Selected election:", election); // Debug log
      console.log("Election type string:", election.election_type); // Debug log
      console.log("Election type ID:", election.election_type_id); // Debug log

      // Try to determine election type from the election_type string
      const electionTypeStr = (election.election_type || "").toLowerCase();
      let electionTypeId = "";

      if (
        electionTypeStr.includes("municipality") ||
        electionTypeStr.includes("municipal")
      ) {
        electionTypeId = "2";
      } else if (
        electionTypeStr.includes("mayoral") ||
        electionTypeStr.includes("mayor")
      ) {
        electionTypeId = "1";
      } else if (
        electionTypeStr.includes("parliamentary") ||
        electionTypeStr.includes("parliament")
      ) {
        electionTypeId = "3";
      } else if (electionTypeStr.includes("speaker")) {
        electionTypeId = "4";
      } else {
        // Fallback to the actual ID if we have it
        electionTypeId = election.election_type_id?.toString() || "";
      }

      setSelectedElectionType(electionTypeId);
      console.log("Determined election type ID:", electionTypeId); // Debug log
    }
  };

  const getCalculationFunctionName = () => {
    switch (calculationType) {
      case "municipality":
        return "/calculate/municipality";
      case "mayoral":
        return "/calculate/mayoral";
      case "parliamentary":
        return "/calculate/parliamentary";
      case "speaker":
        return "/calculate/speaker";
      default:
        return "";
    }
  };

  const getCalculationDisplayName = () => {
    switch (calculationType) {
      case "municipality":
        return "Municipality Council";
      case "mayoral":
        return "Mayoral";
      case "parliamentary":
        return "Parliamentary";
      case "speaker":
        return "Speaker of Parliament";
      default:
        return "";
    }
  };

  // Helper function to determine election type from string
  const getElectionTypeFromString = (typeString) => {
    if (!typeString) return "";
    const typeLower = typeString.toLowerCase();

    if (typeLower.includes("municipality") || typeLower.includes("municipal")) {
      return "1";
    } else if (typeLower.includes("mayoral") || typeLower.includes("mayor")) {
      return "2";
    } else if (
      typeLower.includes("parliamentary") ||
      typeLower.includes("parliament")
    ) {
      return "3";
    } else if (typeLower.includes("speaker")) {
      return "4";
    }
    return "";
  };

  // Get display name for election type
  const getElectionTypeDisplayName = (election) => {
    const typeStr = election.election_type || "";
    const typeLower = typeStr.toLowerCase();

    if (typeLower.includes("municipality") || typeLower.includes("municipal")) {
      return "Municipality Council";
    } else if (typeLower.includes("mayoral") || typeLower.includes("mayor")) {
      return "Mayoral";
    } else if (
      typeLower.includes("parliamentary") ||
      typeLower.includes("parliament")
    ) {
      return "Parliamentary";
    } else if (typeLower.includes("speaker")) {
      return "Speaker of Parliament";
    }
    return typeStr || "Unknown";
  };

  const calculateResults = async () => {
    if (!selectedElection) {
      setError("Please select an election first");
      return;
    }

    if (!calculationType) {
      setError("Please select a calculation type");
      return;
    }

    try {
      setLoadingResults(true);
      setError(null);
      setSuccess(null);

      const response = await RESULTS_ADMIN_API.post(
        getCalculationFunctionName(),
        {
          election_id: parseInt(selectedElection),
        },
      );

      console.log("Calculation response:", response); // Debug log

      if (!response.message || response.message.includes("error")) {
        setError(response.message || "Failed to calculate results");
        setLoadingResults(false);
        return;
      }

      setCalculatedResults(response);
      setSuccess(
        `${getCalculationDisplayName()} results calculated successfully!`,
      );
      setShowResultsModal(true);
      setLoadingResults(false);
    } catch (err) {
      console.error("Calculation error:", err); // Debug log
      setError(err.message || "Failed to calculate results");
      setLoadingResults(false);
    }
  };

  const confirmCalculation = (type) => {
    setCalculationType(type);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    calculateResults();
  };

  const getStatusBadge = (election) => {
    if (!election.end_date) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
          <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
          NO END DATE
        </span>
      );
    }

    const endDate = new Date(election.end_date);
    const now = new Date();

    if (endDate > now) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
          ACTIVE
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
        COMPLETED
      </span>
    );
  };

  const getCalculationMethodDescription = (electionTypeId) => {
    switch (electionTypeId) {
      case "1":
        return "Municipality: List with most candidates determines seats";
      case "2":
        return "Mayoral: Simple majority (candidate with most votes wins)";
      case "3":
        return "Parliamentary: Proportional representation with Hare quota";
      case "4":
        return "Speaker: Shia candidate with absolute majority of MPs";
      default:
        // Try to guess from election name/type
        const election = elections.find(
          (e) => e.id === parseInt(selectedElection),
        );
        if (election) {
          const typeStr = (election.election_type || "").toLowerCase();
          if (typeStr.includes("municipal"))
            return "Municipality: List with most candidates determines seats";
          if (typeStr.includes("mayoral") || typeStr.includes("mayor"))
            return "Mayoral: Simple majority (candidate with most votes wins)";
          if (typeStr.includes("parliament"))
            return "Parliamentary: Proportional representation with Hare quota";
          if (typeStr.includes("speaker"))
            return "Speaker: Shia candidate with absolute majority of MPs";
        }
        return "Unknown calculation method";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const ElectionCard = ({ election }) => (
    <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">
            {election.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#CCCCCC] text-sm">
              {getElectionTypeDisplayName(election)}
            </span>
            <span className="text-[#888888]">•</span>
            <span className="text-[#CCCCCC] text-sm">
              {formatDate(election.start_date)} -{" "}
              {formatDate(election.end_date)}
            </span>
          </div>
          {election.governorate_id && (
            <p className="text-[#888888] text-sm">
              Location:{" "}
              {election.governorate_name ||
                `Governorate ${election.governorate_id}`}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="mb-2">{getStatusBadge(election)}</div>
          {election.is_active && (
            <p className="text-[#CCCCCC] text-sm">Active</p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-[#333333]">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              handleElectionSelect(election.id.toString());
              setActiveTab("calculate");
            }}
            className="px-4 py-2 bg-[#6C2BD9] hover:bg-[#9D5CFF] text-white rounded-lg text-sm font-medium transition-colors"
          >
            Calculate Results
          </button>
        </div>
      </div>
    </div>
  );

  const ResultsTable = ({ results }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#333333]">
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
              Candidate
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
              List
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
              Votes
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#333333]">
          {results.winner_candidates?.map((candidate, index) => (
            <tr
              key={candidate.candidate_id || index}
              className="hover:bg-[#2A2A2A] transition-colors"
            >
              <td className="px-4 py-3">
                <div className="text-white font-medium">
                  {candidate.name || `Candidate ${index + 1}`}
                </div>
                <div className="text-[#888888] text-sm">
                  ID: {candidate.candidate_id || "N/A"}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-[#CCCCCC]">
                  {candidate.list_name || `List ${candidate.list_id || "N/A"}`}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-white font-semibold">
                  {candidate.vote_count?.toLocaleString() || "N/A"}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                  ELECTED
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-[#333333] border-t-[#9D5CFF] rounded-full animate-spin"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Election <span className="text-[#9D5CFF]">Results</span>
            </h1>
            <p className="text-[#CCCCCC] text-lg">
              Calculate and manage election results
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-1 mb-8">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("calculate")}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex-1 ${
                  activeTab === "calculate"
                    ? "bg-[#6C2BD9] text-white"
                    : "text-[#CCCCCC] hover:text-white hover:bg-[#2A2A2A]"
                }`}
              >
                Calculate Results
              </button>
              <button
                onClick={() => setActiveTab("guide")}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex-1 ${
                  activeTab === "guide"
                    ? "bg-[#6C2BD9] text-white"
                    : "text-[#CCCCCC] hover:text-white hover:bg-[#2A2A2A]"
                }`}
              >
                Calculation Guide
              </button>
            </div>
          </div>

          {/* Calculate Results Tab */}
          {activeTab === "calculate" && (
            <div className="space-y-8">
              {/* Election Selection */}
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Select Election
                </h2>
                <div className="mb-6">
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Choose Election to Calculate Results
                  </label>
                  <select
                    value={selectedElection}
                    onChange={(e) => handleElectionSelect(e.target.value)}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                  >
                    <option value="">Select an election</option>
                    {elections
                      .filter((election) => {
                        // Only show completed elections
                        if (!election.end_date) return false;
                        const endDate = new Date(election.end_date);
                        const now = new Date();
                        return endDate < now;
                      })
                      .map((election) => (
                        <option key={election.id} value={election.id}>
                          {election.name} (
                          {getElectionTypeDisplayName(election)}) - Ended{" "}
                          {formatDate(election.end_date)}
                        </option>
                      ))}
                  </select>
                </div>

                {selectedElection && (
                  <div className="bg-[#2A2A2A] rounded-xl p-4 mb-6">
                    <h3 className="text-white font-semibold mb-2">
                      Selected Election
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[#CCCCCC] text-sm">Election Type</p>
                        <p className="text-white font-medium">
                          {getElectionTypeDisplayName(
                            elections.find(
                              (e) => e.id === parseInt(selectedElection),
                            ),
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#CCCCCC] text-sm">
                          Calculation Method
                        </p>
                        <p className="text-white font-medium">
                          {getCalculationMethodDescription(
                            selectedElectionType,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Calculation Methods */}
              {selectedElection && (
                <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Calculate Results
                  </h2>

                  {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 text-sm">{success}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Municipality Results */}
                    <div className="bg-[#2A2A2A] border border-[#333333] rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">
                          Municipality Council
                        </h3>
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-blue-400"
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
                      </div>
                      <p className="text-[#CCCCCC] text-sm mb-4">
                        Calculates winners based on the list with most
                        candidates. Top candidates from all lists win seats.
                      </p>
                      <button
                        onClick={() => confirmCalculation("municipality")}
                        disabled={loadingResults}
                        className={`w-full px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${
                          getCalculationMethodDescription(
                            selectedElectionType,
                          ).includes("Municipality")
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {loadingResults
                          ? "Calculating..."
                          : getCalculationMethodDescription(
                                selectedElectionType,
                              ).includes("Municipality")
                            ? "Calculate Municipality Results"
                            : "Not applicable for this election type"}
                      </button>
                    </div>

                    {/* Mayoral Results */}
                    <div className="bg-[#2A2A2A] border border-[#333333] rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">
                          Mayoral Election
                        </h3>
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5.121 17.804A10.94 10.94 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-[#CCCCCC] text-sm mb-4">
                        Simple majority calculation. Candidate with the most
                        votes wins the mayoral position.
                      </p>
                      <button
                        onClick={() => confirmCalculation("mayoral")}
                        disabled={loadingResults}
                        className={`w-full px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${
                          getCalculationMethodDescription(
                            selectedElectionType,
                          ).includes("Mayoral")
                            ? "bg-purple-500 hover:bg-purple-600"
                            : "bg-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {loadingResults
                          ? "Calculating..."
                          : getCalculationMethodDescription(
                                selectedElectionType,
                              ).includes("Mayoral")
                            ? "Calculate Mayoral Results"
                            : "Not applicable for this election type"}
                      </button>
                    </div>

                    {/* Parliamentary Results */}
                    <div className="bg-[#2A2A2A] border border-[#333333] rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">
                          Parliamentary Election
                        </h3>
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-[#CCCCCC] text-sm mb-4">
                        Proportional representation using Hare quota with
                        sectarian seat allocations.
                      </p>
                      <button
                        onClick={() => confirmCalculation("parliamentary")}
                        disabled={loadingResults}
                        className={`w-full px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${
                          getCalculationMethodDescription(
                            selectedElectionType,
                          ).includes("Parliamentary")
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {loadingResults
                          ? "Calculating..."
                          : getCalculationMethodDescription(
                                selectedElectionType,
                              ).includes("Parliamentary")
                            ? "Calculate Parliamentary Results"
                            : "Not applicable for this election type"}
                      </button>
                    </div>

                    {/* Speaker Results */}
                    <div className="bg-[#2A2A2A] border border-[#333333] rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">
                          Speaker Election
                        </h3>
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-[#CCCCCC] text-sm mb-4">
                        Special election for Speaker. Must be Shia candidate
                        with absolute majority of MPs.
                      </p>
                      <button
                        onClick={() => confirmCalculation("speaker")}
                        disabled={loadingResults}
                        className={`w-full px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${
                          getCalculationMethodDescription(
                            selectedElectionType,
                          ).includes("Speaker")
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {loadingResults
                          ? "Calculating..."
                          : getCalculationMethodDescription(
                                selectedElectionType,
                              ).includes("Speaker")
                            ? "Calculate Speaker Results"
                            : "Not applicable for this election type"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Calculation Guide Tab */}
          {activeTab === "guide" && (
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Election Calculation Guide
              </h2>

              <div className="space-y-6">
                {/* Municipality Guide */}
                <div className="bg-[#2A2A2A] border border-[#333333] rounded-xl p-5">
                  <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    Municipality Council Elections
                  </h3>
                  <div className="space-y-3">
                    <p className="text-[#CCCCCC]">
                      <strong>Method:</strong> The list with the highest number
                      of approved candidates determines the number of seats.
                    </p>
                    <p className="text-[#CCCCCC]">
                      <strong>Process:</strong>
                    </p>
                    <ol className="text-[#CCCCCC] list-decimal list-inside space-y-2 ml-4">
                      <li>Find the list with most candidates</li>
                      <li>
                        Use that list's seats_number as total available seats
                      </li>
                      <li>
                        Select top candidates from ALL lists based on vote
                        counts
                      </li>
                      <li>Top N candidates win seats (N = seats_number)</li>
                    </ol>
                    <p className="text-[#CCCCCC]">
                      <strong>Note:</strong> This ensures proportional
                      representation while maintaining list integrity.
                    </p>
                  </div>
                </div>

                {/* Mayoral Guide */}
                <div className="bg-[#2A2A2A] border border-[#333333] rounded-xl p-5">
                  <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                    Mayoral Elections
                  </h3>
                  <div className="space-y-3">
                    <p className="text-[#CCCCCC]">
                      <strong>Method:</strong> Simple majority
                      (first-past-the-post).
                    </p>
                    <p className="text-[#CCCCCC]">
                      <strong>Process:</strong>
                    </p>
                    <ol className="text-[#CCCCCC] list-decimal list-inside space-y-2 ml-4">
                      <li>Count votes for each candidate</li>
                      <li>Candidate with highest votes wins</li>
                      <li>No quota or percentage thresholds required</li>
                    </ol>
                    <p className="text-[#CCCCCC]">
                      <strong>Note:</strong> Used for single-winner executive
                      positions.
                    </p>
                  </div>
                </div>

                {/* Parliamentary Guide */}
                <div className="bg-[#2A2A2A] border border-[#333333] rounded-xl p-5">
                  <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    Parliamentary Elections
                  </h3>
                  <div className="space-y-3">
                    <p className="text-[#CCCCCC]">
                      <strong>Method:</strong> Proportional representation using
                      Hare quota with sectarian allocations.
                    </p>
                    <p className="text-[#CCCCCC]">
                      <strong>Process:</strong>
                    </p>
                    <ol className="text-[#CCCCCC] list-decimal list-inside space-y-2 ml-4">
                      <li>
                        Calculate total valid votes and Hare quota (total votes
                        ÷ total seats)
                      </li>
                      <li>
                        Allocate initial seats to lists using quota (votes ÷
                        quota)
                      </li>
                      <li>
                        Distribute remaining seats using largest remainder
                        method
                      </li>
                      <li>
                        Apply sectarian seat allocations within constituencies
                      </li>
                      <li>
                        Select winning candidates based on preferential votes
                        within denominations
                      </li>
                    </ol>
                    <p className="text-[#CCCCCC]">
                      <strong>Note:</strong> This complex system ensures both
                      proportional representation and sectarian balance as per
                      Lebanese law.
                    </p>
                  </div>
                </div>

                {/* Speaker Guide */}
                <div className="bg-[#2A2A2A] border border-[#333333] rounded-xl p-5">
                  <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    Speaker of Parliament Election
                  </h3>
                  <div className="space-y-3">
                    <p className="text-[#CCCCCC]">
                      <strong>Method:</strong> Special election restricted to
                      Shia candidates with absolute majority.
                    </p>
                    <p className="text-[#CCCCCC]">
                      <strong>Process:</strong>
                    </p>
                    <ol className="text-[#CCCCCC] list-decimal list-inside space-y-2 ml-4">
                      <li>
                        Only Shia candidates are eligible (National Pact
                        requirement)
                      </li>
                      <li>Requires absolute majority of MPs (50% + 1)</li>
                      <li>
                        If no candidate gets majority, additional rounds may be
                        held
                      </li>
                      <li>In practice, determined by political consensus</li>
                    </ol>
                    <p className="text-[#CCCCCC]">
                      <strong>Note:</strong> Speaker is elected from among
                      sitting MPs and traditionally goes to a Shia Muslim per
                      Lebanon's confessional system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Elections List (for reference) */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Completed Elections
            </h2>
            {elections.filter((election) => {
              if (!election.end_date) return false;
              const endDate = new Date(election.end_date);
              const now = new Date();
              return endDate < now;
            }).length === 0 ? (
              <div className="text-center py-12 bg-[#1A1A1A] rounded-2xl border border-[#333333]">
                <div className="w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center mx-auto mb-4">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  No Completed Elections
                </h3>
                <p className="text-[#888888]">
                  Elections that have ended will appear here for result
                  calculation
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {elections
                  .filter((election) => {
                    if (!election.end_date) return false;
                    const endDate = new Date(election.end_date);
                    const now = new Date();
                    return endDate < now;
                  })
                  .map((election) => (
                    <ElectionCard key={election.id} election={election} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Results Modal */}
      {showResultsModal && calculatedResults && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-[#6C2BD9] to-[#9D5CFF] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Election Results - {getCalculationDisplayName()}
              </h2>
              <button
                onClick={() => setShowResultsModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Results Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#2A2A2A] rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2">
                    Calculation Results
                  </h3>
                  <p className="text-[#CCCCCC]">
                    <strong>Status:</strong>{" "}
                    {calculatedResults.message || "Success"}
                  </p>
                  <p className="text-[#CCCCCC]">
                    <strong>Total Winners:</strong>{" "}
                    {calculatedResults.winner_candidates?.length || 0}
                  </p>
                </div>

                {calculatedResults.seats_determining_list && (
                  <div className="bg-[#2A2A2A] rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">
                      Seat Determination
                    </h3>
                    <p className="text-[#CCCCCC]">
                      <strong>Determining List:</strong>{" "}
                      {calculatedResults.seats_determining_list.name}
                    </p>
                    <p className="text-[#CCCCCC]">
                      <strong>Seats Available:</strong>{" "}
                      {calculatedResults.seats_determining_list.seats_number}
                    </p>
                  </div>
                )}

                {calculatedResults.election_info && (
                  <div className="bg-[#2A2A2A] rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">
                      Election Information
                    </h3>
                    <p className="text-[#CCCCCC]">
                      <strong>Constituency:</strong>{" "}
                      {calculatedResults.election_info.constituency_name ||
                        "N/A"}
                    </p>
                    <p className="text-[#CCCCCC]">
                      <strong>Total Votes:</strong>{" "}
                      {calculatedResults.election_info.total_votes?.toLocaleString() ||
                        "N/A"}
                    </p>
                    {calculatedResults.election_info.hare_quota && (
                      <p className="text-[#CCCCCC]">
                        <strong>Hare Quota:</strong>{" "}
                        {calculatedResults.election_info.hare_quota}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Winner Candidates Table */}
              {calculatedResults.winner_candidates &&
                calculatedResults.winner_candidates.length > 0 && (
                  <div className="bg-[#2A2A2A] rounded-xl p-6 mb-6">
                    <h3 className="text-white font-semibold text-lg mb-4">
                      Elected Candidates
                    </h3>
                    <ResultsTable results={calculatedResults} />
                  </div>
                )}

              {/* List Results (for parliamentary) */}
              {calculatedResults.list_results &&
                calculatedResults.list_results.length > 0 && (
                  <div className="bg-[#2A2A2A] rounded-xl p-6 mb-6">
                    <h3 className="text-white font-semibold text-lg mb-4">
                      List Results
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#333333]">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                              List Name
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                              Votes
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                              Quota Seats
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                              Remainder
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                              Total Seats
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#333333]">
                          {calculatedResults.list_results.map((list, index) => (
                            <tr
                              key={list.list_id || index}
                              className="hover:bg-[#333333] transition-colors"
                            >
                              <td className="px-4 py-3">
                                <div className="text-white font-medium">
                                  {list.list_name || `List ${index + 1}`}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-[#CCCCCC]">
                                  {list.total_votes?.toLocaleString() || "0"}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-white font-semibold">
                                  {list.quota_seats || 0}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-[#CCCCCC]">
                                  {list.remainder_votes || 0}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-white font-bold">
                                  {list.final_seats || 0}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-[#333333]">
                <button
                  onClick={() => setShowResultsModal(false)}
                  className="px-6 py-3 border border-[#333333] text-[#CCCCCC] hover:text-white rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Download results as JSON
                    const dataStr = JSON.stringify(calculatedResults, null, 2);
                    const dataUri =
                      "data:application/json;charset=utf-8," +
                      encodeURIComponent(dataStr);
                    const exportFileDefaultName = `election-results-${new Date().toISOString()}.json`;

                    const linkElement = document.createElement("a");
                    linkElement.setAttribute("href", dataUri);
                    linkElement.setAttribute("download", exportFileDefaultName);
                    linkElement.click();
                  }}
                  className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-medium transition-colors"
                >
                  Download Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] w-full max-w-md">
            <div className="p-6">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 text-center">
                Confirm Calculation
              </h3>
              <p className="text-[#CCCCCC] mb-6 text-center">
                Are you sure you want to calculate{" "}
                {getCalculationDisplayName().toLowerCase()} results? This action
                will overwrite any existing results for this election.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-[#333333] text-[#CCCCCC] hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                >
                  Calculate Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminResults;
