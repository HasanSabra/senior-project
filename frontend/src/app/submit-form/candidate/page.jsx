"use client";

import Footer from "@/components/other/Footer";
import Header from "@/components/other/Header";
import PrimaryBTN from "@/components/other/PrimaryBTN";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CANDIDATE_USER_API } from "@/lib/api";

const ApplyAsCandidate = () => {
  const [formData, setFormData] = useState({
    election_id: "",
    list_id: "",
    personal_statement: "",
    experience: "",
    qual_edu: "",
    manifesto: "",
  });

  const [elections, setElections] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);
  const [showNoListsMessage, setShowNoListsMessage] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // New state for checkbox

  // Fetch elections on component mount
  useEffect(() => {
    fetchElections();
  }, []);

  // When election changes, fetch lists for that election and check existing request
  useEffect(() => {
    if (formData.election_id) {
      fetchListsForElection(formData.election_id);
      checkExistingRequest();
    } else {
      setFilteredLists([]);
      setShowNoListsMessage(false);
      setExistingRequest(null);
      setIsChecked(false); // Reset checkbox when no election
    }
  }, [formData.election_id]);

  // Update checkbox when existingRequest changes
  useEffect(() => {
    if (existingRequest) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [existingRequest]);

  const fetchElections = async () => {
    setIsLoading(true);
    try {
      const electionsResponse = await CANDIDATE_USER_API.get("/elections");
      console.log("Elections API response:", electionsResponse.data);

      if (
        electionsResponse.data.success &&
        electionsResponse.data.data.length > 0
      ) {
        setElections([
          { id: "", name: "Select an election" },
          ...electionsResponse.data.data.map((election) => ({
            id: election.id,
            name: election.name,
          })),
        ]);
      } else {
        toast.error("No elections available");
      }
    } catch (error) {
      console.error("Error fetching elections:", error);
      toast.error("Failed to load elections");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchListsForElection = async (electionId) => {
    try {
      console.log("Fetching lists for election:", electionId);
      // Try to fetch lists for this specific election
      const response = await CANDIDATE_USER_API.get(
        `/lists/election/${electionId}`,
      );
      console.log("Lists by election API response:", response.data);

      if (response.data.success) {
        const lists = response.data.data;
        if (lists.length > 0) {
          setFilteredLists([
            { id: "", name: "Select a list *" },
            ...lists.map((list) => ({
              id: list.id,
              name: list.name,
            })),
          ]);
          setShowNoListsMessage(false);
        } else {
          setFilteredLists([]);
          setShowNoListsMessage(true);
          setFormData((prev) => ({ ...prev, list_id: "" }));
        }
      } else {
        setFilteredLists([]);
        setShowNoListsMessage(true);
      }
    } catch (error) {
      console.error("Error fetching lists by election:", error);
      // If endpoint doesn't exist, use the general lists endpoint
      createDummyLists(electionId);
    }
  };

  // Temporary function to create dummy lists for testing
  const createDummyLists = async (electionId) => {
    try {
      // Get election name for better dummy list names
      const election = elections.find((e) => e.id == electionId);
      const electionName = election?.name || "Election";

      // Try to get general lists first
      const listsResponse = await CANDIDATE_USER_API.get("/lists");
      console.log("General lists API response:", listsResponse.data);

      if (listsResponse.data.success && listsResponse.data.data.length > 0) {
        setFilteredLists([
          { id: "", name: "Select a list *" },
          ...listsResponse.data.data.map((list) => ({
            id: list.id,
            name: list.name,
          })),
        ]);
        setShowNoListsMessage(false);
      } else {
        // Create dummy lists if no real lists exist
        const dummyLists = [
          { id: "1", name: `${electionName} - List A` },
          { id: "2", name: `${electionName} - List B` },
          { id: "3", name: `${electionName} - List C` },
          { id: "4", name: `${electionName} - Independent` },
        ];

        setFilteredLists([{ id: "", name: "Select a list *" }, ...dummyLists]);
        setShowNoListsMessage(false);

        toast.info("Using demonstration lists. Add real lists in database.");
      }
    } catch (error) {
      console.error("Error creating dummy lists:", error);
      setFilteredLists([]);
      setShowNoListsMessage(true);
    }
  };

  const checkExistingRequest = async () => {
    if (!formData.election_id) {
      setExistingRequest(null);
      setIsChecked(false);
      return;
    }

    setIsCheckingExisting(true);
    try {
      console.log(
        "Checking existing request for election:",
        formData.election_id,
      );
      const response = await CANDIDATE_USER_API.get(
        `/existing/${formData.election_id}`,
      );
      console.log("Existing request API response:", response.data);

      if (response.data.success) {
        if (response.data.data) {
          // Request exists
          setExistingRequest(response.data.data);
          setIsChecked(true);
          toast.info("You already have a pending request for this election", {
            toastId: "existing-request", // Prevent duplicate toasts
          });

          // If there's an existing request, pre-fill the form with its data
          setFormData((prev) => ({
            ...prev,
            list_id: response.data.data.list_id || "",
            experience: response.data.data.experience || "",
            qual_edu: response.data.data.qual_edu || "",
            personal_statement: response.data.data.personal_statement || "",
            manifesto: response.data.data.manifesto || "",
          }));
        } else {
          // No request found (response.data.data is null or undefined)
          console.log("No existing request found for this election");
          setExistingRequest(null);
          setIsChecked(false);
          // Reset form data except election_id
          setFormData((prev) => ({
            ...prev,
            list_id: "",
            experience: "",
            qual_edu: "",
            personal_statement: "",
            manifesto: "",
          }));
        }
      } else {
        // API returned success: false
        console.log("API returned success: false");
        setExistingRequest(null);
        setIsChecked(false);
        setFormData((prev) => ({
          ...prev,
          list_id: "",
          experience: "",
          qual_edu: "",
          personal_statement: "",
          manifesto: "",
        }));
      }
    } catch (error) {
      console.error("Error checking existing request:", error);
      console.log("Error details:", error.response?.data || error.message);
      setExistingRequest(null);
      setIsChecked(false);

      // Check the error status
      if (error.response?.status === 500) {
        toast.error("Server error checking existing request");
      } else if (error.response?.status === 404) {
        console.log("Endpoint /existing/:election_id returned 404");
      }
    } finally {
      setIsCheckingExisting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.election_id) {
      toast.error("Please select an election");
      return;
    }

    if (!formData.list_id) {
      toast.error("Please select a list");
      return;
    }

    if (
      !formData.experience.trim() ||
      !formData.qual_edu.trim() ||
      !formData.personal_statement.trim() ||
      !formData.manifesto.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isChecked) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await CANDIDATE_USER_API.post(`/send`, {
        ...formData,
        list_id: formData.list_id,
      });

      console.log("Submit response:", response.data);

      if (response.data.success) {
        toast.success("Application submitted successfully!");
        // Don't clear the election_id, keep it selected
        setFormData((prev) => ({
          ...prev,
          list_id: "",
          personal_statement: "",
          experience: "",
          qual_edu: "",
          manifesto: "",
        }));
        setExistingRequest(response.data.data);
        setIsChecked(true);
        toast.info("Your application is now pending review");
      } else {
        toast.error(response.data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      console.log("Error response:", error.response?.data);

      if (error.response) {
        if (error.response.status === 409) {
          toast.error("You already have a pending request for this election");
          // Refresh the existing request data
          checkExistingRequest();
        } else if (error.response.status === 401) {
          toast.error("Please log in to submit an application");
          window.location.href = "/login";
        } else if (error.response.status === 500) {
          toast.error("Server error submitting application");
        } else {
          toast.error(error.response.data.message || "Submission failed");
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!existingRequest || !formData.election_id) {
      toast.error("No request to cancel");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to cancel your application? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await CANDIDATE_USER_API.post(
        `/cancel/${formData.election_id}`,
      );

      console.log("Cancel response:", response.data);

      if (response.data.success) {
        toast.success("Application cancelled successfully");
        setExistingRequest(null);
        setIsChecked(false);
        // Reset form data but keep election selected
        setFormData((prev) => ({
          ...prev,
          list_id: "",
          experience: "",
          qual_edu: "",
          personal_statement: "",
          manifesto: "",
        }));
      } else {
        toast.error(response.data.message || "Cancellation failed");
      }
    } catch (error) {
      console.error("Error cancelling application:", error);
      console.log("Error response:", error.response?.data);
      if (error.response?.status === 404) {
        toast.error("Request not found or already cancelled");
        setExistingRequest(null);
        setIsChecked(false);
      } else if (error.response?.status === 500) {
        toast.error("Server error cancelling application");
      } else {
        toast.error(error.response?.data?.message || "Cancellation failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="min-h-screen bg-[#0E0E0E] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-linear-to-br from-[#6C2BD9] to-[#9D5CFF] rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Apply as <span className="text-[#9D5CFF]">Candidate</span>
            </h1>
            <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto">
              Submit your application to become a candidate in upcoming
              elections. Help shape the future of your community.
            </p>
          </div>

          {/* Debug info - remove in production */}
          <div className="mb-4 p-3 bg-gray-900/50 border border-gray-700 rounded-lg">
            <p className="text-gray-400 text-sm">
              Debug Info: Election ID: {formData.election_id || "None"},
              Existing Request: {existingRequest ? "Yes" : "No"}, Checking
              Status: {isCheckingExisting ? "Checking..." : "Done"}
              {existingRequest &&
                `, Status: ${existingRequest.is_approved ? "Approved" : "Pending"}`}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Open browser console (F12) to see detailed API responses
            </p>
          </div>

          {/* Existing Request Banner */}
          {existingRequest ? (
            <div className="mb-6 bg-yellow-900/20 border border-yellow-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-6 h-6 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="text-white font-semibold">
                      {existingRequest.is_approved
                        ? "✓ Approved Application"
                        : "⏳ Pending Application"}
                    </h3>
                    <p className="text-yellow-300 text-sm">
                      {existingRequest.is_approved
                        ? "Your application has been approved. You are now a candidate."
                        : "Your application is under review. You will be notified once processed."}
                    </p>
                    {existingRequest.creation_date && (
                      <p className="text-gray-400 text-xs mt-1">
                        Submitted:{" "}
                        {new Date(
                          existingRequest.creation_date,
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {!existingRequest.is_approved && (
                  <button
                    onClick={handleCancelRequest}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ) : isCheckingExisting ? (
            <div className="mb-6 bg-blue-900/20 border border-blue-700 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    Checking for existing applications...
                  </h3>
                  <p className="text-blue-300 text-xs">
                    Please wait while we check your application status
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Application Form */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#333333] shadow-2xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-linear-to-r from-[#6C2BD9] to-[#9D5CFF] px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                Candidate Application Form
              </h2>
              <p className="text-white/80 text-sm">
                Complete all fields to submit your application
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              <div className="space-y-6">
                {/* Election Selection */}
                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Election Type *
                  </label>
                  <select
                    name="election_id"
                    value={formData.election_id}
                    onChange={handleInputChange}
                    required
                    disabled={
                      isLoading ||
                      (existingRequest && existingRequest.is_approved)
                    }
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <option>Loading elections...</option>
                    ) : elections.length === 0 ? (
                      <option value="">No elections available</option>
                    ) : (
                      elections.map((election) => (
                        <option key={election.id} value={election.id}>
                          {election.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* List Selection */}
                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Political List *
                  </label>
                  <select
                    name="list_id"
                    value={formData.list_id}
                    onChange={handleInputChange}
                    required
                    disabled={
                      isLoading || existingRequest || !formData.election_id
                    }
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!formData.election_id ? (
                      <option value="">Select an election first</option>
                    ) : filteredLists.length === 0 ? (
                      <option value="">Loading lists...</option>
                    ) : filteredLists.length === 1 ? (
                      <option value="">No lists available</option>
                    ) : (
                      filteredLists.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.name}
                        </option>
                      ))
                    )}
                  </select>
                  {showNoListsMessage && formData.election_id && (
                    <p className="text-sm text-yellow-400 mt-1">
                      This election doesn't have any registered lists yet.
                    </p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Professional Experience *
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    disabled={existingRequest}
                    placeholder="Describe your professional background, previous roles, and relevant experience..."
                    rows="3"
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Qualifications */}
                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Qualifications & Education *
                  </label>
                  <textarea
                    name="qual_edu"
                    value={formData.qual_edu}
                    onChange={handleInputChange}
                    required
                    disabled={existingRequest}
                    placeholder="List your educational qualifications, certifications, and relevant training..."
                    rows="3"
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Personal Statement */}
                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Personal Statement *
                  </label>
                  <textarea
                    name="personal_statement"
                    value={formData.personal_statement}
                    onChange={handleInputChange}
                    required
                    disabled={existingRequest}
                    placeholder="Introduce yourself to voters. Share your vision, values, and why you're running for office..."
                    rows="4"
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Manifesto */}
                <div>
                  <label className="block text-[#CCCCCC] text-sm font-medium mb-2">
                    Campaign Manifesto *
                  </label>
                  <textarea
                    name="manifesto"
                    value={formData.manifesto}
                    onChange={handleInputChange}
                    required
                    disabled={existingRequest}
                    placeholder="Outline your key policy proposals, campaign promises, and what you plan to achieve if elected..."
                    rows="5"
                    className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#9D5CFF] focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    required
                    disabled={existingRequest}
                    checked={isChecked} // Use controlled state
                    onChange={handleCheckboxChange} // Add onChange handler
                    className="mt-1 w-4 h-4 text-[#6C2BD9] bg-[#2A2A2A] border-[#333333] rounded focus:ring-[#9D5CFF] focus:ring-2 disabled:opacity-50"
                  />
                  <label className="text-[#CCCCCC] text-sm">
                    I certify that all information provided is true and
                    accurate. I understand that providing false information may
                    result in disqualification and legal consequences. I agree
                    to abide by the election rules and code of conduct.
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  {existingRequest ? (
                    <div className="text-center py-4">
                      {existingRequest.is_approved ? (
                        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <svg
                              className="w-5 h-5 text-green-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p className="text-green-400 font-semibold">
                              Your application has been approved!
                            </p>
                          </div>
                          <p className="text-[#CCCCCC] text-sm mt-1">
                            You are now officially a candidate for this
                            election.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-yellow-400 font-semibold">
                              Application Pending Review
                            </span>
                          </div>
                          <p className="text-[#CCCCCC] text-sm mt-1">
                            You cannot modify your application while it's under
                            review.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <PrimaryBTN
                      text={
                        isSubmitting ? "Submitting..." : "Submit Application"
                      }
                      onClickFunc={handleSubmit}
                      disabled={
                        isSubmitting ||
                        isLoading ||
                        !formData.list_id ||
                        !formData.election_id ||
                        !isChecked // Disable if checkbox not checked
                      }
                      type="submit"
                    />
                  )}
                </div>
              </div>
            </form>

            {/* Form Footer */}
            <div className="bg-[#2A2A2A] px-6 py-4 border-t border-[#333333]">
              <div className="flex items-center justify-center gap-2 text-[#888888] text-sm">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Your application will be reviewed by the election committee
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-[#6C2BD9] rounded-xl flex items-center justify-center mx-auto mb-4">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">
                Eligibility Check
              </h3>
              <p className="text-[#CCCCCC] text-sm">
                Ensure you meet all eligibility requirements before applying
              </p>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-[#9D5CFF] rounded-xl flex items-center justify-center mx-auto mb-4">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">
                Secure Submission
              </h3>
              <p className="text-[#CCCCCC] text-sm">
                All applications are encrypted and securely stored
              </p>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-[#10B981] rounded-xl flex items-center justify-center mx-auto mb-4">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Review Process</h3>
              <p className="text-[#CCCCCC] text-sm">
                Applications are typically reviewed within 5-7 business days
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ApplyAsCandidate;
