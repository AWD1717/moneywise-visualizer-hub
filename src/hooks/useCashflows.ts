
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCashflows = () => {
  return useQuery({
    queryKey: ["cashflows"],
    queryFn: async () => {
      console.log("Fetching cashflows data...");
      
      try {
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
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log("Cashflows data fetched successfully:", data);
        return data;
      } catch (error) {
        console.error("Error fetching cashflows:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });
};
