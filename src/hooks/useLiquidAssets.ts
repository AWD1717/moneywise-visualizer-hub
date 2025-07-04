
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLiquidAssets = () => {
  return useQuery({
    queryKey: ["liquid_assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("liquid_assets")
        .select(`
          *,
          accounts (
            name,
            type
          )
        `);
      
      if (error) throw error;
      return data;
    },
  });
};
