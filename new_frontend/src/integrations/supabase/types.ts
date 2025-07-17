export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: Database["public"]["Enums"]["log_action"]
          created_at: string
          details: string | null
          id: string
          ip_address: unknown | null
          resource: string
          resource_id: string | null
          status: Database["public"]["Enums"]["log_status"] | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["log_action"]
          created_at?: string
          details?: string | null
          id?: string
          ip_address?: unknown | null
          resource: string
          resource_id?: string | null
          status?: Database["public"]["Enums"]["log_status"] | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["log_action"]
          created_at?: string
          details?: string | null
          id?: string
          ip_address?: unknown | null
          resource?: string
          resource_id?: string | null
          status?: Database["public"]["Enums"]["log_status"] | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      calendar_notes: {
        Row: {
          created_at: string
          date: string
          id: string
          note: string
          type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          note: string
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          note?: string
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contractors: {
        Row: {
          address: string | null
          certifications: string[] | null
          company: string | null
          created_at: string
          email: string | null
          hourly_rate: number | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          specialties: string[] | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          certifications?: string[] | null
          company?: string | null
          created_at?: string
          email?: string | null
          hourly_rate?: number | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          certifications?: string[] | null
          company?: string | null
          created_at?: string
          email?: string | null
          hourly_rate?: number | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          created_at: string
          id: string
          installation_date: string | null
          location: string | null
          manufacturer: string | null
          model: string | null
          name: string
          notes: string | null
          serial_number: string | null
          site_id: string | null
          specifications: Json | null
          status: string | null
          type: Database["public"]["Enums"]["equipment_type"]
          updated_at: string
          warranty_expiry: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          installation_date?: string | null
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name: string
          notes?: string | null
          serial_number?: string | null
          site_id?: string | null
          specifications?: Json | null
          status?: string | null
          type: Database["public"]["Enums"]["equipment_type"]
          updated_at?: string
          warranty_expiry?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          installation_date?: string | null
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string
          notes?: string | null
          serial_number?: string | null
          site_id?: string | null
          specifications?: Json | null
          status?: string | null
          type?: Database["public"]["Enums"]["equipment_type"]
          updated_at?: string
          warranty_expiry?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_schedules: {
        Row: {
          assigned_to: string | null
          checklist: Json | null
          created_at: string
          description: string | null
          equipment_id: string | null
          estimated_duration: number | null
          frequency_days: number | null
          id: string
          last_completed: string | null
          next_due: string | null
          priority: Database["public"]["Enums"]["work_order_priority"] | null
          status: Database["public"]["Enums"]["maintenance_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          checklist?: Json | null
          created_at?: string
          description?: string | null
          equipment_id?: string | null
          estimated_duration?: number | null
          frequency_days?: number | null
          id?: string
          last_completed?: string | null
          next_due?: string | null
          priority?: Database["public"]["Enums"]["work_order_priority"] | null
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          checklist?: Json | null
          created_at?: string
          description?: string | null
          equipment_id?: string | null
          estimated_duration?: number | null
          frequency_days?: number | null
          id?: string
          last_completed?: string | null
          next_due?: string | null
          priority?: Database["public"]["Enums"]["work_order_priority"] | null
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          display_name: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          position: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          manager_id: string | null
          name: string
          progress: number | null
          site_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          manager_id?: string | null
          name: string
          progress?: number | null
          site_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          progress?: number | null
          site_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          address: string | null
          city: string | null
          code: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          postal_code: string | null
          province: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          code?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          postal_code?: string | null
          province?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          postal_code?: string | null
          province?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      standby_exchange_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          original_schedule_id: string | null
          proposed_schedule_id: string | null
          reason: string | null
          requester_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          original_schedule_id?: string | null
          proposed_schedule_id?: string | null
          reason?: string | null
          requester_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          original_schedule_id?: string | null
          proposed_schedule_id?: string | null
          reason?: string | null
          requester_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "standby_exchange_requests_original_schedule_id_fkey"
            columns: ["original_schedule_id"]
            isOneToOne: false
            referencedRelation: "standby_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standby_exchange_requests_proposed_schedule_id_fkey"
            columns: ["proposed_schedule_id"]
            isOneToOne: false
            referencedRelation: "standby_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      standby_schedules: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          end_date: string
          id: string
          notes: string | null
          start_date: string
          status: Database["public"]["Enums"]["standby_status"] | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          end_date: string
          id?: string
          notes?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["standby_status"] | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string
          id?: string
          notes?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["standby_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      work_orders: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          completed_date: string | null
          cost: number | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          equipment_id: string | null
          estimated_hours: number | null
          id: string
          notes: string | null
          parts_required: string[] | null
          priority: Database["public"]["Enums"]["work_order_priority"] | null
          safety_requirements: string | null
          scheduled_date: string | null
          site_id: string | null
          status: Database["public"]["Enums"]["work_order_status"] | null
          title: string
          type: string | null
          updated_at: string
          vendor_contact: string | null
          vendor_email: string | null
          vendor_name: string | null
          vendor_phone: string | null
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          equipment_id?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          parts_required?: string[] | null
          priority?: Database["public"]["Enums"]["work_order_priority"] | null
          safety_requirements?: string | null
          scheduled_date?: string | null
          site_id?: string | null
          status?: Database["public"]["Enums"]["work_order_status"] | null
          title: string
          type?: string | null
          updated_at?: string
          vendor_contact?: string | null
          vendor_email?: string | null
          vendor_name?: string | null
          vendor_phone?: string | null
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          equipment_id?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          parts_required?: string[] | null
          priority?: Database["public"]["Enums"]["work_order_priority"] | null
          safety_requirements?: string | null
          scheduled_date?: string | null
          site_id?: string | null
          status?: Database["public"]["Enums"]["work_order_status"] | null
          title?: string
          type?: string | null
          updated_at?: string
          vendor_contact?: string | null
          vendor_email?: string | null
          vendor_name?: string | null
          vendor_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      equipment_type:
        | "inverter"
        | "rectifier"
        | "battery"
        | "ups"
        | "mechanical"
        | "dc_system"
      log_action: "CREATE" | "UPDATE" | "DELETE" | "VIEW" | "LOGIN" | "LOGOUT"
      log_status: "success" | "warning" | "error"
      maintenance_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "overdue"
      standby_status: "assigned" | "pending" | "completed" | "cancelled"
      work_order_priority: "low" | "medium" | "high" | "critical"
      work_order_status:
        | "open"
        | "in_progress"
        | "completed"
        | "closed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      equipment_type: [
        "inverter",
        "rectifier",
        "battery",
        "ups",
        "mechanical",
        "dc_system",
      ],
      log_action: ["CREATE", "UPDATE", "DELETE", "VIEW", "LOGIN", "LOGOUT"],
      log_status: ["success", "warning", "error"],
      maintenance_status: [
        "pending",
        "in_progress",
        "completed",
        "cancelled",
        "overdue",
      ],
      standby_status: ["assigned", "pending", "completed", "cancelled"],
      work_order_priority: ["low", "medium", "high", "critical"],
      work_order_status: [
        "open",
        "in_progress",
        "completed",
        "closed",
        "cancelled",
      ],
    },
  },
} as const
