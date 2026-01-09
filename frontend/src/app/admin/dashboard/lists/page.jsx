"use client";

import Header from "@/components/other/Header";
import React, { useState, useEffect } from "react";
import PrimaryBTN from "@/components/other/PrimaryBTN";
import Cookies from "js-cookie";

import { constituencies, districts, villages } from "@/models/data";

import { ELECTION_ADMIN_API, LIST_ADMIN_API } from "@/lib/api";

const AdminLists = () => {
  const [lists, setLists] = useState([]);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listsLoading, setListsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedElection, setSelectedElection] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    seats_number: "",
    election_id: "",
    constituency_id: "",
    district_id: "",
    village_id: "",
  });

  useEffect(() => {
    setLoading(true);
    const userData = Cookies.get("user");

    let cookiesUser = null;

    if (userData) {
      cookiesUser = JSON.parse(userData);
    }

    if (cookiesUser?.role !== "admin") {
      window.location.href = "/dashboard";
      return;
    }
  }, []);

  useEffect(() => {
    fetchElections();
    fetchLists();
    setLoading(false);
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);

      const resElections = await ELECTION_ADMIN_API.get("/");

      if (!resElections.data.success) {
        setError(resElections.data.message);
        return;
      }

      setTimeout(() => {
        setElections(resElections.data.data);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const fetchLists = async () => {
    try {
      setLoading(true);

      const resLists = await LIST_ADMIN_API.get("/");

      if (!resLists.data.success) {
        setError(resLists.data.message);
        return;
      }

      setTimeout(() => {
        setLists(resLists.data.data);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const filteredLists = lists
    .map((list) => {
      // Join with election data to get election name
      const election = elections.find((e) => e.id === list.election_id);
      return {
        ...list,
        election_name: election ? election.name : "Unknown Election",
      };
    })
    .filter((list) => {
      // Filter by selected election first
      const matchesElection =
        selectedElection === "all" ||
        list.election_id === parseInt(selectedElection);

      // Then filter by search term
      const matchesSearch =
        searchTerm === "" ||
        list.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.election_name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesElection && matchesSearch;
    });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await LIST_ADMIN_API.post("/", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      fetchLists();
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      setError("Failed to create list");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await LIST_ADMIN_API.put(`/${selectedList.id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      fetchLists();
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      setError("Failed to update list");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await LIST_ADMIN_API.delete(`/${selectedList.id}`);

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      fetchLists();
      setShowDeleteModal(false);
    } catch (err) {
      setError("Failed to delete list");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      seats_number: "",
      election_id: "",
      constituency_id: "",
      district_id: "",
      village_id: "",
    });
    setSelectedList(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (list) => {
    setSelectedList(list);
    setFormData({
      name: list.name,
      description: list.description,
      seats_number: list.seats_number,
      election_id: list.election_id,
      constituency_id: list.constituency_id || "",
      district_id: list.district_id || "",
      village_id: list.village_id || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (list) => {
    setSelectedList(list);
    setShowDeleteModal(true);
  };

  const fetchListsByElection = async (electionId) => {
    if (electionId === "all") {
      setLists(lists);
      return;
    }

    setListsLoading(true);
    try {
      const response = await LIST_ADMIN_API.get(`/${electionId}`);

      if (!response.data.success) {
        setError(response.data.message);
        setListsLoading(false);
        return;
      }

      setLists(response.data.data || []);

      setTimeout(() => {
        const filteredLists = lists.filter(
          (list) => list.election_id === parseInt(electionId),
        );
        setLists(filteredLists);
        setListsLoading(false);
      }, 500);
    } catch (err) {
      setError("Failed to load lists");
      setListsLoading(false);
    }
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
                Election Lists Management
              </h1>
              <p className="text-[#CCCCCC]">
                Create and manage political lists for elections
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <PrimaryBTN
                text="Create New List"
                onClickFunc={openCreateModal}
                disabled={false}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-2xl">
                    {lists.length}
                  </div>
                  <div className="text-[#CCCCCC] text-sm">Total Lists</div>
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-2xl">
                    {lists?.reduce((sum, list) => sum + list.seats_number, 0)}
                  </div>
                  <div className="text-[#CCCCCC] text-sm">Total Seats</div>
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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
                    {lists.reduce(
                      (sum, list) => sum + list.candidate_count,
                      0,
                    ) || 0}
                  </div>
                  <div className="text-[#CCCCCC] text-sm">Total Candidates</div>
                </div>
                <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-3.205a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              {/* Election Filter */}
              <div className="flex-1">
                <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                  Filter by Election
                </label>
                <select
                  value={selectedElection}
                  onChange={(e) => {
                    setSelectedElection(e.target.value);
                    fetchListsByElection(e.target.value);
                  }}
                  className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                >
                  <option value="all">All Elections</option>
                  {elections.map((election) => (
                    <option key={election.id} value={election.id}>
                      {election.name} {election.is_active ? "✓" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="flex-1">
                <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                  Search Lists
                </label>
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
                    placeholder="Search by list name, description, or election..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lists Table */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden">
            <div className="bg-[#2A2A2A] px-6 py-4 border-b border-[#333333]">
              <h2 className="text-xl font-semibold text-white">
                Political Lists
              </h2>
              <p className="text-[#CCCCCC] text-sm">
                {listsLoading
                  ? "Loading..."
                  : `${filteredLists.length} list${
                      filteredLists.length !== 1 ? "s" : ""
                    } found`}
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
              ) : listsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-10 h-10 border-4 border-[#333333] border-t-[#6C2BD9] rounded-full animate-spin"></div>
                </div>
              ) : filteredLists.length === 0 ? (
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No lists found
                  </h3>
                  <p className="text-[#888888]">
                    {searchTerm
                      ? "Try a different search term"
                      : selectedElection === "all"
                        ? "No lists to display"
                        : "No lists found for this election"}
                  </p>
                  <button
                    onClick={openCreateModal}
                    className="mt-4 px-4 py-2 bg-[#6C2BD9] text-white rounded-lg hover:bg-[#9D5CFF] transition-colors"
                  >
                    Create First List
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#333333]">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                          List Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                          Election
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                          Seats
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                          Candidates
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                          Location
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#CCCCCC]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333333]">
                      {filteredLists.map((list) => (
                        <tr
                          key={list.id}
                          className="hover:bg-[#2A2A2A] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div>
                              <div className="text-white font-medium">
                                {list.name}
                              </div>
                              <div className="text-[#888888] text-sm truncate max-w-xs">
                                {list.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-[#CCCCCC]">
                              {list.election_name}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-white font-semibold">
                              {list.seats_number}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-white">
                                {list.candidate_count}
                              </span>
                              <span className="text-[#888888] text-sm">
                                candidates
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-[#CCCCCC] text-sm">
                              {list.village_name && (
                                <div>{list.village_name}</div>
                              )}
                              {list.district_name && (
                                <div>{list.district_name}</div>
                              )}
                              {list.constituency_name && (
                                <div>{list.constituency_name}</div>
                              )}
                              {!list.village_name &&
                                !list.district_name &&
                                !list.constituency_name && (
                                  <div className="text-[#888888]">National</div>
                                )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(list)}
                                className="px-3 py-1 bg-[#333333] hover:bg-[#444444] text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteModal(list)}
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

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-[#6C2BD9] to-[#9D5CFF] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Create New List
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
                    Election *
                  </label>
                  <select
                    name="election_id"
                    value={formData.election_id}
                    onChange={(e) =>
                      setFormData({ ...formData, election_id: e.target.value })
                    }
                    required
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                  >
                    <option value="">Select election</option>
                    {elections.map((election) => (
                      <option key={election.id} value={election.id}>
                        {election.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    List Name *
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
                    placeholder="Enter list name"
                  />
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    rows="3"
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] resize-none"
                    placeholder="Describe the list's mission and focus areas..."
                  />
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Number of Seats *
                  </label>
                  <input
                    type="number"
                    name="seats_number"
                    value={formData.seats_number}
                    onChange={(e) =>
                      setFormData({ ...formData, seats_number: e.target.value })
                    }
                    required
                    min="1"
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                    placeholder="Enter number of seats"
                  />
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Constituency
                  </label>
                  <select
                    name="constituency_id"
                    value={formData.constituency_id}
                    onChange={(e) => {
                      const newConstituencyId = e.target.value;
                      setFormData({
                        ...formData,
                        constituency_id: newConstituencyId,
                        district_id: "", // Reset district when constituency changes
                        village_id: "", // Reset village when constituency changes
                      });
                    }}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                  >
                    <option value="">Select constituency (optional)</option>
                    {constituencies.map((constituency) => (
                      <option key={constituency.id} value={constituency.id}>
                        {constituency.name}
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
                    onChange={(e) => {
                      const newDistrictId = e.target.value;
                      setFormData({
                        ...formData,
                        district_id: newDistrictId,
                        village_id: "", // Reset village when district changes
                      });
                    }}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                    disabled={!formData.constituency_id}
                  >
                    <option value="">
                      {formData.constituency_id
                        ? "Select district (optional)"
                        : "Select constituency first"}
                    </option>
                    {formData.constituency_id &&
                      districts
                        .filter((district) => {
                          // Filter districts by the same governorate as selected constituency
                          const selectedConstituency = constituencies.find(
                            (c) => c.id === parseInt(formData.constituency_id),
                          );
                          return selectedConstituency
                            ? district.governorate_id ===
                                selectedConstituency.governorate_id
                            : false;
                        })
                        .map((district) => (
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
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                    disabled={!formData.district_id}
                  >
                    <option value="">
                      {formData.district_id
                        ? "Select village (optional)"
                        : "Select district first"}
                    </option>
                    {formData.district_id &&
                      villages
                        .filter(
                          (village) =>
                            village.district_id ===
                            parseInt(formData.district_id),
                        )
                        .map((village) => (
                          <option key={village.id} value={village.id}>
                            {village.name}
                          </option>
                        ))}
                  </select>
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
                    text="Create List"
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

      {/* Edit List Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-[#6C2BD9] to-[#9D5CFF] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Edit List</h2>
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
                    Election *
                  </label>
                  <select
                    name="election_id"
                    value={formData.election_id}
                    onChange={(e) =>
                      setFormData({ ...formData, election_id: e.target.value })
                    }
                    required
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                  >
                    {elections.map((election) => (
                      <option key={election.id} value={election.id}>
                        {election.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    List Name *
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

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    rows="3"
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Number of Seats *
                  </label>
                  <input
                    type="number"
                    name="seats_number"
                    value={formData.seats_number}
                    onChange={(e) =>
                      setFormData({ ...formData, seats_number: e.target.value })
                    }
                    required
                    min="1"
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                  />
                </div>

                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Constituency
                  </label>
                  <select
                    name="constituency_id"
                    value={formData.constituency_id}
                    onChange={(e) => {
                      const newConstituencyId = e.target.value;
                      setFormData({
                        ...formData,
                        constituency_id: newConstituencyId,
                        district_id: "", // Reset district when constituency changes
                        village_id: "", // Reset village when constituency changes
                      });
                    }}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                  >
                    <option value="">Select constituency (optional)</option>
                    {constituencies.map((constituency) => (
                      <option key={constituency.id} value={constituency.id}>
                        {constituency.name}
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
                    onChange={(e) => {
                      const newDistrictId = e.target.value;
                      setFormData({
                        ...formData,
                        district_id: newDistrictId,
                        village_id: "", // Reset village when district changes
                      });
                    }}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                    disabled={!formData.constituency_id}
                  >
                    <option value="">
                      {formData.constituency_id
                        ? "Select district (optional)"
                        : "Select constituency first"}
                    </option>
                    {formData.constituency_id &&
                      districts
                        .filter((district) => {
                          // Filter districts by the same governorate as selected constituency
                          const selectedConstituency = constituencies.find(
                            (c) => c.id === parseInt(formData.constituency_id),
                          );
                          return selectedConstituency
                            ? district.governorate_id ===
                                selectedConstituency.governorate_id
                            : false;
                        })
                        .map((district) => (
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
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]"
                    disabled={!formData.district_id}
                  >
                    <option value="">
                      {formData.district_id
                        ? "Select village (optional)"
                        : "Select district first"}
                    </option>
                    {formData.district_id &&
                      villages
                        .filter(
                          (village) =>
                            village.district_id ===
                            parseInt(formData.district_id),
                        )
                        .map((village) => (
                          <option key={village.id} value={village.id}>
                            {village.name}
                          </option>
                        ))}
                  </select>
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
                    text="Update List"
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
                Delete List
              </h3>
              <p className="text-[#CCCCCC] mb-6 text-center">
                Are you sure you want to delete "{selectedList?.name}"? This
                will also remove all candidates associated with this list.
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
    </>
  );
};

export default AdminLists;
