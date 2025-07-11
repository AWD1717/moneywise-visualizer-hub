
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCashflows = () => {
  return useQuery({
    queryKey: ["cashflows"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cashflows")
        .select(`
          *,
          accounts (
            name
          ),
          categories (
            name
          ),
          types (
            name
          )
        `)
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};
