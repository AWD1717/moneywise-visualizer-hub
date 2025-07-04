export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          name: string
          type: string
        }
        Insert: {
          id?: string
          name: string
          type: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          allocated_amount: number | null
          category_id: string | null
          expected_amount: number
          id: string
          month: string
          year: number
        }
        Insert: {
          allocated_amount?: number | null
          category_id?: string | null
          expected_amount: number
          id?: string
          month: string
          year: number
        }
        Update: {
          allocated_amount?: number | null
          category_id?: string | null
          expected_amount?: number
          id?: string
          month?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cashflows: {
        Row: {
          account_id: string | null
          category_id: string | null
          credit: number | null
          date: string
          debit: number | null
          description: string | null
          id: string
          month: string
          type_id: string | null
        }
        Insert: {
          account_id?: string | null
          category_id?: string | null
          credit?: number | null
          date: string
          debit?: number | null
          description?: string | null
          id?: string
          month: string
          type_id?: string | null
        }
        Update: {
          account_id?: string | null
          category_id?: string | null
          credit?: number | null
          date?: string
          debit?: number | null
          description?: string | null
          id?: string
          month?: string
          type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cashflows_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cashflows_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cashflows_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "types"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          type_id: string | null
        }
        Insert: {
          id?: string
          name: string
          type_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "types"
            referencedColumns: ["id"]
          },
        ]
      }
      daniel_finance_statement: {
        Row: {
          Account: string | null
          Balance: number | null
          Category: string | null
          Credit: number | null
          DATA_NUMBER: string
          Date: string | null
          Debit: number | null
          Description: string | null
          Month: string | null
          new_date: string | null
          Type: string | null
        }
        Insert: {
          Account?: string | null
          Balance?: number | null
          Category?: string | null
          Credit?: number | null
          DATA_NUMBER: string
          Date?: string | null
          Debit?: number | null
          Description?: string | null
          Month?: string | null
          new_date?: string | null
          Type?: string | null
        }
        Update: {
          Account?: string | null
          Balance?: number | null
          Category?: string | null
          Credit?: number | null
          DATA_NUMBER?: string
          Date?: string | null
          Debit?: number | null
          Description?: string | null
          Month?: string | null
          new_date?: string | null
          Type?: string | null
        }
        Relationships: []
      }
      debts: {
        Row: {
          balance: number | null
          due_date: string | null
          id: string
          interest_rate: number | null
          minimum_payment: number | null
          name: string | null
          notes: string | null
          strategy: string | null
        }
        Insert: {
          balance?: number | null
          due_date?: string | null
          id?: string
          interest_rate?: number | null
          minimum_payment?: number | null
          name?: string | null
          notes?: string | null
          strategy?: string | null
        }
        Update: {
          balance?: number | null
          due_date?: string | null
          id?: string
          interest_rate?: number | null
          minimum_payment?: number | null
          name?: string | null
          notes?: string | null
          strategy?: string | null
        }
        Relationships: []
      }
      emergency_funds: {
        Row: {
          accumulated_funds: number | null
          custom_target: number | null
          dependents: number | null
          funding_deficit: number | null
          id: string
          job_stability: string | null
          monthly_expenses: number | null
          recommended_range: string | null
        }
        Insert: {
          accumulated_funds?: number | null
          custom_target?: number | null
          dependents?: number | null
          funding_deficit?: number | null
          id?: string
          job_stability?: string | null
          monthly_expenses?: number | null
          recommended_range?: string | null
        }
        Update: {
          accumulated_funds?: number | null
          custom_target?: number | null
          dependents?: number | null
          funding_deficit?: number | null
          id?: string
          job_stability?: string | null
          monthly_expenses?: number | null
          recommended_range?: string | null
        }
        Relationships: []
      }
      investments: {
        Row: {
          buy_price: number | null
          currency: string | null
          current_price: number | null
          id: string
          name: string | null
          platform: string | null
          quantity: number | null
          sector: string | null
          symbol: string | null
          type: string | null
        }
        Insert: {
          buy_price?: number | null
          currency?: string | null
          current_price?: number | null
          id?: string
          name?: string | null
          platform?: string | null
          quantity?: number | null
          sector?: string | null
          symbol?: string | null
          type?: string | null
        }
        Update: {
          buy_price?: number | null
          currency?: string | null
          current_price?: number | null
          id?: string
          name?: string | null
          platform?: string | null
          quantity?: number | null
          sector?: string | null
          symbol?: string | null
          type?: string | null
        }
        Relationships: []
      }
      liquid_assets: {
        Row: {
          account_id: string | null
          balance: number
          id: string
        }
        Insert: {
          account_id?: string | null
          balance?: number
          id?: string
        }
        Update: {
          account_id?: string | null
          balance?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "liquid_assets_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      net_worth: {
        Row: {
          calculated_at: string
          id: string
          net_worth: number
          total_assets: number
          total_liabilities: number
        }
        Insert: {
          calculated_at: string
          id?: string
          net_worth: number
          total_assets: number
          total_liabilities: number
        }
        Update: {
          calculated_at?: string
          id?: string
          net_worth?: number
          total_assets?: number
          total_liabilities?: number
        }
        Relationships: []
      }
      non_liquid_assets: {
        Row: {
          asset_type: string
          depreciation: number | null
          id: string
          name: string
          value: number
        }
        Insert: {
          asset_type: string
          depreciation?: number | null
          id?: string
          name: string
          value?: number
        }
        Update: {
          asset_type?: string
          depreciation?: number | null
          id?: string
          name?: string
          value?: number
        }
        Relationships: []
      }
      types: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
