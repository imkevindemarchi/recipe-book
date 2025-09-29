// Assets
import { supabase } from "../supabase";

// Types
import { THTTPResponse } from "../types";

const TABLE = "recipes";

export const RECIPE_API = {
  getAllWithFilters: async (
    from: number,
    to: number,
    name: string
  ): Promise<THTTPResponse> => {
    try {
      const {
        data,
        count: totalRecords,
        error,
      } = await supabase
        .from(TABLE)
        .select("*", { count: "exact" })
        .range(from, to)
        .ilike("name", `%${name}%`);

      if (!data || error)
        return {
          hasSuccess: false,
        };

      return {
        data,
        hasSuccess: true,
        totalRecords: totalRecords && totalRecords,
      };
    } catch (error) {
      console.error("🚀 ~ getAllWithFilters - error:", error);
      return {
        hasSuccess: false,
      };
    }
  },

  delete: async (id: string): Promise<THTTPResponse> => {
    try {
      const { error } = await supabase.from(TABLE).delete().eq("id", id);

      if (error)
        return {
          hasSuccess: false,
        };

      return {
        hasSuccess: true,
      };
    } catch (error) {
      console.error("🚀 ~ delete - error:", error);
      return {
        hasSuccess: false,
      };
    }
  },
};
