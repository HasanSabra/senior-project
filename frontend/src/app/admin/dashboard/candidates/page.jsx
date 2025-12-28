"use client";

import Header from "@/components/other/Header";
import React, { useState, useEffect } from "react";
import PrimaryBTN from "@/components/other/PrimaryBTN";

const AdminCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  const mockCandidates = [
    {
      id: 1,
      user_id: 101,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      experience: "Former City Councilor, 8 years experience in urban planning",
      qual_edu: "MA in Public Administration, Certified Urban Planner",
      personal_statement:
        "I'm committed to sustainable development and community engagement.",
      manifesto:
        "Focus on green infrastructure, affordable housing, and public transportation.",
      election_id: 1,
      election_name: "Municipal Election 2024",
      list_id: 1,
      list_name: "Urban Development Alliance",
      status: "pending",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      user_id: 102,
      name: "Michael Chen",
      email: "michael.chen@example.com",
      experience: "Business leader with 15 years in corporate management",
      qual_edu: "MBA, BA in Economics",
      personal_statement:
        "I believe in economic growth through innovation and collaboration.",
      manifesto:
        "Promote local businesses, improve infrastructure, and reduce bureaucracy.",
      election_id: 1,
      election_name: "Municipal Election 2024",
      list_id: 2,
      list_name: "Community First Coalition",
      status: "approved",
      created_at: "2024-01-10T14:20:00Z",
      updated_at: "2024-01-12T09:15:00Z",
    },
    {
      id: 3,
      user_id: 103,
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      experience: "Education reformer, former school board member",
      qual_edu: "PhD in Education, Teaching Certificate",
      personal_statement:
        "Dedicated to improving education and youth opportunities.",
      manifesto:
        "Increase education funding, vocational training programs, youth centers.",
      election_id: 2,
      election_name: "Parliamentary Election 2024",
      list_id: 3,
      list_name: "Progressive Municipal Party",
      status: "denied",
      created_at: "2024-01-05T11:45:00Z",
      updated_at: "2024-01-08T16:30:00Z",
    },
    {
      id: 4,
      user_id: 104,
      name: "Robert Martinez",
      email: "robert.martinez@example.com",
      experience: "Environmental activist, climate policy advisor",
      qual_edu: "MS in Environmental Science, Climate Policy Certification",
      personal_statement:
        "Committed to sustainable development and climate action.",
      manifesto:
        "Green energy initiatives, carbon reduction targets, conservation programs.",
      election_id: 1,
      election_name: "Municipal Election 2024",
      list_id: 3,
      list_name: "Progressive Municipal Party",
      status: "pending",
      created_at: "2024-01-20T08:15:00Z",
      updated_at: "2024-01-20T08:15:00Z",
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        // In real implementation, replace with:
        // const response = await fetch('/api/admin/candidates');
        // const data = await response.json();
        // setCandidates(data.data || []);

        // Using mock data for now
        setTimeout(() => {
          setCandidates(mockCandidates);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load candidates");
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      searchTerm === "" ||
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.election_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = activeTab === "all" || candidate.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (candidateId) => {
    try {
      // In real implementation:
      // const response = await fetch(`/api/admin/candidates/${candidateId}/approve`, {
      //   method: 'PUT'
      // });

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId
            ? {
                ...candidate,
                status: "approved",
                updated_at: new Date().toISOString(),
              }
            : candidate,
        ),
      );
      setShowModal(false);
    } catch (err) {
      setError("Failed to approve candidate");
    }
  };

  const handleDeny = async (candidateId) => {
    try {
      // In real implementation:
      // const response = await fetch(`/api/admin/candidates/${candidateId}/deny`, {
      //   method: 'PUT'
      // });

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId
            ? {
                ...candidate,
                status: "denied",
                updated_at: new Date().toISOString(),
              }
            : candidate,
        ),
      );
      setShowModal(false);
    } catch (err) {
      setError("Failed to deny candidate");
    }
  };

  const handleDelete = async (candidateId) => {
    try {
      // In real implementation:
      // const response = await fetch(`/api/admin/candidates/${candidateId}`, {
      //   method: 'DELETE'
      // });

      setCandidates((prev) =>
        prev.filter((candidate) => candidate.id !== candidateId),
      );
      setShowModal(false);
    } catch (err) {
      setError("Failed to delete candidate");
    }
  };

  const openModal = (candidate, action) => {
    setSelectedCandidate(candidate);
    setModalAction(action);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        text: "PENDING REVIEW",
      },
      approved: {
        color: "bg-green-500/20 text-green-400 border-green-500/30",
        text: "APPROVED",
      },
      denied: {
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        text: "DENIED",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const getActionButtons = (candidate) => {
    if (candidate.status === "pending") {
      return (
        <div className='flex gap-2'>
          <button
            onClick={() => openModal(candidate, "approve")}
            className='px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors'
          >
            Approve
          </button>
          <button
            onClick={() => openModal(candidate, "deny")}
            className='px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors'
          >
            Deny
          </button>
          <button
            onClick={() => openModal(candidate, "delete")}
            className='px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors'
          >
            Delete
          </button>
        </div>
      );
    }

    return (
      <div className='flex gap-2'>
        <button
          onClick={() => openModal(candidate, "delete")}
          className='px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors'
        >
          Delete
        </button>
      </div>
    );
  };

  return (
    <>
      <Header />

      <main className='min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Header Section */}
          <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-8'>
            <div>
              <h1 className='text-3xl font-bold text-white mb-2'>
                Candidate Management
              </h1>
              <p className='text-[#CCCCCC]'>
                Review, approve, or deny candidate applications
              </p>
            </div>
            <div className='mt-4 lg:mt-0'>
              <div className='flex items-center gap-4'>
                <div className='text-right'>
                  <div className='text-white font-bold text-2xl'>
                    {candidates.length}
                  </div>
                  <div className='text-[#888888] text-sm'>
                    Total Applications
                  </div>
                </div>
                <div className='w-12 h-12 bg-gradient-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-xl flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-3.205a4 4 0 11-8 0 4 4 0 018 0z'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='text-white font-bold text-2xl'>
                    {candidates.filter((c) => c.status === "pending").length}
                  </div>
                  <div className='text-[#CCCCCC] text-sm'>Pending Review</div>
                </div>
                <div className='w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-yellow-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='text-white font-bold text-2xl'>
                    {candidates.filter((c) => c.status === "approved").length}
                  </div>
                  <div className='text-[#CCCCCC] text-sm'>Approved</div>
                </div>
                <div className='w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-green-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className='bg-[#1A1A1A] border border-[#333333] rounded-xl p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='text-white font-bold text-2xl'>
                    {candidates.filter((c) => c.status === "denied").length}
                  </div>
                  <div className='text-[#CCCCCC] text-sm'>Denied</div>
                </div>
                <div className='w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-red-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 mb-8'>
            <div className='flex flex-col lg:flex-row gap-4 justify-between'>
              {/* Search */}
              <div className='flex-1'>
                <div className='relative'>
                  <svg
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#888888]'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                  <input
                    type='text'
                    placeholder='Search candidates by name, email, or election...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full bg-[#2A2A2A] border border-[#333333] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]'
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className='flex gap-2 bg-[#2A2A2A] rounded-lg p-1'>
                {[
                  { id: "all", label: "All" },
                  { id: "pending", label: "Pending" },
                  { id: "approved", label: "Approved" },
                  { id: "denied", label: "Denied" },
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

          {/* Candidates Table */}
          <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden'>
            <div className='bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]'>
              <h2 className='text-xl font-semibold text-white'>
                Candidate Applications
              </h2>
              <p className='text-[#CCCCCC] text-sm'>
                {filteredCandidates.length} application
                {filteredCandidates.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className='p-6'>
              {loading ? (
                <div className='flex justify-center items-center py-12'>
                  <div className='w-12 h-12 border-4 border-[#333333] border-t-[#9D5CFF] rounded-full animate-spin'></div>
                </div>
              ) : error ? (
                <div className='text-center py-12'>
                  <div className='w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                    <svg
                      className='w-8 h-8 text-red-400'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <p className='text-[#CCCCCC]'>{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className='mt-4 px-4 py-2 bg-[#6C2BD9] text-white rounded-lg hover:bg-[#9D5CFF] transition-colors'
                  >
                    Retry
                  </button>
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className='text-center py-12'>
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
                        d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                      />
                    </svg>
                  </div>
                  <h3 className='text-xl font-semibold text-white mb-2'>
                    No applications found
                  </h3>
                  <p className='text-[#888888]'>
                    {searchTerm
                      ? "Try a different search term"
                      : "No candidate applications to display"}
                  </p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-[#333333]'>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]'>
                          Candidate
                        </th>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]'>
                          Election
                        </th>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]'>
                          List
                        </th>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]'>
                          Status
                        </th>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]'>
                          Applied
                        </th>
                        <th className='px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-[#333333]'>
                      {filteredCandidates.map((candidate) => (
                        <tr
                          key={candidate.id}
                          className='hover:bg-[#2A2A2A] transition-colors'
                        >
                          <td className='px-4 py-3'>
                            <div>
                              <div className='text-white font-medium'>
                                {candidate.name}
                              </div>
                              <div className='text-[#888888] text-sm'>
                                {candidate.email}
                              </div>
                            </div>
                          </td>
                          <td className='px-4 py-3'>
                            <div className='text-[#CCCCCC]'>
                              {candidate.election_name}
                            </div>
                          </td>
                          <td className='px-4 py-3'>
                            <div className='text-[#CCCCCC]'>
                              {candidate.list_name}
                            </div>
                          </td>
                          <td className='px-4 py-3'>
                            {getStatusBadge(candidate.status)}
                          </td>
                          <td className='px-4 py-3'>
                            <div className='text-[#CCCCCC] text-sm'>
                              {new Date(
                                candidate.created_at,
                              ).toLocaleDateString()}
                            </div>
                          </td>
                          <td className='px-4 py-3'>
                            <div className='flex items-center gap-3'>
                              <button
                                onClick={() => setSelectedCandidate(candidate)}
                                className='px-3 py-1 bg-[#333333] hover:bg-[#444444] text-white rounded-lg text-sm font-medium transition-colors'
                              >
                                View
                              </button>
                              {getActionButtons(candidate)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* View Candidate Modal */}
      {selectedCandidate && !showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] w-full max-w-4xl max-h-[90vh] overflow-hidden'>
            <div className='bg-gradient-to-r from-[#6C2BD9] to-[#9D5CFF] px-6 py-4 flex justify-between items-center'>
              <h2 className='text-xl font-semibold text-white'>
                Candidate Details
              </h2>
              <button
                onClick={() => setSelectedCandidate(null)}
                className='text-white hover:text-gray-200 transition-colors'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='p-6 overflow-y-auto max-h-[calc(90vh-120px)]'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <div className='bg-[#2A2A2A] rounded-xl p-4'>
                  <h3 className='text-white font-semibold mb-2'>
                    Personal Information
                  </h3>
                  <p className='text-[#CCCCCC]'>
                    <strong>Name:</strong> {selectedCandidate.name}
                  </p>
                  <p className='text-[#CCCCCC]'>
                    <strong>Email:</strong> {selectedCandidate.email}
                  </p>
                  <p className='text-[#CCCCCC]'>
                    <strong>User ID:</strong> {selectedCandidate.user_id}
                  </p>
                </div>

                <div className='bg-[#2A2A2A] rounded-xl p-4'>
                  <h3 className='text-white font-semibold mb-2'>
                    Election Details
                  </h3>
                  <p className='text-[#CCCCCC]'>
                    <strong>Election:</strong> {selectedCandidate.election_name}
                  </p>
                  <p className='text-[#CCCCCC]'>
                    <strong>List:</strong> {selectedCandidate.list_name}
                  </p>
                  <p className='text-[#CCCCCC]'>
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(selectedCandidate.status)}
                  </p>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='bg-[#2A2A2A] rounded-xl p-4'>
                  <h3 className='text-white font-semibold mb-2'>
                    Professional Experience
                  </h3>
                  <p className='text-[#CCCCCC]'>
                    {selectedCandidate.experience}
                  </p>
                </div>

                <div className='bg-[#2A2A2A] rounded-xl p-4'>
                  <h3 className='text-white font-semibold mb-2'>
                    Qualifications & Education
                  </h3>
                  <p className='text-[#CCCCCC]'>{selectedCandidate.qual_edu}</p>
                </div>

                <div className='bg-[#2A2A2A] rounded-xl p-4'>
                  <h3 className='text-white font-semibold mb-2'>
                    Personal Statement
                  </h3>
                  <p className='text-[#CCCCCC]'>
                    {selectedCandidate.personal_statement}
                  </p>
                </div>

                <div className='bg-[#2A2A2A] rounded-xl p-4'>
                  <h3 className='text-white font-semibold mb-2'>
                    Campaign Manifesto
                  </h3>
                  <p className='text-[#CCCCCC]'>
                    {selectedCandidate.manifesto}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && selectedCandidate && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <div className='bg-[#1A1A1A] rounded-2xl border border-[#333333] w-full max-w-md'>
            <div className='p-6'>
              <h3 className='text-xl font-semibold text-white mb-4'>
                {modalAction === "approve" && "Approve Candidate"}
                {modalAction === "deny" && "Deny Candidate"}
                {modalAction === "delete" && "Delete Candidate"}
              </h3>

              <p className='text-[#CCCCCC] mb-6'>
                {modalAction === "approve" &&
                  `Are you sure you want to approve ${selectedCandidate.name} as a candidate?`}
                {modalAction === "deny" &&
                  `Are you sure you want to deny ${selectedCandidate.name}'s application?`}
                {modalAction === "delete" &&
                  `Are you sure you want to delete ${selectedCandidate.name}'s application? This action cannot be undone.`}
              </p>

              <div className='flex justify-end gap-3'>
                <button
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 border border-[#333333] text-[#CCCCCC] hover:text-white rounded-lg transition-colors'
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (modalAction === "approve")
                      handleApprove(selectedCandidate.id);
                    if (modalAction === "deny")
                      handleDeny(selectedCandidate.id);
                    if (modalAction === "delete")
                      handleDelete(selectedCandidate.id);
                  }}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    modalAction === "approve"
                      ? "bg-green-500 hover:bg-green-600"
                      : modalAction === "deny"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCandidates;
