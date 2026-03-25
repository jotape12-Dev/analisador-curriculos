import { create } from 'zustand';
import { AnalysisResult, AnalysisState } from '@/types/analysis';

interface UserData {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
}

interface ProfileData {
  analysis_count: number;
  is_premium: boolean;
}

interface AnalysisStore {
  result: AnalysisResult | null;
  status: AnalysisState;
  errorMessage: string | null;
  isPremium: boolean;
  user: UserData | null;
  profile: ProfileData | null;
  setResult: (result: AnalysisResult) => void;
  setStatus: (status: AnalysisState) => void;
  setError: (errorMessage: string) => void;
  setPremium: (value: boolean) => void;
  setUser: (user: UserData | null) => void;
  setProfile: (profile: ProfileData | null) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  result: null,
  status: 'idle',
  errorMessage: null,
  isPremium: false,
  user: null,
  profile: null,

  setResult: (result) => set({ result, status: 'success', errorMessage: null }),
  setStatus: (status) => set({ status }),
  setError: (errorMessage) => set({ errorMessage, status: 'error' }),
  setPremium: (value) => set({ isPremium: value }),
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile, isPremium: profile?.is_premium ?? false }),
  reset: () => set({ result: null, status: 'idle', errorMessage: null }),
}));
