
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNetWorth = () => {
  return useQuery({
    queryKey: ["net_worth"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("net_worth")
        .select("*")
        .order("calculated_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};
