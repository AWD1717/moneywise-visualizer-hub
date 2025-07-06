
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUpdateEmergencyFund = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      accumulated_funds?: number;
      custom_target?: number;
      monthly_expenses?: number;
      job_stability?: string;
      dependents?: number;
      recommended_range?: string;
      funding_deficit?: number;
    }) => {
      const { error } = await supabase
        .from("emergency_funds")
        .upsert(data);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency_funds"] });
      toast({
        title: "Success",
        description: "Emergency fund data updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update emergency fund data",
        variant: "destructive",
      });
    },
  });
};
