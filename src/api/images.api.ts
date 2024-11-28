// Supabase
import { supabase } from "../supabase";

const TABLE = "images";

export const IMAGES_API = {
    add: async (id: string, file: File): Promise<any> => {
        try {
            const { data: res, error } = await supabase.storage
                .from(TABLE)
                .upload(id, file);

            if (!res || error) return false;

            return res;
        } catch (error) {
            console.error("🚀 ~ error:", error);
            return false;
        }
    },

    delete: async (id: string): Promise<boolean> => {
        try {
            const { data: res, error } = await supabase.storage
                .from(TABLE)
                .remove([id]);

            if (!res || error) return false;

            return true;
        } catch (error) {
            console.error("🚀 ~ error:", error);
            return false;
        }
    },
};
