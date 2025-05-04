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
      activity_logs: {
        Row: {
          action: string
          details: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string
          id: string
          ip_address: string | null
          timestamp: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          action: string
          details?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          timestamp?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          action?: string
          details?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          timestamp?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      backup_logs: {
        Row: {
          backup_type: string
          created_at: string
          file_name: string | null
          file_size: number | null
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          backup_type: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          backup_type?: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          recurrence: string | null
          recurrence_end_date: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          recurrence?: string | null
          recurrence_end_date?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          recurrence?: string | null
          recurrence_end_date?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string | null
          distance: number
          id: string
          name: string
          state: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          distance: number
          id?: string
          name: string
          state: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          distance?: number
          id?: string
          name?: string
          state?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      company_settings: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          logo: string | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string
          user_id: string | null
          website: string | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo?: string | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
          zipcode?: string | null
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
      employees: {
        Row: {
          address: string | null
          birth_date: string | null
          city: string | null
          cpf: string | null
          created_at: string | null
          department_id: string | null
          driver_license: string | null
          driver_license_category: string | null
          driver_license_expiry: string | null
          email: string | null
          father_name: string | null
          hire_date: string | null
          id: string
          is_active: boolean | null
          mother_name: string | null
          name: string
          phone: string | null
          position: string
          rg: string | null
          role: string | null
          state: string | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          department_id?: string | null
          driver_license?: string | null
          driver_license_category?: string | null
          driver_license_expiry?: string | null
          email?: string | null
          father_name?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          mother_name?: string | null
          name: string
          phone?: string | null
          position: string
          rg?: string | null
          role?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          department_id?: string | null
          driver_license?: string | null
          driver_license_category?: string | null
          driver_license_expiry?: string | null
          email?: string | null
          father_name?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          mother_name?: string | null
          name?: string
          phone?: string | null
          position?: string
          rg?: string | null
          role?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      financial_reports: {
        Row: {
          client_id: string
          created_at: string | null
          due_date: string | null
          end_date: string
          id: string
          payment_method: string | null
          start_date: string
          status: string
          total_deliveries: number
          total_freight: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          due_date?: string | null
          end_date: string
          id?: string
          payment_method?: string | null
          start_date: string
          status: string
          total_deliveries: number
          total_freight: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          due_date?: string | null
          end_date?: string
          id?: string
          payment_method?: string | null
          start_date?: string
          status?: string
          total_deliveries?: number
          total_freight?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      fiscal_actions: {
        Row: {
          action_number: string | null
          amount_to_pay: number
          created_at: string
          id: string
          notes: string | null
          payment_date: string | null
          reason: string
          release_date: string | null
          shipment_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          action_number?: string | null
          amount_to_pay: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          reason: string
          release_date?: string | null
          shipment_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          action_number?: string | null
          amount_to_pay?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          reason?: string
          release_date?: string | null
          shipment_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_actions_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_records: {
        Row: {
          created_at: string | null
          date: string
          fuel_type: string
          id: string
          is_full: boolean | null
          liters: number
          notes: string | null
          odometer: number
          price_per_liter: number
          station: string | null
          total_cost: number
          updated_at: string | null
          user_id: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          fuel_type: string
          id?: string
          is_full?: boolean | null
          liters: number
          notes?: string | null
          odometer: number
          price_per_liter: number
          station?: string | null
          total_cost: number
          updated_at?: string | null
          user_id?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          fuel_type?: string
          id?: string
          is_full?: boolean | null
          liters?: number
          notes?: string | null
          odometer?: number
          price_per_liter?: number
          station?: string | null
          total_cost?: number
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      logbook_entries: {
        Row: {
          assistant_id: string | null
          created_at: string | null
          date: string
          departure_odometer: number
          departure_time: string
          destination: string
          driver_id: string
          end_odometer: number | null
          id: string
          notes: string | null
          purpose: string
          return_time: string | null
          status: string
          trip_distance: number | null
          updated_at: string | null
          user_id: string | null
          vehicle_id: string
        }
        Insert: {
          assistant_id?: string | null
          created_at?: string | null
          date: string
          departure_odometer: number
          departure_time: string
          destination: string
          driver_id: string
          end_odometer?: number | null
          id?: string
          notes?: string | null
          purpose: string
          return_time?: string | null
          status: string
          trip_distance?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id: string
        }
        Update: {
          assistant_id?: string | null
          created_at?: string | null
          date?: string
          departure_odometer?: number
          departure_time?: string
          destination?: string
          driver_id?: string
          end_odometer?: number | null
          id?: string
          notes?: string | null
          purpose?: string
          return_time?: string | null
          status?: string
          trip_distance?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "logbook_entries_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logbook_entries_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logbook_entries_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          cost: number
          created_at: string | null
          date: string
          description: string
          id: string
          maintenance_type: string
          notes: string | null
          odometer: number
          provider: string | null
          updated_at: string | null
          user_id: string | null
          vehicle_id: string
        }
        Insert: {
          cost: number
          created_at?: string | null
          date: string
          description: string
          id?: string
          maintenance_type: string
          notes?: string | null
          odometer: number
          provider?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id: string
        }
        Update: {
          cost?: number
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          maintenance_type?: string
          notes?: string | null
          odometer?: number
          provider?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          client_messages: boolean | null
          created_at: string
          delivery_status: boolean | null
          email_summary: boolean | null
          id: string
          new_deliveries: boolean | null
          system_alerts: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_messages?: boolean | null
          created_at?: string
          delivery_status?: boolean | null
          email_summary?: boolean | null
          id?: string
          new_deliveries?: boolean | null
          system_alerts?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_messages?: boolean | null
          created_at?: string
          delivery_status?: boolean | null
          email_summary?: boolean | null
          id?: string
          new_deliveries?: boolean | null
          system_alerts?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      price_tables: {
        Row: {
          allow_custom_pricing: boolean | null
          created_at: string | null
          default_discount: number | null
          description: string | null
          door_to_door: Json
          excess_weight: Json
          id: string
          insurance: Json
          minimum_rate: Json
          name: string
          updated_at: string | null
          user_id: string | null
          waiting_hour: Json
        }
        Insert: {
          allow_custom_pricing?: boolean | null
          created_at?: string | null
          default_discount?: number | null
          description?: string | null
          door_to_door: Json
          excess_weight: Json
          id?: string
          insurance: Json
          minimum_rate: Json
          name: string
          updated_at?: string | null
          user_id?: string | null
          waiting_hour: Json
        }
        Update: {
          allow_custom_pricing?: boolean | null
          created_at?: string | null
          default_discount?: number | null
          description?: string | null
          door_to_door?: Json
          excess_weight?: Json
          id?: string
          insurance?: Json
          minimum_rate?: Json
          name?: string
          updated_at?: string | null
          user_id?: string | null
          waiting_hour?: Json
        }
        Relationships: []
      }
      shipment_documents: {
        Row: {
          created_at: string
          id: string
          invoice_numbers: string[] | null
          is_delivered: boolean | null
          minute_number: string | null
          name: string
          notes: string | null
          packages: number | null
          shipment_id: string
          type: string
          updated_at: string
          url: string | null
          user_id: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_numbers?: string[] | null
          is_delivered?: boolean | null
          minute_number?: string | null
          name: string
          notes?: string | null
          packages?: number | null
          shipment_id: string
          type: string
          updated_at?: string
          url?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          invoice_numbers?: string[] | null
          is_delivered?: boolean | null
          minute_number?: string | null
          name?: string
          notes?: string | null
          packages?: number | null
          shipment_id?: string
          type?: string
          updated_at?: string
          url?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_documents_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          arrival_date: string | null
          arrival_flight: string | null
          carrier_name: string
          company_id: string
          company_name: string
          created_at: string
          delivery_date: string | null
          delivery_time: string | null
          id: string
          is_retained: boolean
          observations: string | null
          packages: number
          receiver_id: string | null
          receiver_name: string | null
          status: string
          tracking_number: string
          transport_mode: string
          updated_at: string
          user_id: string | null
          weight: number
        }
        Insert: {
          arrival_date?: string | null
          arrival_flight?: string | null
          carrier_name: string
          company_id: string
          company_name: string
          created_at?: string
          delivery_date?: string | null
          delivery_time?: string | null
          id?: string
          is_retained?: boolean
          observations?: string | null
          packages: number
          receiver_id?: string | null
          receiver_name?: string | null
          status: string
          tracking_number: string
          transport_mode: string
          updated_at?: string
          user_id?: string | null
          weight: number
        }
        Update: {
          arrival_date?: string | null
          arrival_flight?: string | null
          carrier_name?: string
          company_id?: string
          company_name?: string
          created_at?: string
          delivery_date?: string | null
          delivery_time?: string | null
          id?: string
          is_retained?: boolean
          observations?: string | null
          packages?: number
          receiver_id?: string | null
          receiver_name?: string | null
          status?: string
          tracking_number?: string
          transport_mode?: string
          updated_at?: string
          user_id?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "shipments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          user_id: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          user_id?: string | null
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          user_id?: string | null
          value?: Json
        }
        Relationships: []
      }
      tire_maintenance_records: {
        Row: {
          brand: string | null
          cost: number
          created_at: string | null
          date: string
          description: string | null
          id: string
          maintenance_type: string
          mileage: number
          notes: string | null
          provider: string | null
          tire_position: string
          tire_size: string | null
          updated_at: string | null
          user_id: string | null
          vehicle_id: string
        }
        Insert: {
          brand?: string | null
          cost: number
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          maintenance_type: string
          mileage: number
          notes?: string | null
          provider?: string | null
          tire_position: string
          tire_size?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id: string
        }
        Update: {
          brand?: string | null
          cost?: number
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          maintenance_type?: string
          mileage?: number
          notes?: string | null
          provider?: string | null
          tire_position?: string
          tire_size?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tire_maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string
          capacity: number
          created_at: string | null
          current_odometer: number
          fuel_type: string
          id: string
          last_oil_change: number | null
          make: string
          model: string
          next_oil_change_km: number | null
          plate: string
          status: string
          type: string
          updated_at: string | null
          user_id: string | null
          year: string
        }
        Insert: {
          brand: string
          capacity: number
          created_at?: string | null
          current_odometer: number
          fuel_type: string
          id?: string
          last_oil_change?: number | null
          make: string
          model: string
          next_oil_change_km?: number | null
          plate: string
          status: string
          type: string
          updated_at?: string | null
          user_id?: string | null
          year: string
        }
        Update: {
          brand?: string
          capacity?: number
          created_at?: string | null
          current_odometer?: number
          fuel_type?: string
          id?: string
          last_oil_change?: number | null
          make?: string
          model?: string
          next_oil_change_km?: number | null
          plate?: string
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
          year?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      has_fleet_access: {
        Args: { user_id: string }
        Returns: boolean
      }
      has_operational_access: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_manager: {
        Args: { user_id: string }
        Returns: boolean
      }
      user_can_access: {
        Args: { permission: string }
        Returns: boolean
      }
      user_has_backup_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_has_company_settings_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_has_notification_settings_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_has_system_settings_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_has_user_management_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
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
