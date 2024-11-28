// Supabase
import { supabase } from "../supabase";

// Types
import { HTTPResponseDataT, IngredientT } from "../types";

const TABLE = "ingredientsxrecipes";

export const INGREDIENTS_X_RECIPES_API = {
    getByRecipeId: async (recipeId: string): Promise<any> => {
        try {
            const { data: res, error } = await supabase
                .from(TABLE)
                .select("*")
                .eq("recipeId", recipeId);

            if (!res || error) return false;

            return res;
        } catch (error) {
            console.error("🚀 ~ error:", error);
            return false;
        }
    },

    create: async (data: IngredientT): Promise<string | boolean> => {
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

    delete: async (id: string): Promise<HTTPResponseDataT> => {
        try {
            const { error } = await supabase.from(TABLE).delete().eq("id", id);

            if (error)
                return {
                    value: false,
                };

            return {
                value: true,
            };
        } catch (error) {
            console.error("🚀 ~ error:", error);
            return {
                value: false,
            };
        }
    },
};
