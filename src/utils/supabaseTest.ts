
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
    
    // Test each related table
    const tables = ['accounts', 'types', 'categories'];
    const tableTests = await Promise.all(
      tables.map(async (table) => {
        try {
          const { data, error } = await supabase
            .from(table)
            .select("id, name")
            .limit(5);
          
          console.log(`${table} table test:`, { data, error });
          return { table, success: !error, data, error };
        } catch (err) {
          console.error(`Error testing ${table}:`, err);
          return { table, success: false, error: err };
        }
      })
    );
    
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
