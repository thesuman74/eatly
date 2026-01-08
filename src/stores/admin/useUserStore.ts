// src/stores/userStore.ts
import { create } from "zustand";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface UserState {
  user: any | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  fetchUser: async () => {
    set({ loading: true });
    try {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        set({ user: null });
        return;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("id, role, restaurant_id")
        .eq("id", authUser.id)
        .maybeSingle();

      if (error || !userData) {
        console.error(error);
        set({ user: null });
        return;
      }

      set({
        user: {
          id: userData.id,
          role: userData.role,
          restaurant_id: userData.restaurant_id ?? undefined,
        },
      });
    } catch (err) {
      console.error(err);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },
}));
