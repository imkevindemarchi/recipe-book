// Assets
import { supabase } from "../supabase";

// Types
import { THTTPResponse, TLoginPayload } from "../types";

export const AUTH_API = {
  login: async (payload: TLoginPayload): Promise<THTTPResponse> => {
    try {
      const res: any = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (!res?.data || res?.error) {
        return {
          hasSuccess: false,
        };
      }

      return {
        data: res.data.session,
        hasSuccess: true,
      };
    } catch (error) {
      console.error("🚀 ~ login - error:", error);
      return {
        hasSuccess: false,
      };
    }
  },
};
