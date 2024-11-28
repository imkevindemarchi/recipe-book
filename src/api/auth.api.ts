// Supabase
import { supabase } from "../supabase";

// Types
import { HTTPResponseDataT } from "../types";

export const AUTH_API = {
    login: async (
        email: string,
        password: string
    ): Promise<HTTPResponseDataT> => {
        try {
            const res = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            return {
                data: res.data.session,
                value: true,
            };
        } catch (error) {
            console.error("🚀 ~ error:", error);
            return {
                data: null,
                value: false,
            };
        }
    },

    checkSession: async (): Promise<HTTPResponseDataT> => {
        try {
            const res = await supabase.auth.refreshSession();

            return {
                data: res.data.session,
                value: true,
            };
        } catch (error) {
            console.error("🚀 ~ error:", error);
            return {
                data: null,
                value: false,
            };
        }
    },

    logout: async (): Promise<boolean> => {
        try {
            const res = await supabase.auth.signOut();
            if (!res || res.error) return false;

            return true;
        } catch (error) {
            console.error("🚀 ~ error:", error);
            return false;
        }
    },
};
