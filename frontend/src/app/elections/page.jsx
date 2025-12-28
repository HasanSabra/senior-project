"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";
import PrimaryBTN from "@/components/other/PrimaryBTN";

import { ELECTION_USER_API } from "@/lib/api";
import { electionTypes } from "@/models/data";

const Elections = () => {
  const [electionsData, setElectionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    active: 0,
    upcoming: 0,
    completed: 0,
    total: 0,
  });

  // Fetch elections from API
  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await ELECTION_USER_API.get("/");

      if (!response.data.success) {
        setError(data.message || "Failed to load elections");
        return;
      }
      setElectionsData(response.data.data);
      calculateStats(response.data.data);
    } catch (err) {
      console.error("Error fetching elections:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from election data
  const calculateStats = (elections) => {
    const now = new Date();
    const activeElections = elections.filter((election) => {
      const startDate = new Date(election.start_date);
      const endDate = new Date(election.end_date);
      return election.is_active && startDate <= now && endDate >= now;
    });

    const upcomingElections = elections.filter((election) => {
      const startDate = new Date(election.start_date);
      return startDate > now;
    });

    const completedElections = elections.filter((election) => {
      const endDate = new Date(election.end_date);
      return endDate < now;
    });

    setStats({
      active: activeElections.length,
      upcoming: upcomingElections.length,
      completed: completedElections.length,
      total: elections.length,
    });
  };

  const getStatusBadge = (election) => {
    const now = new Date();
    const startDate = new Date(election.start_date);
    const endDate = new Date(election.end_date);

    if (!election.is_active) {
      return (
        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30'>
          <span className='w-2 h-2 bg-red-400 rounded-full mr-2'></span>
          Inactive
        </span>
      );
    }

    if (now < startDate) {
      return (
        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30'>
          <span className='w-2 h-2 bg-blue-400 rounded-full mr-2'></span>
          Upcoming
        </span>
      );
    }

    if (now > endDate) {
      return (
        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30'>
          <span className='w-2 h-2 bg-gray-400 rounded-full mr-2'></span>
          Completed
        </span>
      );
    }

    return (
      <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30'>
        <span className='w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse'></span>
        Active
      </span>
    );
  };

  const getTypeBadge = (typeId) => {
    const typeMap = {
      1: { name: "Speaker", color: "from-[#6C2BD9] to-[#9D5CFF]" },
      2: { name: "Parliamentary", color: "from-[#10B981] to-[#059669]" },
      3: { name: "Municipal", color: "from-[#F59E0B] to-[#D97706]" },
      4: { name: "Mayoral", color: "from-[#3B82F6] to-[#1D4ED8]" },
    };

    const type = typeMap[typeId] || {
      name: "Unknown",
      color: "from-[#6B7280] to-[#4B5563]",
    };

    return (
      <span
        className={`bg-gradient-to-r ${type.color} text-white px-3 py-1 rounded-full text-sm font-medium`}
      >
        {type.name}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleElectionAction = (election) => {
    const now = new Date();
    const startDate = new Date(election.start_date);
    const endDate = new Date(election.end_date);

    if (!election.is_active) {
      alert("This election is currently inactive.");
      return;
    }

    if (now < startDate) {
      alert(`This election starts on ${formatDate(election.start_date)}`);
      return;
    }

    if (now > endDate) {
      // Redirect to results page
      window.location.href = `/elections/results/${election.id}`;
      return;
    }

    const electionType = Object.fromEntries(
      electionTypes.map((type) => [type.id, type.type]),
    );

    // Redirect to voting page
    window.location.href = `/elections/${electionType[
      election.election_type_id
    ].toLowerCase()}/${election.id}`;
  };

  const getActionButtonText = (election) => {
    const now = new Date();
    const startDate = new Date(election.start_date);
    const endDate = new Date(election.end_date);

    if (!election.is_active) return "View Details";
    if (now < startDate) return "View Details";
    if (now > endDate) return "View Results";
    return "Vote Now";
  };

  const isActionEnabled = (election) => {
    const now = new Date();
    const startDate = new Date(election.start_date);
    const endDate = new Date(election.end_date);

    if (!election.is_active) return true;
    if (now >= startDate && now <= endDate) return true;
    if (now > endDate) return true;
    return true; // Allow viewing details for upcoming elections
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className='min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-7xl mx-auto'>
            {/* Loading Header */}
            <div className='mb-12 text-center'>
              <div className='h-10 bg-[#333333] rounded w-64 mx-auto mb-4 animate-pulse'></div>
              <div className='h-6 bg-[#333333] rounded w-3/4 mx-auto mb-8 animate-pulse'></div>
            </div>

            {/* Loading Table */}
            <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] shadow-2xl overflow-hidden'>
              <div className='p-6'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='flex items-center justify-between p-4 border-b border-[#333333] last:border-b-0'
                  >
                    <div className='space-y-2'>
                      <div className='h-6 bg-[#333333] rounded w-48 animate-pulse'></div>
                      <div className='h-4 bg-[#333333] rounded w-32 animate-pulse'></div>
                    </div>
                    <div className='h-8 bg-[#333333] rounded w-24 animate-pulse'></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Loading Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 animate-pulse'
                >
                  <div className='h-12 w-12 bg-[#333333] rounded-xl mx-auto mb-4'></div>
                  <div className='h-6 bg-[#333333] rounded w-3/4 mx-auto mb-2'></div>
                  <div className='h-4 bg-[#333333] rounded w-1/2 mx-auto'></div>
                </div>
              ))}
            </div>
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
                Error Loading Elections
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

  return (
    <>
      <Header />

      <main className='min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Header Section */}
          <div className='mb-12 text-center'>
            <h1 className='text-4xl font-bold text-white mb-4'>
              Current <span className='text-[#9D5CFF]'>Elections</span>
            </h1>
            <p className='text-[#CCCCCC] text-lg max-w-2xl mx-auto'>
              View all ongoing and upcoming elections. Participate in active
              elections or review past results.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <div className='bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-2xl p-6 text-center hover:border-[#9D5CFF] transition-all duration-300'>
              <div className='w-12 h-12 bg-gradient-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-xl flex items-center justify-center mx-auto mb-4'>
                <span className='text-white font-bold text-lg'>
                  {stats.active}
                </span>
              </div>
              <h3 className='text-white font-semibold mb-2'>
                Active Elections
              </h3>
              <p className='text-[#888888] text-sm'>
                Currently open for voting
              </p>
            </div>

            <div className='bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-2xl p-6 text-center hover:border-[#10B981] transition-all duration-300'>
              <div className='w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center mx-auto mb-4'>
                <span className='text-white font-bold text-lg'>
                  {stats.completed}
                </span>
              </div>
              <h3 className='text-white font-semibold mb-2'>Completed</h3>
              <p className='text-[#888888] text-sm'>Elections with results</p>
            </div>

            <div className='bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-2xl p-6 text-center hover:border-[#F59E0B] transition-all duration-300'>
              <div className='w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center mx-auto mb-4'>
                <span className='text-white font-bold text-lg'>
                  {stats.upcoming}
                </span>
              </div>
              <h3 className='text-white font-semibold mb-2'>Upcoming</h3>
              <p className='text-[#888888] text-sm'>Scheduled elections</p>
            </div>
          </div>

          {/* Elections Table */}
          <div className='bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-2xl border border-[#333333] shadow-2xl overflow-hidden'>
            {/* Table Header */}
            <div className='px-6 py-4 border-b border-[#333333] bg-gradient-to-r from-[#2A2A2A] to-[#333333]'>
              <h2 className='text-xl font-semibold text-white'>
                Election Overview
              </h2>
              <p className='text-[#888888] text-sm mt-1'>
                Total: {stats.total} elections found
              </p>
            </div>

            {/* Table Container */}
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-[#333333] bg-[#2A2A2A]'>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-[#CCCCCC] uppercase tracking-wider'>
                      Election Name
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-[#CCCCCC] uppercase tracking-wider'>
                      Type
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-[#CCCCCC] uppercase tracking-wider'>
                      Start Date
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-[#CCCCCC] uppercase tracking-wider'>
                      End Date
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-[#CCCCCC] uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-[#CCCCCC] uppercase tracking-wider'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-[#333333]'>
                  {electionsData.length === 0 ? (
                    <tr>
                      <td colSpan='6' className='px-6 py-12 text-center'>
                        <div className='flex flex-col items-center justify-center'>
                          <div className='w-16 h-16 bg-[#333333] rounded-xl flex items-center justify-center mb-4'>
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
                                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                              />
                            </svg>
                          </div>
                          <h3 className='text-white font-semibold text-lg mb-2'>
                            No Elections Found
                          </h3>
                          <p className='text-[#888888] text-sm'>
                            There are no elections scheduled at this time.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    electionsData.map((election) => (
                      <tr
                        key={election.id}
                        className='hover:bg-[#2A2A2A]/50 transition-colors duration-200'
                      >
                        <td className='px-6 py-4'>
                          <div>
                            <div className='text-white font-medium text-base'>
                              {election.name}
                            </div>
                            {election.governorate_id && (
                              <div className='text-[#888888] text-sm mt-1'>
                                {/* You could fetch and display location names here */}
                                Location ID: {election.governorate_id}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          {getTypeBadge(election.election_type_id)}
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-[#CCCCCC]'>
                            {formatDate(election.start_date)}
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-[#CCCCCC]'>
                            {formatDate(election.end_date)}
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          {getStatusBadge(election)}
                        </td>
                        <td className='px-6 py-4'>
                          <button
                            onClick={() => handleElectionAction(election)}
                            disabled={!isActionEnabled(election)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 min-w-[120px] ${
                              isActionEnabled(election)
                                ? "bg-gradient-to-r from-[#6C2BD9] to-[#9D5CFF] hover:from-[#7D3BE9] hover:to-[#AD6CFF] text-white transform hover:scale-105 cursor-pointer"
                                : "bg-[#333333] text-[#888888] cursor-not-allowed"
                            }`}
                          >
                            {getActionButtonText(election)}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {electionsData.length > 0 && (
              <div className='px-6 py-4 border-t border-[#333333] bg-[#2A2A2A]'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                  <p className='text-[#888888] text-sm'>
                    Showing {electionsData.length} of {electionsData.length}{" "}
                    elections • Last updated: {new Date().toLocaleDateString()}
                  </p>
                  <div className='flex space-x-2'>
                    <button
                      className='px-4 py-2 bg-[#333333] text-[#CCCCCC] rounded-lg text-sm hover:bg-[#444444] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                      disabled={true}
                    >
                      <svg
                        className='w-4 h-4 inline mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 19l-7-7 7-7'
                        />
                      </svg>
                      Previous
                    </button>
                    <button
                      className='px-4 py-2 bg-gradient-to-r from-[#6C2BD9] to-[#9D5CFF] text-white rounded-lg text-sm hover:from-[#7D3BE9] hover:to-[#AD6CFF] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                      disabled={true}
                    >
                      Next
                      <svg
                        className='w-4 h-4 inline ml-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className='mt-12 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-2xl p-8'>
            <h3 className='text-white font-semibold text-xl mb-4'>
              Need Help?
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-3'>
                <div className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-[#6C2BD9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-white text-xs font-bold'>?</span>
                  </div>
                  <div>
                    <h4 className='text-white font-medium mb-1'>How to Vote</h4>
                    <p className='text-[#888888] text-sm'>
                      Click "Vote Now" on active elections to participate.
                      You'll need to select your preferred candidates and submit
                      your vote.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-white text-xs font-bold'>!</span>
                  </div>
                  <div>
                    <h4 className='text-white font-medium mb-1'>
                      Voting Period
                    </h4>
                    <p className='text-[#888888] text-sm'>
                      Elections are only active between their start and end
                      dates. Check the dates to see when you can vote.
                    </p>
                  </div>
                </div>
              </div>
              <div className='space-y-3'>
                <div className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-[#F59E0B] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-white text-xs font-bold'>✓</span>
                  </div>
                  <div>
                    <h4 className='text-white font-medium mb-1'>
                      View Results
                    </h4>
                    <p className='text-[#888888] text-sm'>
                      After an election ends, click "View Results" to see the
                      voting outcomes and candidate performance.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-white text-xs font-bold'>×</span>
                  </div>
                  <div>
                    <h4 className='text-white font-medium mb-1'>
                      Inactive Elections
                    </h4>
                    <p className='text-[#888888] text-sm'>
                      Elections marked as inactive are not available for voting.
                      Contact administrators for more information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Elections;
