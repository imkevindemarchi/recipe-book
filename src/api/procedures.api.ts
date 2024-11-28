// Supabase
import { supabase } from "../supabase";

// Types
import { StepT } from "../types";

const TABLE = "procedures";

export const PROCEDURES_API = {
    getAll: async (id: string): Promise<any> => {
        try {
            const { data: res, error } = await supabase
                .from(TABLE)
                .select("*")
                .eq("recipeId", id);

            if (!res || error) return false;

            return res;
        } catch (error) {
            console.error("🚀 ~ error:", error);
            return false;
        }
    },

    create: async (data: StepT): Promise<string | boolean> => {
        try {
            const { data: res, error } = await supabase
                .from(TABLE)
                .insert([data])
                .select();

            if (!res || error) return false;

            return res[0].id;
        } catch (error) {
            console.error("🚀 ~ error:", error);
            return false;
        }
    },

    delete: async (id: string): Promise<boolean> => {
        try {
            const { error } = await supabase.from(TABLE).delete().eq("id", id);

            if (error) return false;

            return true;
        } catch (error) {
            console.error("🚀 ~ error:", error);
            return false;
        }
    },
};
