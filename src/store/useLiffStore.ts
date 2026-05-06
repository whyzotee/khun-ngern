/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import liff from '@line/liff';

interface LiffState {
  profile: any | null;
  isLoggedIn: boolean;
  isReady: boolean;
  error: string | null;
  isInClient: boolean;
  currentLiffId: string | null;
  initLiff: (liffId: string) => Promise<void>;
  setProfile: (profile: any) => void;
  setError: (error: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useLiffStore = create<LiffState>((set, get) => ({
  profile: null,
  isLoggedIn: false,
  isReady: false,
  error: null,
  isInClient: false,
  currentLiffId: null,

  initLiff: async (liffId: string) => {
    // Avoid re-initializing if same ID is already ready
    if (get().isReady && get().currentLiffId === liffId) return;

    try {
      set({ isReady: false, error: null });
      await liff.init({ liffId });
      const isInClient = liff.isInClient();
      const isLoggedIn = liff.isLoggedIn();
      
      set({ isReady: true, isInClient, isLoggedIn, currentLiffId: liffId });

      if (isLoggedIn) {
        const profile = await liff.getProfile();
        set({ profile });
        
        // Sync user with Supabase
        try {
          const { supabase } = await import('@/lib/supabase');
          await supabase.functions.invoke('sync-user', {
            body: {
              line_user_id: profile.userId,
              display_name: profile.displayName,
              picture_url: profile.pictureUrl
            }
          });
        } catch (syncErr) {
          console.error('Failed to sync user:', syncErr);
        }
      } else if (isInClient) {
        // Only auto-login if inside LINE
        liff.login();
      }
    } catch (err: any) {
      console.error('LIFF Init Error:', err);
      set({ error: err.toString(), isReady: true });
    }
  },

  setProfile: (profile) => set({ profile }),
  setError: (error) => set({ error }),
}));
