"use client";

import Header from "@/components/other/Header";
import React, { useState, useEffect } from "react";
import PrimaryBTN from "@/components/other/PrimaryBTN";

import {
  governorates,
  districts,
  villages,
  electionTypes,
} from "../../../../models/data";

import { ELECTION_ADMIN_API } from "@/lib/api";
import { useRouter } from "next/navigation";

const AdminElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [modalAction, setModalAction] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    election_type_id: "",
    governorate_id: "",
    district_id: "",
    village_id: "",
    is_active: false,
  });

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);

      const res = await ELECTION_ADMIN_API.get("/");

      if (!res.success) {
        setError(res.message);
      }

      setTimeout(() => {
        setElections(res.data.data);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to load elections");
      setLoading(false);
    }
  };

  const filteredElections = elections.filter((election) => {
    const matchesSearch =
      searchTerm === "" ||
      election.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.election_type
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      election.governorate?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      activeTab === "all" ||
      (activeTab === "active" && election.is_active) ||
      (activeTab === "inactive" && !election.is_active);

    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await ELECTION_ADMIN_API.post("/", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      fetchElections();
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      setError("Failed to create election");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await ELECTION_ADMIN_API.put(
        `${selectedElection.id}`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      setElections((prev) =>
        prev.map((election) =>
          election.id === selectedElection.id
            ? {
                ...election,
                ...formData,
                election_type: electionTypes.find(
                  (t) => t.id === parseInt(formData.election_type_id),
                )?.name,
                governorate: governorates.find(
                  (g) => g.id === parseInt(formData.governorate_id),
                )?.name,
                district: districts.find(
                  (d) => d.id === parseInt(formData.district_id),
                )?.name,
                village: villages.find(
                  (v) => v.id === parseInt(formData.village_id),
                )?.name,
                updated_at: new Date().toISOString(),
              }
            : election,
        ),
      );
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      setError("Failed to update election");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await ELECTION_ADMIN_API.delete(`/${selectedElection.id}`);

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      setElections((prev) =>
        prev.filter((election) => election.id !== selectedElection.id),
      );
      setShowDeleteModal(false);
    } catch (err) {
      setError("Failed to delete election");
    }
  };

  const handleStatusChange = async () => {
    try {
      const endpoint = modalAction === "activate" ? "activate" : "deactivate";

      const res = await ELECTION_ADMIN_API.put(
        `/${endpoint}/${selectedElection.id}`,
      );

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      setElections((prev) =>
        prev.map((election) =>
          election.id === selectedElection.id
            ? {
                ...election,
                is_active: modalAction === "activate",
                updated_at: new Date().toISOString(),
              }
            : election,
        ),
      );
      setShowStatusModal(false);
    } catch (err) {
      setError(`Failed to ${modalAction} election`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      start_date: "",
      end_date: "",
      election_type_id: "",
      governorate_id: "",
      district_id: "",
      village_id: "",
      is_active: false,
    });
    setSelectedElection(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (election) => {
    setSelectedElection(election);
    setFormData({
      name: election.name,
      start_date: election.start_date,
      end_date: election.end_date,
      election_type_id: election.election_type_id,
      governorate_id: election.governorate_id || "",
      district_id: election.district_id || "",
      village_id: election.village_id || "",
      is_active: election.is_active,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (election) => {
    setSelectedElection(election);
    setShowDeleteModal(true);
  };

  const openStatusModal = (election, action) => {
    setSelectedElection(election);
    setModalAction(action);
    setShowStatusModal(true);
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          ACTIVE
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
        INACTIVE
      </span>
    );
  };

  const getFilteredDistricts = () => {
    if (!formData.governorate_id) return districts;
    return districts.filter(
      (district) =>
        district.governorate_id === parseInt(formData.governorate_id),
    );
  };

  const getFilteredVillages = () => {
    if (!formData.district_id) return villages;
    return villages.filter(
      (village) => village.district_id === parseInt(formData.district_id),
    );
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Election Management
              </h1>
              <p className="text-[#CCCCCC]">
                Create, edit, and manage elections
              </p>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
              <div className="mt-4 lg:mt-0">
                <PrimaryBTN
                  text="Results"
                  onClickFunc={() => {
                    window.location.href = "elections/results";
                  }}
                  disabled={false}
                />
              </div>
              <div className="mt-4 lg:mt-0">
                <PrimaryBTN
                  text="Create New Election"
                  onClickFunc={openCreateModal}
                  disabled={false}
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-2xl">
                    {elections.length}
                  </div>
                  <div className="text-[#CCCCCC] text-sm">Total Elections</div>
                </div>
                <div className="w-10 h-10 bg-[#6C2BD9] rounded-lg flex items-center justify-center">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-2xl">
                    {elections.filter((e) => e.is_active).length}
                  </div>
                  <div className="text-[#CCCCCC] text-sm">Active Elections</div>
                </div>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-2xl">
                    {elections.filter((e) => !e.is_active).length}
                  </div>
                  <div className="text-[#CCCCCC] text-sm">
                    Inactive Elections
                  </div>
                </div>
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-2xl">
                    {electionTypes.length}
                  </div>
                  <div className="text-[#CCCCCC] text-sm">Election Types</div>
                </div>
                <div className="w-10 h-10 bg-[#9D5CFF] rounded-lg flex items-center justify-center">
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#888888]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search elections by name, type, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 bg-[#2A2A2A] rounded-lg p-1">
                {[
                  { id: "all", label: "All Elections" },
                  { id: "active", label: "Active" },
                  { id: "inactive", label: "Inactive" },
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

          {/* Elections Table */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden">
            <div className="bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]">
              <h2 className="text-xl font-semibold text-white">
                Elections List
              </h2>
              <p className="text-[#CCCCCC] text-sm">
                {filteredElections.length} election
                {filteredElections.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-12 h-12 border-4 border-[#333333] border-t-[#9D5CFF] rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-[#CCCCCC]">{error}</p>
                  <button
                    onClick={fetchElections}
                    className="mt-4 px-4 py-2 bg-[#6C2BD9] text-white rounded-lg hover:bg-[#9D5CFF] transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredElections.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#333333] rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No elections found
                  </h3>
                  <p className="text-[#888888]">
                    {searchTerm
                      ? "Try a different search term"
                      : "No elections to display"}
                  </p>
                  <button
                    onClick={openCreateModal}
                    className="mt-4 px-4 py-2 bg-[#6C2BD9] text-white rounded-lg hover:bg-[#9D5CFF] transition-colors"
                  >
                    Create First Election
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#333333]">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                          Election Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                          Location
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                          Dates
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333333]">
                      {filteredElections.map((election) => (
                        <tr
                          key={election.id}
                          className="hover:bg-[#2A2A2A] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="text-white font-medium">
                              {election.name}
                            </div>
                            <div className="text-[#888888] text-sm">
                              ID: {election.id}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-[#CCCCCC]">
                              {
                                electionTypes.find(
                                  (type) =>
                                    type.id === election.election_type_id,
                                )?.name
                              }
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-[#CCCCCC]">
                              {election.village_id !== 0 && (
                                <div>
                                  {
                                    villages.find(
                                      (village) =>
                                        village.id === election.village_id,
                                    )?.name
                                  }
                                </div>
                              )}
                              {election.district_id !== 0 && (
                                <div>
                                  {
                                    districts.find(
                                      (district) =>
                                        district.id === election.district_id,
                                    )?.name
                                  }
                                </div>
                              )}
                              {election.governorate_id !== 0 && (
                                <div>
                                  {
                                    governorates.find(
                                      (governorate) =>
                                        governorate.id ===
                                        election.governorate_id,
                                    )?.name
                                  }
                                </div>
                              )}
                              {election.village_id == 0 &&
                                election.district_id == 0 &&
                                election.governorate_id == 0 && (
                                  <div>
                                    <span className="text-[#CCCCCC]">
                                      No Location
                                    </span>
                                  </div>
                                )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-[#CCCCCC]">
                              <div>
                                Start:{" "}
                                {new Date(
                                  election.start_date,
                                ).toLocaleDateString()}
                              </div>
                              <div>
                                End:{" "}
                                {new Date(
                                  election.end_date,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(election.is_active)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(election)}
                                className="px-3 py-1 bg-[#333333] hover:bg-[#444444] text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Edit
                              </button>
                              {election.is_active ? (
                                <button
                                  onClick={() =>
                                    openStatusModal(election, "deactivate")
                                  }
                                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    openStatusModal(election, "activate")
                                  }
                                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                  Activate
                                </button>
                              )}
                              <button
                                onClick={() => openDeleteModal(election)}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Delete
                              </button>
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

      {/* Create Election Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-[#6C2BD9] to-[#9D5CFF] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Create New Election
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
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

            <form
              onSubmit={handleCreateSubmit}
              className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Election Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                    placeholder="Enter election name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      required
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      required
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Election Type *
                  </label>
                  <select
                    name="election_type_id"
                    value={formData.election_type_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        election_type_id: e.target.value,
                      })
                    }
                    required
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                  >
                    <option value="">Select election type</option>
                    {electionTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Governorate
                  </label>
                  <select
                    name="governorate_id"
                    value={formData.governorate_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        governorate_id: e.target.value,
                        district_id: "",
                        village_id: "",
                      })
                    }
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                  >
                    <option value="">Select governorate (optional)</option>
                    {governorates.map((gov) => (
                      <option key={gov.id} value={gov.id}>
                        {gov.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    District
                  </label>
                  <select
                    name="district_id"
                    value={formData.district_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        district_id: e.target.value,
                        village_id: "",
                      })
                    }
                    disabled={!formData.governorate_id}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] disabled:opacity-50"
                  >
                    <option value="">Select district (optional)</option>
                    {getFilteredDistricts().map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Village
                  </label>
                  <select
                    name="village_id"
                    value={formData.village_id}
                    onChange={(e) =>
                      setFormData({ ...formData, village_id: e.target.value })
                    }
                    disabled={!formData.district_id}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] disabled:opacity-50"
                  >
                    <option value="">Select village (optional)</option>
                    {getFilteredVillages().map((village) => (
                      <option key={village.id} value={village.id}>
                        {village.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-4 h-4 text-[#6C2BD9] bg-[#2A2A2A] border-[#333333] rounded focus:ring-[#9D5CFF]"
                  />
                  <label htmlFor="is_active" className="text-[#CCCCCC] text-sm">
                    Activate this election immediately
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-[#333333] text-[#CCCCCC] hover:text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <PrimaryBTN
                    text="Create Election"
                    onClickFunc={handleCreateSubmit}
                    type="submit"
                    disabled={false}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Election Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-[#6C2BD9] to-[#9D5CFF] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Edit Election
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
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

            <form
              onSubmit={handleUpdateSubmit}
              className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Election Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      required
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      required
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Election Type *
                  </label>
                  <select
                    name="election_type_id"
                    value={formData.election_type_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        election_type_id: e.target.value,
                      })
                    }
                    required
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                  >
                    {electionTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Governorate
                  </label>
                  <select
                    name="governorate_id"
                    value={formData.governorate_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        governorate_id: e.target.value,
                        district_id: "",
                        village_id: "",
                      })
                    }
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                  >
                    <option value="">Select governorate (optional)</option>
                    {governorates.map((gov) => (
                      <option key={gov.id} value={gov.id}>
                        {gov.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    District
                  </label>
                  <select
                    name="district_id"
                    value={formData.district_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        district_id: e.target.value,
                        village_id: "",
                      })
                    }
                    disabled={!formData.governorate_id}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] disabled:opacity-50"
                  >
                    <option value="">Select district (optional)</option>
                    {getFilteredDistricts().map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Village
                  </label>
                  <select
                    name="village_id"
                    value={formData.village_id}
                    onChange={(e) =>
                      setFormData({ ...formData, village_id: e.target.value })
                    }
                    disabled={!formData.district_id}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] disabled:opacity-50"
                  >
                    <option value="">Select village (optional)</option>
                    {getFilteredVillages().map((village) => (
                      <option key={village.id} value={village.id}>
                        {village.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_active_edit"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-4 h-4 text-[#6C2BD9] bg-[#2A2A2A] border-[#333333] rounded focus:ring-[#9D5CFF]"
                  />
                  <label
                    htmlFor="is_active_edit"
                    className="text-[#CCCCCC] text-sm"
                  >
                    Election is active
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-[#333333] text-[#CCCCCC] hover:text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <PrimaryBTN
                    text="Update Election"
                    onClickFunc={handleUpdateSubmit}
                    type="submit"
                    disabled={false}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] w-full max-w-md">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 text-center">
                Delete Election
              </h3>
              <p className="text-[#CCCCCC] mb-6 text-center">
                Are you sure you want to delete "{selectedElection?.name}"? This
                action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-[#333333] text-[#CCCCCC] hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] w-full max-w-md">
            <div className="p-6">
              <div
                className={`w-16 h-16 ${
                  modalAction === "activate"
                    ? "bg-green-500/20"
                    : "bg-yellow-500/20"
                } rounded-2xl flex items-center justify-center mx-auto mb-4`}
              >
                {modalAction === "activate" ? (
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 text-center">
                {modalAction === "activate"
                  ? "Activate Election"
                  : "Deactivate Election"}
              </h3>
              <p className="text-[#CCCCCC] mb-6 text-center">
                {modalAction === "activate"
                  ? `Are you sure you want to activate "${selectedElection?.name}"? This will make it available for voting.`
                  : `Are you sure you want to deactivate "${selectedElection?.name}"? This will prevent any further voting.`}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-[#333333] text-[#CCCCCC] hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  className={`px-4 py-2 ${
                    modalAction === "activate"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  } text-white rounded-lg transition-colors`}
                >
                  {modalAction === "activate" ? "Activate" : "Deactivate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminElections;
