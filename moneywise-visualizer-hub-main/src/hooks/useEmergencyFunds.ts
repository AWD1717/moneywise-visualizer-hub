
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useEmergencyFunds = () => {
  return useQuery({
    queryKey: ["emergency_funds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emergency_funds")
        .select("*")
        .single();
      
      if (error) throw error;
      return data;
    },
  });
};
