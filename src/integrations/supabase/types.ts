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
      clients: {
        Row: {
          address: string | null
          city: string | null
          complement: string | null
          contact: string | null
          created_at: string | null
          document: string | null
          email: string | null
          id: string
          name: string
          neighborhood: string | null
          notes: string | null
          number: string | null
          phone: string | null
          price_table_id: string | null
          state: string | null
          street: string | null
          trading_name: string | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          complement?: string | null
          contact?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          name: string
          neighborhood?: string | null
          notes?: string | null
          number?: string | null
          phone?: string | null
          price_table_id?: string | null
          state?: string | null
          street?: string | null
          trading_name?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          complement?: string | null
          contact?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          name?: string
          neighborhood?: string | null
          notes?: string | null
          number?: string | null
          phone?: string | null
          price_table_id?: string | null
          state?: string | null
          street?: string | null
          trading_name?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          cargo_type: string
          cargo_value: number | null
          city_id: string | null
          client_id: string
          created_at: string | null
          delivery_date: string
          delivery_time: string
          delivery_type: string
          id: string
          minute_number: string
          notes: string | null
          occurrence: string | null
          packages: number
          receiver: string
          total_freight: number
          updated_at: string | null
          user_id: string | null
          weight: number
        }
        Insert: {
          cargo_type: string
          cargo_value?: number | null
          city_id?: string | null
          client_id: string
          created_at?: string | null
          delivery_date: string
          delivery_time: string
          delivery_type: string
          id?: string
          minute_number: string
          notes?: string | null
          occurrence?: string | null
          packages: number
          receiver: string
          total_freight: number
          updated_at?: string | null
          user_id?: string | null
          weight: number
        }
        Update: {
          cargo_type?: string
          cargo_value?: number | null
          city_id?: string | null
          client_id?: string
          created_at?: string | null
          delivery_date?: string
          delivery_time?: string
          delivery_type?: string
          id?: string
          minute_number?: string
          notes?: string | null
          occurrence?: string | null
          packages?: number
          receiver?: string
          total_freight?: number
          updated_at?: string | null
          user_id?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
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
