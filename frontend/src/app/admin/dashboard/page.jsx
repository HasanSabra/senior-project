"use client";

import Header from "@/components/other/Header";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  CANDIDATE_ADMIN_API,
  ELECTION_ADMIN_API,
  LIST_ADMIN_API,
  USER_ADMIN_API,
} from "@/lib/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalElections: 0,
    totalLists: 0,
    totalCandidates: 0,
    pendingCandidates: 0,
    activeElections: 0,
    approvedCandidates: 0,
    deniedCandidates: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingElections, setUpcomingElections] = useState([]);

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

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [usersRes, electionsRes, listsRes, candidatesRes] =
        await Promise.allSettled([
          USER_ADMIN_API.get("/").catch(() => ({ data: { data: [] } })),
          ELECTION_ADMIN_API.get("/").catch(() => ({ data: { data: [] } })),
          LIST_ADMIN_API.get("/").catch(() => ({ data: { data: [] } })),
          CANDIDATE_ADMIN_API.get("/").catch(() => ({ data: { data: [] } })),
        ]);

      // Extract data from responses
      const usersData =
        usersRes.status === "fulfilled" && usersRes.value?.data?.success
          ? usersRes.value.data.data
          : [];

      const electionsData =
        electionsRes.status === "fulfilled" && electionsRes.value?.data?.success
          ? electionsRes.value.data.data
          : [];

      const listsData =
        listsRes.status === "fulfilled" && listsRes.value?.data?.success
          ? listsRes.value.data.data
          : [];

      const candidatesData =
        candidatesRes.status === "fulfilled" &&
        candidatesRes.value?.data?.success
          ? candidatesRes.value.data.data
          : [];

      // Calculate stats
      const totalUsers = usersData.length || 0;
      const totalElections = electionsData.length || 0;
      const totalLists = listsData.length || 0;
      const totalCandidates = candidatesData.length || 0;

      // Filter active elections
      const activeElections =
        electionsData.filter((election) => election.is_active).length || 0;

      // Filter candidates by status
      const pendingCandidates =
        candidatesData.filter((candidate) => candidate.status === "pending")
          .length || 0;
      const approvedCandidates =
        candidatesData.filter((candidate) => candidate.status === "approved")
          .length || 0;
      const deniedCandidates =
        candidatesData.filter((candidate) => candidate.status === "denied")
          .length || 0;

      // Get upcoming elections (next 7 days)
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcoming = electionsData
        .filter((election) => {
          if (!election.start_date) return false;
          const startDate = new Date(election.start_date);
          return startDate > now && startDate <= nextWeek;
        })
        .slice(0, 3);

      // Generate recent activity
      const activity = generateRecentActivity(
        electionsData,
        candidatesData,
        listsData,
      );

      setStats({
        totalUsers,
        totalElections,
        totalLists,
        totalCandidates,
        pendingCandidates,
        activeElections,
        approvedCandidates,
        deniedCandidates,
      });
      setUpcomingElections(upcoming);
      setRecentActivity(activity);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data. Please try refreshing.");
      setLoading(false);
    }
  };

  const generateRecentActivity = (elections, candidates, lists) => {
    const activities = [];

    // Add recent candidates (most recent first)
    const sortedCandidates = [...candidates]
      .sort(
        (a, b) =>
          new Date(b.created_at || b.creation_date) -
          new Date(a.created_at || a.creation_date),
      )
      .slice(0, 5);

    sortedCandidates.forEach((candidate) => {
      activities.push({
        type: "candidate",
        action: candidate.status === "pending" ? "applied" : candidate.status,
        name:
          candidate.name || `${candidate.first_name} ${candidate.last_name}`,
        election: candidate.election_name || "Unknown Election",
        time: new Date(candidate.created_at || candidate.creation_date),
        color:
          candidate.status === "pending"
            ? "yellow"
            : candidate.status === "approved"
              ? "green"
              : "red",
        icon:
          candidate.status === "pending"
            ? "⏳"
            : candidate.status === "approved"
              ? "✅"
              : "❌",
      });
    });

    // Add recent elections
    const sortedElections = [...elections]
      .sort(
        (a, b) =>
          new Date(b.created_at || b.creation_date) -
          new Date(a.created_at || a.creation_date),
      )
      .slice(0, 2);

    sortedElections.forEach((election) => {
      activities.push({
        type: "election",
        action: election.is_active ? "activated" : "created",
        name: election.name,
        time: new Date(election.created_at || election.creation_date),
        color: election.is_active ? "green" : "blue",
        icon: election.is_active ? "🏛️" : "📋",
      });
    });

    // Add recent lists
    const sortedLists = [...lists]
      .sort(
        (a, b) =>
          new Date(b.created_at || b.creation_date) -
          new Date(a.created_at || a.creation_date),
      )
      .slice(0, 2);

    sortedLists.forEach((list) => {
      activities.push({
        type: "list",
        action: "created",
        name: list.name,
        time: new Date(list.created_at || list.creation_date),
        color: "purple",
        icon: "📋",
      });
    });

    // Sort all activities by time and take top 5
    return activities.sort((a, b) => b.time - a.time).slice(0, 5);
  };

  const formatTimeAgo = (date) => {
    if (!date || isNaN(date.getTime())) return "Recently";

    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const StatCard = ({ title, value, icon, color, change, link }) => (
    <Link href={link || "#"} className="block">
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 hover:border-[#6C2BD9] transition-all duration-300 hover:scale-[1.02] group">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[#CCCCCC] text-sm mb-1">{title}</p>
            <p className="text-white font-bold text-3xl">{value}</p>
            {change && (
              <p
                className={`text-sm mt-1 ${change.includes("+") ? "text-green-400" : "text-red-400"}`}
              >
                {change}
              </p>
            )}
          </div>
          <div
            className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          >
            {icon}
          </div>
        </div>
        <div className="pt-4 border-t border-[#333333]">
          <p className="text-[#888888] text-sm flex items-center gap-1">
            View details
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </p>
        </div>
      </div>
    </Link>
  );

  const QuickAction = ({ title, description, icon, link, color }) => (
    <Link href={link} className="block">
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5 hover:border-[#6C2BD9] transition-all duration-300 hover:scale-[1.02] group">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          >
            {icon}
          </div>
          <svg
            className="w-5 h-5 text-[#666666] group-hover:text-[#9D5CFF] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
        <h4 className="text-white font-semibold mb-2">{title}</h4>
        <p className="text-[#888888] text-sm">{description}</p>
      </div>
    </Link>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-start gap-3 p-3 hover:bg-[#2A2A2A] rounded-lg transition-colors">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
          activity.color === "green"
            ? "bg-green-500/20 text-green-400"
            : activity.color === "yellow"
              ? "bg-yellow-500/20 text-yellow-400"
              : activity.color === "red"
                ? "bg-red-500/20 text-red-400"
                : activity.color === "blue"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-purple-500/20 text-purple-400"
        }`}
      >
        {activity.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="text-white font-medium truncate">{activity.name}</p>
          <span className="text-[#888888] text-sm whitespace-nowrap ml-2">
            {formatTimeAgo(activity.time)}
          </span>
        </div>
        <p className="text-[#CCCCCC] text-sm truncate">
          {activity.type === "candidate"
            ? `${activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} candidate for ${activity.election}`
            : activity.type === "election"
              ? `Election ${activity.action}`
              : `List ${activity.action}`}
        </p>
      </div>
    </div>
  );

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

            {/* Loading Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-40 bg-[#1A1A1A] rounded-xl border border-[#333333] animate-pulse"
                ></div>
              ))}
            </div>

            {/* Loading Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-96 bg-[#1A1A1A] rounded-2xl border border-[#333333] animate-pulse"></div>
              </div>
              <div>
                <div className="h-96 bg-[#1A1A1A] rounded-2xl border border-[#333333] animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
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
              <h3 className="text-white font-semibold text-xl mb-2">
                Error Loading Dashboard
              </h3>
              <p className="text-[#CCCCCC] mb-6">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-[#6C2BD9] text-white rounded-lg hover:bg-[#9D5CFF] transition-colors"
              >
                Try Again
              </button>
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
              Welcome to <span className="text-[#9D5CFF]">Admin Dashboard</span>
            </h1>
            <p className="text-[#CCCCCC] text-lg">
              Manage your election system, monitor activities, and oversee all
              operations
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Citizens"
              value={stats.totalUsers.toLocaleString()}
              icon={
                <svg
                  className="w-6 h-6 text-white"
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
              }
              color="bg-gradient-to-br from-[#6C2BD9] to-[#9D5CFF]"
              link="/admin/dashboard/users"
            />

            <StatCard
              title="Active Elections"
              value={stats.activeElections}
              icon={
                <svg
                  className="w-6 h-6 text-white"
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
              }
              color="bg-gradient-to-br from-[#10B981] to-[#059669]"
              link="/admin/dashboard/elections"
            />

            <StatCard
              title="Pending Applications"
              value={stats.pendingCandidates}
              icon={
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              color="bg-gradient-to-br from-[#F59E0B] to-[#D97706]"
              link="/admin/dashboard/candidates"
            />

            <StatCard
              title="Total Lists"
              value={stats.totalLists}
              icon={
                <svg
                  className="w-6 h-6 text-white"
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
              }
              color="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]"
              link="/admin/dashboard/lists"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <div>
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <QuickAction
                    title="Create New Election"
                    description="Set up a new election with dates and locations"
                    icon={
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    }
                    color="bg-[#6C2BD9]"
                    link="/admin/elections?create=true"
                  />

                  <QuickAction
                    title="Review Applications"
                    description="Review pending candidate applications"
                    icon={
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
                    }
                    color="bg-[#F59E0B]"
                    link="/admin/dashboard/candidates"
                  />

                  <QuickAction
                    title="Manage Lists"
                    description="Create and manage political lists"
                    icon={
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
                    }
                    color="bg-[#10B981]"
                    link="/admin/dashboard/lists"
                  />

                  <QuickAction
                    title="Add Citizen"
                    description="Register a new citizen in the system"
                    icon={
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
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                    }
                    color="bg-[#3B82F6]"
                    link="/admin/dashboard/users?create=true"
                  />
                </div>
              </div>

              {/* System Status */}
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  System Status
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#CCCCCC]">Server Status</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#CCCCCC]">Database</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#CCCCCC]">Active Sessions</span>
                    <span className="text-white font-medium">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#CCCCCC]">Last Updated</span>
                    <span className="text-[#888888] text-sm">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Upcoming Elections */}
            <div className="lg:col-span-2">
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden h-full">
                <div className="bg-gradient-to-r from-[#2A2A2A] to-[#333333] px-6 py-4 border-b border-[#333333]">
                  <h2 className="text-xl font-semibold text-white">
                    Recent Activity
                  </h2>
                  <p className="text-[#CCCCCC] text-sm">
                    Latest system activities and updates
                  </p>
                </div>

                <div className="p-6">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-12">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">
                        No Recent Activity
                      </h3>
                      <p className="text-[#888888]">
                        Activities will appear here as they occur
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {recentActivity.map((activity, index) => (
                        <ActivityItem key={index} activity={activity} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Elections */}
                <div className="border-t border-[#333333] p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Upcoming Elections
                  </h3>
                  {upcomingElections.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-[#888888]">
                        No upcoming elections in the next 7 days
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingElections.map((election) => (
                        <div
                          key={election.id}
                          className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {election.name}
                            </p>
                            <p className="text-[#888888] text-sm">
                              Starts{" "}
                              {election.start_date
                                ? new Date(
                                    election.start_date,
                                  ).toLocaleDateString()
                                : "Date not set"}
                            </p>
                          </div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            UPCOMING
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Status Overview */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 mb-8">
            <h3 className="text-white font-semibold text-lg mb-4">
              Candidate Applications Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#2A2A2A] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-2xl">
                      {stats.pendingCandidates}
                    </div>
                    <div className="text-[#CCCCCC] text-sm">Pending Review</div>
                  </div>
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-[#2A2A2A] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-2xl">
                      {stats.approvedCandidates}
                    </div>
                    <div className="text-[#CCCCCC] text-sm">Approved</div>
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

              <div className="bg-[#2A2A2A] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-2xl">
                      {stats.deniedCandidates}
                    </div>
                    <div className="text-[#CCCCCC] text-sm">Denied</div>
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
            </div>
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Citizens</h3>
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-3.205a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-[#CCCCCC] text-sm mb-4">
                Manage citizen records, personal information, and system access
              </p>
              <Link
                href="/admin/dashboard/users"
                className="inline-flex items-center text-[#9D5CFF] hover:text-[#6C2BD9] transition-colors text-sm font-medium"
              >
                Manage Citizens
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Elections</h3>
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-[#CCCCCC] text-sm mb-4">
                Create, edit, and manage elections with dates and locations
              </p>
              <Link
                href="/admin/dashboard/elections"
                className="inline-flex items-center text-[#9D5CFF] hover:text-[#6C2BD9] transition-colors text-sm font-medium"
              >
                Manage Elections
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Candidates</h3>
                <div className="w-10 h-10 bg-[#F59E0B] rounded-lg flex items-center justify-center">
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
              <p className="text-[#CCCCCC] text-sm mb-4">
                Review, approve, or deny candidate applications
              </p>
              <Link
                href="/admin/dashboard/candidates"
                className="inline-flex items-center text-[#9D5CFF] hover:text-[#6C2BD9] transition-colors text-sm font-medium"
              >
                Manage Candidates
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#333333] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Lists</h3>
                <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center">
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
              <p className="text-[#CCCCCC] text-sm mb-4">
                Create and manage political lists for elections
              </p>
              <Link
                href="/admin/dashboard/lists"
                className="inline-flex items-center text-[#9D5CFF] hover:text-[#6C2BD9] transition-colors text-sm font-medium"
              >
                Manage Lists
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6">
            <h3 className="text-white font-semibold text-lg mb-4">
              System Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {stats.totalElections}
                </div>
                <div className="text-[#888888] text-sm">Total Elections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {stats.totalLists}
                </div>
                <div className="text-[#888888] text-sm">Political Lists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {stats.totalCandidates}
                </div>
                <div className="text-[#888888] text-sm">Candidates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {stats.totalUsers}
                </div>
                <div className="text-[#888888] text-sm">Citizens</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
