"use client";

import React from "react";
import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";

const Elections = () => {
  const electionsData = [
    {
      id: 1,
      name: "Presidential Election 2024",
      type: "General",
      startDate: "2024-11-05",
      endDate: "2024-11-05",
      state: "ON",
      status: "active",
    },
    {
      id: 2,
      name: "Senate Election 2024",
      type: "General",
      startDate: "2024-11-05",
      endDate: "2024-11-05",
      state: "OFF",
      status: "inactive",
    },
    {
      id: 3,
      name: "Gubernatorial Election 2024",
      type: "State",
      startDate: "2024-11-05",
      endDate: "2024-11-05",
      state: "ON",
      status: "active",
    },
  ];

  const getStatusBadge = (status) => {
    if (status === "active") {
      return (
        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30'>
          <span className='w-2 h-2 bg-green-400 rounded-full mr-2'></span>
          Active
        </span>
      );
    }
    return (
      <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30'>
        <span className='w-2 h-2 bg-red-400 rounded-full mr-2'></span>
        Inactive
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeColors = {
      General: "from-[#6C2BD9] to-[#9D5CFF]",
      State: "from-[#10B981] to-[#059669]",
      Local: "from-[#F59E0B] to-[#D97706]",
    };

    return (
      <span
        className={`bg-linear-to-r ${
          typeColors[type] || "from-[#6B7280] to-[#4B5563]"
        } text-white px-3 py-1 rounded-full text-sm font-medium`}
      >
        {type}
      </span>
    );
  };

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

          {/* Elections Table */}
          <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] shadow-2xl overflow-hidden'>
            {/* Table Header */}
            <div className='px-6 py-4 border-b border-[#333333] bg-[#2A2A2A]'>
              <h2 className='text-xl font-semibold text-white'>
                Election Overview
              </h2>
            </div>

            {/* Table Container */}
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-[#333333] bg-[#2A2A2A]'>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-[#CCCCCC] uppercase tracking-wider'>
                      Election
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
                  {electionsData.map((election) => (
                    <tr
                      key={election.id}
                      className='hover:bg-[#2A2A2A] transition-colors duration-200'
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-white font-medium'>
                          {election.name}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {getTypeBadge(election.type)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-[#CCCCCC]'>
                        {election.startDate}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-[#CCCCCC]'>
                        {election.endDate}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {getStatusBadge(election.status)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <button
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            election.status === "active"
                              ? "bg-[#6C2BD9] hover:bg-[#9D5CFF] text-white transform hover:scale-105 cursor-pointer"
                              : "bg-[#333333] text-[#888888] cursor-not-allowed"
                          }`}
                          disabled={election.status !== "active"}
                        >
                          {election.status === "active"
                            ? "Vote Now"
                            : "View Results"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className='px-6 py-4 border-t border-[#333333] bg-[#2A2A2A]'>
              <div className='flex justify-between items-center'>
                <p className='text-[#888888] text-sm'>
                  Showing {electionsData.length} of {electionsData.length}{" "}
                  elections
                </p>
                <div className='flex space-x-2'>
                  <button className='px-3 py-1 bg-[#333333] text-[#CCCCCC] rounded-lg text-sm hover:bg-[#444444] transition-colors cursor-pointer'>
                    Previous
                  </button>
                  <button className='px-3 py-1 bg-[#6C2BD9] text-white rounded-lg text-sm hover:bg-[#9D5CFF] transition-colors cursor-pointer'>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12'>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 text-center'>
              <div className='w-12 h-12 bg-linear-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-xl flex items-center justify-center mx-auto mb-4'>
                <span className='text-white font-bold text-lg'>2</span>
              </div>
              <h3 className='text-white font-semibold mb-2'>
                Active Elections
              </h3>
              <p className='text-[#888888] text-sm'>
                Currently open for voting
              </p>
            </div>

            <div className='bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 text-center'>
              <div className='w-12 h-12 bg-linear-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center mx-auto mb-4'>
                <span className='text-white font-bold text-lg'>1</span>
              </div>
              <h3 className='text-white font-semibold mb-2'>Completed</h3>
              <p className='text-[#888888] text-sm'>Elections with results</p>
            </div>

            <div className='bg-[#1A1A1A] border border-[#333333] rounded-2xl p-6 text-center'>
              <div className='w-12 h-12 bg-linear-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center mx-auto mb-4'>
                <span className='text-white font-bold text-lg'>0</span>
              </div>
              <h3 className='text-white font-semibold mb-2'>Upcoming</h3>
              <p className='text-[#888888] text-sm'>Scheduled elections</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Elections;
