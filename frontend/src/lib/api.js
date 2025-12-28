import axios from "axios";

const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return instance;
};

export const AUTH_API = createApiInstance(process.env.NEXT_PUBLIC_AUTH_API_URL);

export const ELECTION_ADMIN_API = createApiInstance(
  process.env.NEXT_PUBLIC_ELECTION_ADMIN_API_URL,
);
export const ELECTION_USER_API = createApiInstance(
  process.env.NEXT_PUBLIC_ELECTION_USER_API_URL,
);

export const LIST_ADMIN_API = createApiInstance(
  process.env.NEXT_PUBLIC_LIST_ADMIN_API_URL,
);
export const LIST_USER_API = createApiInstance(
  process.env.NEXT_PUBLIC_LIST_USER_API_URL,
);

export const MAYORAL_API = createApiInstance(
  process.env.NEXT_PUBLIC_MAYORAL_API_URL,
);

export const PARLIAMENTARY_API = createApiInstance(
  process.env.NEXT_PUBLIC_PARLIAMENTARY_API_URL,
);
