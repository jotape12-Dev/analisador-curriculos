import { create } from 'zustand';
import { AnalysisResult, AnalysisState } from '@/types/analysis';

interface AnalysisStore {
  result: AnalysisResult | null;
  status: AnalysisState;
  errorMessage: string | null;
  setResult: (result: AnalysisResult) => void;
  setStatus: (status: AnalysisState) => void;
  setError: (errorMessage: string) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  result: null,
  status: 'idle',
  errorMessage: null,

  setResult: (result) => set({ result, status: 'success', errorMessage: null }),
  setStatus: (status) => set({ status }),
  setError: (errorMessage) => set({ errorMessage, status: 'error' }),
  reset: () => set({ result: null, status: 'idle', errorMessage: null }),
}));
