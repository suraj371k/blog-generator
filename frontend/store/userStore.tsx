import { create } from "zustand";
import api from "@/lib/backendUrl";
import { loginUser, signupUser } from "@/schema/user.schema";

export interface User {
  _id: string;
  email: string;
  name: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: null;

  // actions
  register: (data: signupUser) => Promise<void>;
  login: (data: loginUser) => Promise<void>;
  profile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,

  register: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await api.post("/api/user/register", data);
      set({ user: res.data.user, loading: false });
    } catch (error: any) {
      console.log("Error in register store", error);
      set({ error: error?.message, loading: false });
    }
  },

  login: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await api.post("/api/user/login", data);
      set({ user: res.data.user, loading: false });
    } catch (error: any) {
      console.log("Error in login store", error);
      set({ error: error, loading: false });
    }
  },

  profile: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/api/user/profile");
      set({ user: res.data.user, loading: false });
    } catch (error: any) {
      console.log("Error in getting logged in user", error);
      set({ error: error, loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await api.post("/api/user/logout");
      
      // Clear user data from store
      set({ user: null, loading: false });
      
      // Clear any cached API state
      if (api.defaults.headers.common['Authorization']) {
        delete api.defaults.headers.common['Authorization'];
      }

      // Force a page reload to clear any cached state
      window.location.href = '/';
    } catch (error: any) {
      console.log("Error in logout store", error);
      set({ error: error?.message || "Logout failed", loading: false });
      
      // Even if the API call fails, clear the local state
      set({ user: null });
      window.location.href = '/';
    } 
  },
}));
