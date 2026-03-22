import bcrypt from 'bcryptjs';

const STORAGE_KEY = 'vet_report_auth';
const API_KEY_STORAGE = 'vet_report_api_key';

// bcrypt hash of 'vet!7582!woori'
const PASSWORD_HASH = '$2b$10$BVMNK44kfxvbAJJLgAbcPu0c0sFzFPWnVoKXHDV6kfJip9VDuLjU2';

export const verifyPassword = async (password: string): Promise<boolean> => {
  // We store the hash hardcoded - in prod this would come from backend
  // For frontend-only, we use a pre-computed hash
  return bcrypt.compare(password, PASSWORD_HASH);
};

// Generate hash (run once to get the hash, utility function)
export const generateHash = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const saveAuthState = (apiKey: string) => {
  sessionStorage.setItem(STORAGE_KEY, 'true');
  sessionStorage.setItem(API_KEY_STORAGE, apiKey);
};

export const getAuthState = (): { isAuthenticated: boolean; apiKey: string } => {
  const isAuthenticated = sessionStorage.getItem(STORAGE_KEY) === 'true';
  const apiKey = sessionStorage.getItem(API_KEY_STORAGE) || '';
  return { isAuthenticated, apiKey };
};

export const clearAuthState = () => {
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(API_KEY_STORAGE);
};
