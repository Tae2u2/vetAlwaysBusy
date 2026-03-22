import bcrypt from "bcryptjs";

const STORAGE_KEY = "vet_report_auth";
const API_KEY_STORAGE = "vet_report_api_key";

const PASSWORD_HASH =
  "$2b$10$NmNtRNufZWat0nh4R8.s..sTKGwxDA1Ro2Qrh85EkP4raZtQNJ4.2";

export const verifyPassword = async (password: string): Promise<boolean> => {
  // We store the hash hardcoded - in prod this would come from backend
  // For frontend-only, we use a pre-computed hash
  console.log(password);
  console.log("hash 확인", PASSWORD_HASH);
  return bcrypt.compare(password, PASSWORD_HASH);
};

// Generate hash (run once to get the hash, utility function)
export const generateHash = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const saveAuthState = (apiKey: string) => {
  sessionStorage.setItem(STORAGE_KEY, "true");
  sessionStorage.setItem(API_KEY_STORAGE, apiKey);
};

export const getAuthState = (): {
  isAuthenticated: boolean;
  apiKey: string;
} => {
  const isAuthenticated = sessionStorage.getItem(STORAGE_KEY) === "true";
  const apiKey = sessionStorage.getItem(API_KEY_STORAGE) || "";
  return { isAuthenticated, apiKey };
};

export const clearAuthState = () => {
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(API_KEY_STORAGE);
};
