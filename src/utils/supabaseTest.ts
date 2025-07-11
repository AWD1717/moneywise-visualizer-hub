
import { supabase } from "@/integrations/supabase/client";

export const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from("cashflows")
      .select("count")
      .limit(1);
    
    if (testError) {
      console.error("Supabase connection test failed:", testError);
      return { success: false, error: testError };
    }
    
    console.log("Supabase connection test successful");
    
    // Test each related table with proper typing
    const tableTests = await Promise.all([
      // Test accounts table
      (async () => {
        try {
          const { data, error } = await supabase
            .from("accounts")
            .select("id, name")
            .limit(5);
          
          console.log("accounts table test:", { data, error });
          return { table: "accounts", success: !error, data, error };
        } catch (err) {
          console.error("Error testing accounts:", err);
          return { table: "accounts", success: false, error: err };
        }
      })(),
      
      // Test types table
      (async () => {
        try {
          const { data, error } = await supabase
            .from("types")
            .select("id, name")
            .limit(5);
          
          console.log("types table test:", { data, error });
          return { table: "types", success: !error, data, error };
        } catch (err) {
          console.error("Error testing types:", err);
          return { table: "types", success: false, error: err };
        }
      })(),
      
      // Test categories table
      (async () => {
        try {
          const { data, error } = await supabase
            .from("categories")
            .select("id, name")
            .limit(5);
          
          console.log("categories table test:", { data, error });
          return { table: "categories", success: !error, data, error };
        } catch (err) {
          console.error("Error testing categories:", err);
          return { table: "categories", success: false, error: err };
        }
      })()
    ]);
    
    return { 
      success: true, 
      tableTests,
      message: "Connection successful" 
    };
  } catch (error) {
    console.error("Supabase connection test error:", error);
    return { success: false, error };
  }
};
