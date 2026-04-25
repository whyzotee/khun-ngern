/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import liff from '@line/liff';

interface LiffState {
  profile: any | null;
  isLoggedIn: boolean;
  isReady: boolean;
  error: string | null;
  isInClient: boolean;
  initLiff: (liffId: string) => Promise<void>;
  setProfile: (profile: any) => void;
  setError: (error: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useLiffStore = create<LiffState>((set, _get) => ({
  profile: null,
  isLoggedIn: false,
  isReady: false,
  error: null,
  isInClient: false,

  initLiff: async (liffId: string) => {
    try {
      // Check if we are running inside LINE or have a LIFF state in URL
      // liff.init is still needed to use liff.isInClient() reliably, 
      // but we can check the user agent or URL parameters as a heuristic 
      // if we want to avoid init entirely outside LINE.
      // However, the standard way is to init and then check.

      await liff.init({ liffId });
      const isInClient = liff.isInClient();

      if (!isInClient) {
        set({ isReady: true, isInClient: false });
        return;
      }

      const isLoggedIn = liff.isLoggedIn();
      set({ isReady: true, isInClient: true, isLoggedIn });

      if (isLoggedIn) {
        const profile = await liff.getProfile();
        set({ profile });
      } else {
        liff.login();
      }
    } catch (err: any) {
      set({ error: err.toString(), isReady: true });
    }
  },

  setProfile: (profile) => set({ profile }),
  setError: (error) => set({ error }),
}));
