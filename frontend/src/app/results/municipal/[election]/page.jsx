"use client";

import React, { useState } from "react";
import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";

const MunicipalityResults = () => {
  const [selectedMunicipality, setSelectedMunicipality] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for municipal election results
  const municipalities = [
    { id: "all", name: "All Municipalities" },
    { id: "capital", name: "Capital City" },
    { id: "northville", name: "Northville" },
    { id: "southport", name: "Southport" },
    { id: "eastwood", name: "Eastwood" },
    { id: "westhaven", name: "Westhaven" },
  ];

  const districts = [
    { id: "all", name: "All Districts" },
    { id: "central", name: "Central District" },
    { id: "north", name: "Northern District" },
    { id: "south", name: "Southern District" },
    { id: "east", name: "Eastern District" },
    { id: "west", name: "Western District" },
  ];

  const electionData = {
    overall: {
      totalVoters: 1250000,
      votesCast: 987500,
      turnout: 79.0,
      validVotes: 956875,
      invalidVotes: 30625,
      municipalities: 6,
      districts: 25,
      seats: 150,
    },
    municipalities: {
      capital: {
        name: "Capital City",
        totalVoters: 450000,
        votesCast: 360000,
        turnout: 80.0,
        districts: [
          {
            name: "Central District",
            winners: [
              {
                name: "Sarah Johnson",
                list: "Urban Development Alliance",
                votes: 18500,
                position: "Mayor",
              },
              {
                name: "Michael Chen",
                list: "Urban Development Alliance",
                votes: 16700,
                position: "Councilor",
              },
              {
                name: "Lisa Wang",
                list: "Community First",
                votes: 15400,
                position: "Councilor",
              },
            ],
            lists: [
              {
                name: "Urban Development Alliance",
                votes: 78500,
                percentage: 43.6,
                seats: 8,
              },
              {
                name: "Community First",
                votes: 65400,
                percentage: 36.3,
                seats: 6,
              },
              {
                name: "Progressive Municipal",
                votes: 36100,
                percentage: 20.1,
                seats: 3,
              },
            ],
            turnout: 82.5,
          },
          {
            name: "Northern District",
            winners: [
              {
                name: "Robert Martinez",
                list: "Community First",
                votes: 14200,
                position: "Councilor",
              },
              {
                name: "Emma Wilson",
                list: "Urban Development Alliance",
                votes: 13800,
                position: "Councilor",
              },
              {
                name: "David Kim",
                list: "Progressive Municipal",
                votes: 12100,
                position: "Councilor",
              },
            ],
            lists: [
              {
                name: "Community First",
                votes: 61200,
                percentage: 38.2,
                seats: 5,
              },
              {
                name: "Urban Development Alliance",
                votes: 59800,
                percentage: 37.4,
                seats: 5,
              },
              {
                name: "Progressive Municipal",
                votes: 39000,
                percentage: 24.4,
                seats: 3,
              },
            ],
            turnout: 78.9,
          },
        ],
        overallLists: [
          {
            name: "Urban Development Alliance",
            votes: 285600,
            percentage: 39.8,
            seats: 25,
            color: "from-[#6C2BD9] to-[#9D5CFF]",
          },
          {
            name: "Community First",
            votes: 254300,
            percentage: 35.4,
            seats: 22,
            color: "from-[#10B981] to-[#059669]",
          },
          {
            name: "Progressive Municipal",
            votes: 177100,
            percentage: 24.8,
            seats: 16,
            color: "from-[#F59E0B] to-[#D97706]",
          },
        ],
      },
      northville: {
        name: "Northville",
        totalVoters: 180000,
        votesCast: 135000,
        turnout: 75.0,
        districts: [
          {
            name: "Northern District",
            winners: [
              {
                name: "James Wilson",
                list: "Community First",
                votes: 9800,
                position: "Mayor",
              },
              {
                name: "Olivia Chen",
                list: "Community First",
                votes: 8700,
                position: "Councilor",
              },
              {
                name: "Thomas Brown",
                list: "Urban Development Alliance",
                votes: 7600,
                position: "Councilor",
              },
            ],
            lists: [
              {
                name: "Community First",
                votes: 41200,
                percentage: 45.6,
                seats: 6,
              },
              {
                name: "Urban Development Alliance",
                votes: 34500,
                percentage: 38.2,
                seats: 5,
              },
              {
                name: "Progressive Municipal",
                votes: 14700,
                percentage: 16.2,
                seats: 2,
              },
            ],
            turnout: 73.2,
          },
        ],
        overallLists: [
          {
            name: "Community First",
            votes: 85400,
            percentage: 42.8,
            seats: 12,
            color: "from-[#10B981] to-[#059669]",
          },
          {
            name: "Urban Development Alliance",
            votes: 72300,
            percentage: 36.2,
            seats: 10,
            color: "from-[#6C2BD9] to-[#9D5CFF]",
          },
          {
            name: "Progressive Municipal",
            votes: 42100,
            percentage: 21.0,
            seats: 6,
            color: "from-[#F59E0B] to-[#D97706]",
          },
        ],
      },
    },
    overallLists: [
      {
        name: "Urban Development Alliance",
        votes: 985600,
        percentage: 37.2,
        seats: 56,
        color: "from-[#6C2BD9] to-[#9D5CFF]",
      },
      {
        name: "Community First",
        votes: 854300,
        percentage: 32.3,
        seats: 49,
        color: "from-[#10B981] to-[#059669]",
      },
      {
        name: "Progressive Municipal",
        votes: 612100,
        percentage: 23.1,
        seats: 35,
        color: "from-[#F59E0B] to-[#D97706]",
      },
      {
        name: "Independent Candidates",
        votes: 194875,
        percentage: 7.4,
        seats: 10,
        color: "from-[#6B7280] to-[#4B5563]",
      },
    ],
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getCurrentData = () => {
    if (selectedMunicipality === "all") {
      return {
        winners: getAllWinners(),
        lists: electionData.overallLists,
        districts: getAllDistricts(),
      };
    }

    const municipality = electionData.municipalities[selectedMunicipality];
    if (!municipality) return { winners: [], lists: [], districts: [] };

    if (selectedDistrict === "all") {
      return {
        winners: getAllMunicipalityWinners(municipality),
        lists: municipality.overallLists,
        districts: municipality.districts,
      };
    }

    const district = municipality.districts.find(
      (d) => d.name === selectedDistrict,
    );
    return {
      winners: district?.winners || [],
      lists: district?.lists || [],
      districts: [district].filter(Boolean),
    };
  };

  const getAllWinners = () => {
    const allWinners = [];
    Object.values(electionData.municipalities).forEach((municipality) => {
      municipality.districts.forEach((district) => {
        allWinners.push(
          ...district.winners.map((winner) => ({
            ...winner,
            municipality: municipality.name,
            district: district.name,
          })),
        );
      });
    });
    return allWinners;
  };

  const getAllMunicipalityWinners = (municipality) => {
    const winners = [];
    municipality.districts.forEach((district) => {
      winners.push(
        ...district.winners.map((winner) => ({
          ...winner,
          district: district.name,
        })),
      );
    });
    return winners;
  };

  const getAllDistricts = () => {
    const allDistricts = [];
    Object.values(electionData.municipalities).forEach((municipality) => {
      allDistricts.push(
        ...municipality.districts.map((district) => ({
          ...district,
          municipality: municipality.name,
        })),
      );
    });
    return allDistricts;
  };

  const { winners, lists, districts: currentDistricts } = getCurrentData();

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
                  d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                />
              </svg>
            </div>
            <h1 className='text-4xl font-bold text-white mb-4'>
              Municipal Election{" "}
              <span className='text-[#9D5CFF]'>Results 2024</span>
            </h1>
            <p className='text-[#CCCCCC] text-lg max-w-2xl mx-auto'>
              Official results for municipal elections across all districts.
              Track winning candidates and party performance.
            </p>
          </div>

          {/* Overall Statistics */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
              <div className='text-[#9D5CFF] font-bold text-2xl mb-1'>
                {formatNumber(electionData.overall.totalVoters)}
              </div>
              <p className='text-[#CCCCCC] text-sm'>Registered Voters</p>
            </div>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
              <div className='text-white font-bold text-2xl mb-1'>
                {electionData.overall.turnout}%
              </div>
              <p className='text-[#CCCCCC] text-sm'>Voter Turnout</p>
            </div>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
              <div className='text-[#10B981] font-bold text-2xl mb-1'>
                {electionData.overall.municipalities}
              </div>
              <p className='text-[#CCCCCC] text-sm'>Municipalities</p>
            </div>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-center'>
              <div className='text-[#F59E0B] font-bold text-2xl mb-1'>
                {electionData.overall.seats}
              </div>
              <p className='text-[#CCCCCC] text-sm'>Total Seats</p>
            </div>
          </div>

          {/* Controls */}
          <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 mb-8'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
              {/* Municipality Selector */}
              <div>
                <label className='block text-[#CCCCCC] text-sm font-medium mb-2'>
                  Municipality
                </label>
                <select
                  value={selectedMunicipality}
                  onChange={(e) => {
                    setSelectedMunicipality(e.target.value);
                    setSelectedDistrict("all");
                  }}
                  className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]'
                >
                  {municipalities.map((municipality) => (
                    <option key={municipality.id} value={municipality.id}>
                      {municipality.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Selector */}
              <div>
                <label className='block text-[#CCCCCC] text-sm font-medium mb-2'>
                  District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={selectedMunicipality === "all"}
                  className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] disabled:opacity-50'
                >
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Tabs */}
              <div>
                <label className='block text-[#CCCCCC] text-sm font-medium mb-2'>
                  View Results
                </label>
                <div className='flex gap-2 bg-[#2A2A2A] rounded-lg p-1'>
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "winners", label: "Winners" },
                    { id: "lists", label: "Lists" },
                    { id: "districts", label: "Districts" },
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
          <div className='space-y-8'>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className='space-y-6'>
                {/* Overall List Results */}
                <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                  <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
                    <h2 className='text-xl font-semibold text-white'>
                      {selectedMunicipality === "all"
                        ? "Overall List Performance"
                        : `${electionData.municipalities[selectedMunicipality]?.name} List Results`}
                    </h2>
                  </div>
                  <div className='p-6'>
                    <div className='space-y-6'>
                      {lists.map((list, index) => (
                        <div
                          key={list.name}
                          className='bg-[#2A2A2A] rounded-xl border border-[#333333] p-6'
                        >
                          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4'>
                            <div className='flex items-center gap-4'>
                              <div
                                className={`w-4 h-12 bg-linear-to-r ${list.color} rounded-lg`}
                              ></div>
                              <div>
                                <h3 className='text-white font-bold text-xl'>
                                  {list.name}
                                </h3>
                                <p className='text-[#CCCCCC] text-sm'>
                                  {list.seats} Seat{list.seats !== 1 ? "s" : ""}{" "}
                                  • {list.percentage}% of votes
                                </p>
                              </div>
                            </div>
                            <div className='text-right'>
                              <div className='text-white font-bold text-2xl'>
                                {formatNumber(list.votes)}
                              </div>
                              <div className='text-[#CCCCCC] text-sm'>
                                votes
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className='w-full bg-[#333333] rounded-full h-3 overflow-hidden'>
                            <div
                              className='h-3 rounded-full transition-all duration-500'
                              style={{
                                width: `${list.percentage}%`,
                                background: `linear-gradient(to right, ${
                                  list.color.split(" ")[1]
                                }, ${list.color.split(" ")[3]})`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Winners */}
                <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                  <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
                    <h2 className='text-xl font-semibold text-white'>
                      Recently Elected Officials
                    </h2>
                  </div>
                  <div className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                      {winners.slice(0, 6).map((winner, index) => (
                        <div
                          key={index}
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
                            {winner.name}
                          </h3>
                          <p className='text-[#CCCCCC] text-sm mb-1'>
                            {winner.position}
                          </p>
                          <p className='text-[#888888] text-sm mb-4'>
                            {winner.list}
                          </p>
                          {winner.municipality && (
                            <p className='text-[#666666] text-xs'>
                              {winner.municipality} • {winner.district}
                            </p>
                          )}
                          <div className='flex justify-between items-center mt-4'>
                            <span className='text-[#888888] text-sm'>
                              Votes:
                            </span>
                            <span className='text-white font-medium'>
                              {formatNumber(winner.votes)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Winners Tab */}
            {activeTab === "winners" && (
              <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
                  <h2 className='text-xl font-semibold text-white'>
                    {selectedMunicipality === "all"
                      ? "All Elected Officials"
                      : `Elected Officials - ${electionData.municipalities[selectedMunicipality]?.name}`}
                  </h2>
                  <p className='text-[#CCCCCC] text-sm'>
                    {winners.length} elected officials
                  </p>
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
                            Position
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]'>
                            List
                          </th>
                          {selectedMunicipality === "all" && (
                            <th className='px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]'>
                              Municipality
                            </th>
                          )}
                          <th className='px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]'>
                            District
                          </th>
                          <th className='px-4 py-3 text-right text-sm font-semibold text-[#CCCCCC]'>
                            Votes
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-[#333333]'>
                        {winners.map((winner, index) => (
                          <tr
                            key={index}
                            className='hover:bg-[#2A2A2A] transition-colors'
                          >
                            <td className='px-4 py-3'>
                              <div className='text-white font-medium'>
                                {winner.name}
                              </div>
                            </td>
                            <td className='px-4 py-3'>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  winner.position === "Mayor"
                                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                }`}
                              >
                                {winner.position}
                              </span>
                            </td>
                            <td className='px-4 py-3'>
                              <span className='text-[#CCCCCC] text-sm'>
                                {winner.list}
                              </span>
                            </td>
                            {selectedMunicipality === "all" && (
                              <td className='px-4 py-3'>
                                <span className='text-[#CCCCCC] text-sm'>
                                  {winner.municipality}
                                </span>
                              </td>
                            )}
                            <td className='px-4 py-3'>
                              <span className='text-[#CCCCCC] text-sm'>
                                {winner.district}
                              </span>
                            </td>
                            <td className='px-4 py-3 text-right'>
                              <div className='text-white font-medium'>
                                {formatNumber(winner.votes)}
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
              <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
                  <h2 className='text-xl font-semibold text-white'>
                    List Performance
                  </h2>
                </div>
                <div className='p-6'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
                    {lists.map((list, index) => (
                      <div
                        key={list.name}
                        className='bg-[#2A2A2A] rounded-xl border border-[#333333] p-6 text-center'
                      >
                        <div
                          className={`w-16 h-16 bg-linear-to-r ${list.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                        >
                          <span className='text-white font-bold text-xl'>
                            {list.seats}
                          </span>
                        </div>
                        <h3 className='text-white font-bold text-lg mb-2'>
                          {list.name}
                        </h3>
                        <div className='space-y-2 mb-4'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-[#888888]'>Votes:</span>
                            <span className='text-white'>
                              {formatNumber(list.votes)}
                            </span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span className='text-[#888888]'>Percentage:</span>
                            <span className='text-[#10B981] font-semibold'>
                              {list.percentage}%
                            </span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span className='text-[#888888]'>Seats:</span>
                            <span className='text-[#9D5CFF] font-semibold'>
                              {list.seats}
                            </span>
                          </div>
                        </div>
                        <div className='w-full bg-[#333333] rounded-full h-2 overflow-hidden'>
                          <div
                            className='h-2 rounded-full transition-all duration-500'
                            style={{
                              width: `${list.percentage}%`,
                              background: `linear-gradient(to right, ${
                                list.color.split(" ")[1]
                              }, ${list.color.split(" ")[3]})`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Districts Tab */}
            {activeTab === "districts" && (
              <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
                <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
                  <h2 className='text-xl font-semibold text-white'>
                    District Results
                  </h2>
                </div>
                <div className='p-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {currentDistricts.map((district, index) => (
                      <div
                        key={index}
                        className='bg-[#2A2A2A] rounded-xl border border-[#333333] p-6'
                      >
                        <h3 className='text-white font-bold text-lg mb-4'>
                          {district.name}
                        </h3>
                        {district.municipality && (
                          <p className='text-[#888888] text-sm mb-4'>
                            {district.municipality}
                          </p>
                        )}

                        <div className='space-y-3 mb-4'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-[#888888]'>Turnout:</span>
                            <span className='text-[#10B981] font-semibold'>
                              {district.turnout}%
                            </span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span className='text-[#888888]'>Winners:</span>
                            <span className='text-white'>
                              {district.winners.length}
                            </span>
                          </div>
                        </div>

                        <div className='space-y-2'>
                          <h4 className='text-[#CCCCCC] text-sm font-semibold'>
                            Top Lists:
                          </h4>
                          {district.lists.slice(0, 2).map((list, listIndex) => (
                            <div
                              key={listIndex}
                              className='flex justify-between text-sm'
                            >
                              <span className='text-[#CCCCCC]'>
                                {list.name}
                              </span>
                              <span className='text-white'>
                                {list.percentage}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
              {lists.map((list) => (
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

export default MunicipalityResults;
