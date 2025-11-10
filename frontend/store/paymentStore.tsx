import backendUrl from "@/lib/backendUrl";
import { create } from "zustand";

interface PaymentState {
  loading: boolean;
  error: string | null;
  createCheckoutSession: (plan: "pro" | "enterprise") => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  loading: false,
  error: null,

  createCheckoutSession: async (plan) => {
    set({ loading: true, error: null });
    try {
      const res = await backendUrl.post("/api/payment/create-checkout-session", { plan });
      
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Payment failed";
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
}));