"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/other/Header";
import Footer from "@/components/other/Footer";
import PrimaryBTN from "@/components/other/PrimaryBTN";

import { USER_ADMIN_API } from "@/lib/api";

import {
  governorates,
  districts,
  villages,
  constituencies,
  genders,
  maritalStatuses,
  religions,
  denominations,
} from "@/models/data";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGovernorate, setFilterGovernorate] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);
  const [filteredDenominations, setFilteredDenominations] = useState([]);
  const [formData, setFormData] = useState({
    pin: "",
    first_name: "",
    last_name: "",
    birthdate: "",
    family_record_number: "",
    is_alive: true,
    is_admin: false,
    email: null,
    password: null,
    governorate_id: null,
    district_id: null,
    village_id: null,
    gender_id: null,
    marital_status_id: null,
    religion_id: null,
    denomination_id: null,
    father_id: null,
    mother_id: null,
  });

  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await USER_ADMIN_API.get("/");

      if (!response.data.success) {
        console.error("Failed to fetch users");
        return;
      }
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Filter districts based on selected governorate
  useEffect(() => {
    if (formData.governorate_id) {
      const filtered = districts.filter(
        (district) =>
          district.governorate_id === parseInt(formData.governorate_id),
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
      setFormData((prev) => ({ ...prev, district_id: null, village_id: null }));
    }
  }, [formData.governorate_id]);

  // Filter villages based on selected district
  useEffect(() => {
    if (formData.district_id) {
      const filtered = villages.filter(
        (village) => village.district_id === parseInt(formData.district_id),
      );
      setFilteredVillages(filtered);
    } else {
      setFilteredVillages([]);
      setFormData((prev) => ({ ...prev, village_id: null }));
    }
  }, [formData.district_id]);

  // Filter denominations based on selected religion
  useEffect(() => {
    if (formData.religion_id) {
      const filtered = denominations.filter(
        (denomination) =>
          denomination.religion_id === parseInt(formData.religion_id),
      );
      setFilteredDenominations(filtered);
    } else {
      setFilteredDenominations([]);
      setFormData((prev) => ({ ...prev, denomination_id: null }));
    }
  }, [formData.religion_id]);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.pin?.toString().includes(searchTerm) ||
      user.family_record_number?.toString().includes(searchTerm);

    const matchesRole =
      filterRole === "all" ||
      (filterRole === "admin" && user.is_admin) ||
      (filterRole === "user" && !user.is_admin);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "alive" && user.is_alive) ||
      (filterStatus === "deceased" && !user.is_alive);

    const matchesGovernorate =
      filterGovernorate === "all" ||
      user.governorate_id?.toString() === filterGovernorate;

    return matchesSearch && matchesRole && matchesStatus && matchesGovernorate;
  });

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // User selection
  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((user) => user.id));
    }
  };

  // Delete users
  const handleDeleteUsers = async () => {
    const response = await USER_ADMIN_API.delete(`/${selectedUsers}`);

    if (!response.data.success) {
      console.error("Failed to delete users");
      return;
    }

    fetchUsers();
    setSelectedUsers([]);
    setShowDeleteModal(false);
  };

  // Edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      pin: user.pin.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      birthdate: user.birthdate,
      family_record_number: user.family_record_number.toString(),
      is_alive: user.is_alive,
      is_admin: user.is_admin,
      email: user.email || "",
      password: null,
      governorate_id: user.governorate_id,
      district_id: user.district_id,
      village_id: user.village_id,
      gender_id: user.gender_id,
      marital_status_id: user.marital_status_id,
      religion_id: user.religion_id,
      denomination_id: user.denomination_id,
      father_id: user.father_id,
      mother_id: user.mother_id,
    });
    setShowEditModal(true);
  };

  // Add user
  const handleAddUser = async () => {
    const newUser = {
      id: users.length + 1,
      pin: parseInt(formData.pin),
      first_name: formData.first_name,
      last_name: formData.last_name,
      birthdate: formData.birthdate,
      age: calculateAge(formData.birthdate),
      family_record_number: parseInt(formData.family_record_number),
      is_alive: formData.is_alive,
      is_admin: formData.is_admin,
      email: formData.email,
      password: formData.password,
      creation_date: new Date().toISOString(),
      governorate_id: formData.governorate_id,
      district_id: formData.district_id,
      village_id: formData.village_id,
      gender_id: formData.gender_id,
      marital_status_id: formData.marital_status_id,
      religion_id: formData.religion_id,
      denomination_id: formData.denomination_id,
      father_id: formData.father_id,
      mother_id: formData.mother_id,
    };

    const response = await USER_ADMIN_API.post("/", newUser);

    if (!response.data.success) {
      console.error("Failed to add user");
      return;
    }

    fetchUsers();
    setShowAddModal(false);
    resetForm();
  };

  // Update user
  const handleUpdateUser = async () => {
    const response = await USER_ADMIN_API.put(`/${editingUser.id}`, formData);
    if (!response.data.success) {
      console.error("Failed to update user:", response.data.error);
    }

    fetchUsers();
    setShowEditModal(false);
    setEditingUser(null);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      pin: "",
      first_name: "",
      last_name: "",
      birthdate: "",
      family_record_number: "",
      is_alive: true,
      is_admin: false,
      email: "",
      password: "",
      governorate_id: null,
      district_id: null,
      village_id: null,
      gender_id: null,
      marital_status_id: null,
      religion_id: null,
      denomination_id: null,
      father_id: null,
      mother_id: null,
    });
    setFilteredDistricts([]);
    setFilteredVillages([]);
    setFilteredDenominations([]);
  };

  // Form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle select change for number inputs
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? parseInt(value) : null,
    }));
  };

  // Get location name by ID
  const getLocationName = (id, dataArray) => {
    const item = dataArray.find((item) => item.id === id);
    return item ? item.name : "N/A";
  };

  // Get constituency by location
  const getConstituencyByLocation = (governorateId, districtId) => {
    const constituency = constituencies.find(
      (constituency) => constituency.governorate_id === governorateId,
    );
    return constituency ? constituency.name : "N/A";
  };

  // UI components
  const getAdminBadge = (isAdmin) => {
    if (isAdmin) {
      return (
        <span className="bg-gradient-to-r from-[#6C2BD9] to-[#9D5CFF] text-white px-2 py-1 rounded-full text-xs font-medium">
          Admin
        </span>
      );
    }
    return (
      <span className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-2 py-1 rounded-full text-xs font-medium">
        User
      </span>
    );
  };

  const getStatusBadge = (isAlive) => {
    if (isAlive) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
          Alive
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
        <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
        Deceased
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Loading Header */}
            <div className="mb-8">
              <div className="h-8 bg-[#333333] rounded w-64 mb-4 animate-pulse"></div>
              <div className="h-4 bg-[#333333] rounded w-96 animate-pulse"></div>
            </div>

            {/* Loading Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-[#1A1A1A] rounded-lg border border-[#333333] animate-pulse"
                ></div>
              ))}
            </div>

            {/* Loading Table */}
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden">
              <div className="p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border-b border-[#333333] last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-[#333333] rounded-full animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-[#333333] rounded w-32 animate-pulse"></div>
                        <div className="h-3 bg-[#333333] rounded w-24 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-[#333333] rounded w-24 animate-pulse"></div>
                  </div>
                ))}
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

      <main className="min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Citizen <span className="text-[#9D5CFF]">Management</span>
            </h1>
            <p className="text-[#CCCCCC] text-lg">
              Manage citizen records, personal information, and system access
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#888888] text-sm">Total Citizens</p>
                  <p className="text-white text-2xl font-bold">
                    {users.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#888888] text-sm">Active Citizens</p>
                  <p className="text-white text-2xl font-bold">
                    {users.filter((u) => u.is_alive).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#888888] text-sm">Administrators</p>
                  <p className="text-white text-2xl font-bold">
                    {users.filter((u) => u.is_admin).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#888888] text-sm">Avg Elections Voted</p>
                  <p className="text-white text-2xl font-bold">
                    {(
                      users.reduce(
                        (sum, user) => sum + (user.elections_voted || 0),
                        0,
                      ) / users.length
                    ).toFixed(1)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                  Search Citizens
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, PIN, family record..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white placeholder-[#666666] focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                  />
                  <svg
                    className="absolute right-3 top-3 w-5 h-5 text-[#666666]"
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
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                  Filter by Role
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Administrators</option>
                  <option value="user">Regular Users</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                >
                  <option value="all">All Status</option>
                  <option value="alive">Alive</option>
                  <option value="deceased">Deceased</option>
                </select>
              </div>

              {/* Governorate Filter */}
              <div>
                <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                  Filter by Governorate
                </label>
                <select
                  value={filterGovernorate}
                  onChange={(e) => setFilterGovernorate(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                >
                  <option value="all">All Governorates</option>
                  {governorates.map((gov) => (
                    <option key={gov.id} value={gov.id}>
                      {gov.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-end">
                <div className="flex gap-2 w-full">
                  <PrimaryBTN
                    text="Add Citizen"
                    onClickFunc={() => setShowAddModal(true)}
                    disabled={false}
                  />
                  {selectedUsers.length > 0 && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Delete ({selectedUsers.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-[#333333] bg-gradient-to-r from-[#2A2A2A] to-[#333333]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Citizen Records ({filteredUsers.length})
                </h2>
                <div className="text-sm text-[#888888]">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#333333] bg-[#2A2A2A]">
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.length === currentUsers.length &&
                          currentUsers.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-[#666666] bg-[#1A1A1A] text-[#9D5CFF] focus:ring-[#9D5CFF]"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#CCCCCC]">
                      Citizen
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#CCCCCC]">
                      Personal Info
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#CCCCCC]">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#CCCCCC]">
                      Status & Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-[#CCCCCC]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333333]">
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center mb-4">
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
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0h-6"
                              />
                            </svg>
                          </div>
                          <h3 className="text-white font-semibold text-lg mb-2">
                            No Citizens Found
                          </h3>
                          <p className="text-[#888888] text-sm mb-4">
                            {searchTerm ||
                            filterRole !== "all" ||
                            filterStatus !== "all" ||
                            filterGovernorate !== "all"
                              ? "Try adjusting your search or filters"
                              : "No citizen records have been added yet"}
                          </p>
                          <PrimaryBTN
                            text="Add First Citizen"
                            onClickFunc={() => setShowAddModal(true)}
                            disabled={false}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-[#2A2A2A]/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="rounded border-[#666666] bg-[#1A1A1A] text-[#9D5CFF] focus:ring-[#9D5CFF]"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                user.gender_id === 1
                                  ? "bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]"
                                  : "bg-gradient-to-br from-[#EC4899] to-[#BE185D]"
                              }`}
                            >
                              <span className="text-white font-bold">
                                {user.first_name?.charAt(0)}
                                {user.last_name?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-[#888888] text-sm">
                                PIN: {user.pin} • Family:{" "}
                                {user.family_record_number}
                              </div>
                              <div className="text-[#666666] text-xs">
                                {user.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-[#CCCCCC] text-sm">
                              <span className="text-[#888888]">Age:</span>{" "}
                              {user.age || calculateAge(user.birthdate)} years
                            </div>
                            <div className="text-[#CCCCCC] text-sm">
                              <span className="text-[#888888]">Born:</span>{" "}
                              {formatDate(user.birthdate)}
                            </div>
                            <div className="text-[#CCCCCC] text-sm">
                              <span className="text-[#888888]">Gender:</span>{" "}
                              {user.gender_name ||
                                getLocationName(user.gender_id, genders)}
                            </div>
                            <div className="text-[#CCCCCC] text-sm">
                              <span className="text-[#888888]">Religion:</span>{" "}
                              {user.religion_name ||
                                getLocationName(
                                  user.religion_id,
                                  religions,
                                )}{" "}
                              {user.denomination_name
                                ? `(${user.denomination_name})`
                                : ""}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-[#CCCCCC] text-sm">
                              {user.governorate_name ||
                                getLocationName(
                                  user.governorate_id,
                                  governorates,
                                )}
                            </div>
                            <div className="text-[#888888] text-xs">
                              {user.district_name ||
                                getLocationName(
                                  user.district_id,
                                  districts,
                                )}{" "}
                              District
                            </div>
                            <div className="text-[#888888] text-xs">
                              {user.village_name ||
                                getLocationName(user.village_id, villages)}
                            </div>
                            <div className="text-[#666666] text-xs mt-1">
                              Constituency:{" "}
                              {getConstituencyByLocation(
                                user.governorate_id,
                                user.district_id,
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {getAdminBadge(user.is_admin)}
                              {getStatusBadge(user.is_alive)}
                            </div>
                            <div className="text-[#888888] text-xs">
                              Created: {formatDateTime(user.creation_date)}
                            </div>
                            <div className="text-[#888888] text-xs">
                              Elections Voted: {user.elections_voted || 0}
                            </div>
                            <div className="text-[#888888] text-xs">
                              Marital:{" "}
                              {user.marital_status_name ||
                                getLocationName(
                                  user.marital_status_id,
                                  maritalStatuses,
                                )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 bg-[#2A2A2A] border border-[#333333] rounded-lg hover:border-[#9D5CFF] transition-colors"
                            >
                              <svg
                                className="w-4 h-4 text-[#CCCCCC]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUsers([user.id]);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 bg-[#2A2A2A] border border-[#333333] rounded-lg hover:border-red-500 transition-colors"
                            >
                              <svg
                                className="w-4 h-4 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                (window.location.href = `/admin/citizens/${user.id}`)
                              }
                              className="p-2 bg-[#2A2A2A] border border-[#333333] rounded-lg hover:border-[#10B981] transition-colors"
                            >
                              <svg
                                className="w-4 h-4 text-[#10B981]"
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
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer - Pagination */}
            {currentUsers.length > 0 && (
              <div className="px-6 py-4 border-t border-[#333333] bg-[#2A2A2A]">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-[#888888] text-sm">
                    Showing {indexOfFirstUser + 1} to{" "}
                    {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                    {filteredUsers.length} citizens
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-[#333333] text-[#CCCCCC] rounded-lg text-sm hover:bg-[#444444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded-lg text-sm ${
                                currentPage === pageNum
                                  ? "bg-[#6C2BD9] text-white"
                                  : "bg-[#333333] text-[#CCCCCC] hover:bg-[#444444]"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 bg-[#333333] text-[#CCCCCC] rounded-lg text-sm hover:bg-[#444444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Location Statistics */}
          <div className="mt-8 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4">
              Citizen Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {governorates.map((gov) => {
                const citizensInGov = users.filter(
                  (user) => user.governorate_id === gov.id,
                );
                const percentage =
                  users.length > 0
                    ? ((citizensInGov.length / users.length) * 100).toFixed(1)
                    : 0;

                return (
                  <div
                    key={gov.id}
                    className="p-4 border border-[#333333] rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">{gov.name}</h4>
                      <span className="text-[#9D5CFF] font-bold">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-[#333333] rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-[#6C2BD9] to-[#9D5CFF] h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#888888]">
                        {citizensInGov.length} citizens
                      </span>
                      <span className="text-[#CCCCCC]">
                        {percentage}% of total
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Add Citizen Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add New Citizen</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-[#888888] hover:text-white transition-colors"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-white font-medium mb-2">
                  Personal Information
                </h4>

                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Personal Identification Number (PIN) *
                  </label>
                  <input
                    type="text"
                    name="pin"
                    value={formData.pin}
                    onChange={handleInputChange}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    placeholder="Enter PIN"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Birthdate *
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Family Record Number *
                  </label>
                  <input
                    type="text"
                    name="family_record_number"
                    value={formData.family_record_number}
                    onChange={handleInputChange}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    placeholder="Family record number"
                  />
                </div>
              </div>

              {/* Contact & Status */}
              <div className="space-y-4">
                <h4 className="text-white font-medium mb-2">
                  Contact & Status
                </h4>

                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    placeholder="Email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Password (for system access)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    placeholder="Set password"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender_id"
                      value={formData.gender_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    >
                      <option value="">Select gender</option>
                      {genders.map((gender) => (
                        <option key={gender.id} value={gender.id}>
                          {gender.name === "male" ? "Male" : "Female"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Marital Status
                    </label>
                    <select
                      name="marital_status_id"
                      value={formData.marital_status_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    >
                      <option value="">Select status</option>
                      {maritalStatuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Religion
                    </label>
                    <select
                      name="religion_id"
                      value={formData.religion_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    >
                      <option value="">Select religion</option>
                      {religions.map((religion) => (
                        <option key={religion.id} value={religion.id}>
                          {religion.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Denomination
                    </label>
                    <select
                      name="denomination_id"
                      value={formData.denomination_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                      disabled={!formData.religion_id}
                    >
                      <option value="">Select denomination</option>
                      {filteredDenominations.map((denomination) => (
                        <option key={denomination.id} value={denomination.id}>
                          {denomination.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_alive"
                      checked={formData.is_alive}
                      onChange={handleInputChange}
                      className="rounded border-[#666666] bg-[#1A1A1A] text-[#9D5CFF] focus:ring-[#9D5CFF]"
                    />
                    <label className="text-sm text-[#CCCCCC]">Is Alive</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_admin"
                      checked={formData.is_admin}
                      onChange={handleInputChange}
                      className="rounded border-[#666666] bg-[#1A1A1A] text-[#9D5CFF] focus:ring-[#9D5CFF]"
                    />
                    <label className="text-sm text-[#CCCCCC]">
                      Is Administrator
                    </label>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-white font-medium mb-2">
                  Location Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Governorate
                    </label>
                    <select
                      name="governorate_id"
                      value={formData.governorate_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    >
                      <option value="">Select governorate</option>
                      {governorates.map((gov) => (
                        <option key={gov.id} value={gov.id}>
                          {gov.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      District
                    </label>
                    <select
                      name="district_id"
                      value={formData.district_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                      disabled={!formData.governorate_id}
                    >
                      <option value="">Select district</option>
                      {filteredDistricts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Village
                    </label>
                    <select
                      name="village_id"
                      value={formData.village_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                      disabled={!formData.district_id}
                    >
                      <option value="">Select village</option>
                      {filteredVillages.map((village) => (
                        <option key={village.id} value={village.id}>
                          {village.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2.5 bg-[#333333] text-[#CCCCCC] rounded-lg font-medium hover:bg-[#444444] transition-colors"
              >
                Cancel
              </button>
              <PrimaryBTN
                text="Add Citizen"
                onClickFunc={handleAddUser}
                disabled={
                  !formData.pin ||
                  !formData.first_name ||
                  !formData.last_name ||
                  !formData.birthdate ||
                  !formData.family_record_number ||
                  !formData.gender_id
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Citizen Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Edit Citizen: {editingUser.full_name}
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                  resetForm();
                }}
                className="text-[#888888] hover:text-white transition-colors"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-white font-medium mb-2">
                  Personal Information
                </h4>

                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Personal Identification Number (PIN) *
                  </label>
                  <input
                    type="text"
                    name="pin"
                    value={formData.pin}
                    onChange={handleInputChange}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Birthdate *
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Family Record Number *
                  </label>
                  <input
                    type="text"
                    name="family_record_number"
                    value={formData.family_record_number}
                    onChange={handleInputChange}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                  />
                </div>
              </div>

              {/* Contact & Status */}
              <div className="space-y-4">
                <h4 className="text-white font-medium mb-2">
                  Contact & Status
                </h4>

                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    placeholder="New password"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender_id"
                      value={formData.gender_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    >
                      <option value="">Select gender</option>
                      {genders.map((gender) => (
                        <option key={gender.id} value={gender.id}>
                          {gender.name === "male" ? "Male" : "Female"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Marital Status
                    </label>
                    <select
                      name="marital_status_id"
                      value={formData.marital_status_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    >
                      <option value="">Select status</option>
                      {maritalStatuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Religion
                    </label>
                    <select
                      name="religion_id"
                      value={formData.religion_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    >
                      <option value="">Select religion</option>
                      {religions.map((religion) => (
                        <option key={religion.id} value={religion.id}>
                          {religion.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Denomination
                    </label>
                    <select
                      name="denomination_id"
                      value={formData.denomination_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                      disabled={!formData.religion_id}
                    >
                      <option value="">Select denomination</option>
                      {filteredDenominations.map((denomination) => (
                        <option key={denomination.id} value={denomination.id}>
                          {denomination.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_alive"
                      checked={formData.is_alive}
                      onChange={handleInputChange}
                      className="rounded border-[#666666] bg-[#1A1A1A] text-[#9D5CFF] focus:ring-[#9D5CFF]"
                    />
                    <label className="text-sm text-[#CCCCCC]">Is Alive</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_admin"
                      checked={formData.is_admin}
                      onChange={handleInputChange}
                      className="rounded border-[#666666] bg-[#1A1A1A] text-[#9D5CFF] focus:ring-[#9D5CFF]"
                    />
                    <label className="text-sm text-[#CCCCCC]">
                      Is Administrator
                    </label>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-white font-medium mb-2">
                  Location Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Governorate
                    </label>
                    <select
                      name="governorate_id"
                      value={formData.governorate_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                    >
                      <option value="">Select governorate</option>
                      {governorates.map((gov) => (
                        <option key={gov.id} value={gov.id}>
                          {gov.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      District
                    </label>
                    <select
                      name="district_id"
                      value={formData.district_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                      disabled={!formData.governorate_id}
                    >
                      <option value="">Select district</option>
                      {filteredDistricts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                      Village
                    </label>
                    <select
                      name="village_id"
                      value={formData.village_id || ""}
                      onChange={handleSelectChange}
                      className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#9D5CFF] focus:ring-1 focus:ring-[#9D5CFF]"
                      disabled={!formData.district_id}
                    >
                      <option value="">Select village</option>
                      {filteredVillages.map((village) => (
                        <option key={village.id} value={village.id}>
                          {village.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                  resetForm();
                }}
                className="px-4 py-2.5 bg-[#333333] text-[#CCCCCC] rounded-lg font-medium hover:bg-[#444444] transition-colors"
              >
                Cancel
              </button>
              <PrimaryBTN
                text="Update Citizen"
                onClickFunc={handleUpdateUser}
                disabled={
                  !formData.pin ||
                  !formData.first_name ||
                  !formData.last_name ||
                  !formData.birthdate ||
                  !formData.family_record_number ||
                  !formData.gender_id
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedUsers.length === 1
                  ? "Delete Citizen?"
                  : `Delete ${selectedUsers.length} Citizens?`}
              </h3>
              <p className="text-[#CCCCCC] mb-6">
                {selectedUsers.length === 1
                  ? "This action cannot be undone. The citizen record will be permanently deleted."
                  : "This action cannot be undone. All selected citizen records will be permanently deleted."}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2.5 bg-[#333333] text-[#CCCCCC] rounded-lg font-medium hover:bg-[#444444] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUsers}
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Delete{" "}
                {selectedUsers.length > 1 ? `(${selectedUsers.length})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsers;
