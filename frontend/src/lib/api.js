import axios from "axios";

// Default configuration
const DEFAULT_CONFIG = {
  baseURL: "http://localhost:5001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
};

// Helper function to create API instance
const createApiInstance = (endpoint) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_CONFIG.baseURL;

  const instance = axios.create({
    ...DEFAULT_CONFIG,
    baseURL: `${baseURL}${endpoint}`,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error);
      return Promise.reject(error);
    },
  );

  return instance;
};

// API instances
export const AUTH_API = createApiInstance("/api/auth");
export const USER_ADMIN_API = createApiInstance("/api/admin/users");
export const ELECTION_ADMIN_API = createApiInstance("/api/admin/elections");
export const ELECTION_USER_API = createApiInstance("/api/users/elections");
export const LIST_ADMIN_API = createApiInstance("/api/admin/lists");
export const LIST_USER_API = createApiInstance("/api/users/lists");
export const CANDIDATE_ADMIN_API = createApiInstance("/api/admin/candidates");
export const CANDIDATE_USER_API = createApiInstance("/api/users/candidates");
export const VOTE_USER_API = createApiInstance("/api/users/vote");
export const RESULT_ADMIN_API = createApiInstance("/api/admin/results");
export const RESULT_USER_API = createApiInstance("/api/users/results");

// Default export
const API_EXPORTS = {
  AUTH_API,
  USER_ADMIN_API,
  ELECTION_ADMIN_API,
  ELECTION_USER_API,
  LIST_ADMIN_API,
  LIST_USER_API,
  CANDIDATE_ADMIN_API,
  CANDIDATE_USER_API,
  VOTE_USER_API,
  RESULT_ADMIN_API,
  RESULT_USER_API,
};

export default API_EXPORTS;
