export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          appointment_type: string | null
          created_at: string | null
          doctor_name: string
          doctor_specialty: string | null
          hospital_name: string | null
          id: string
          notes: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          appointment_type?: string | null
          created_at?: string | null
          doctor_name: string
          doctor_specialty?: string | null
          hospital_name?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          appointment_type?: string | null
          created_at?: string | null
          doctor_name?: string
          doctor_specialty?: string | null
          hospital_name?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_memberships: {
        Row: {
          circle_id: string
          id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          circle_id: string
          id?: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          circle_id?: string
          id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_memberships_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "health_circles"
            referencedColumns: ["id"]
          },
        ]
      }
      connected_devices: {
        Row: {
          ai_capability: number | null
          battery_level: number | null
          bluetooth_id: string | null
          created_at: string | null
          device_brand: string | null
          device_name: string
          device_type: string | null
          id: string
          is_connected: boolean | null
          last_sync: string | null
          sensors: Json | null
          user_id: string
        }
        Insert: {
          ai_capability?: number | null
          battery_level?: number | null
          bluetooth_id?: string | null
          created_at?: string | null
          device_brand?: string | null
          device_name: string
          device_type?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync?: string | null
          sensors?: Json | null
          user_id: string
        }
        Update: {
          ai_capability?: number | null
          battery_level?: number | null
          bluetooth_id?: string | null
          created_at?: string | null
          device_brand?: string | null
          device_name?: string
          device_type?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync?: string | null
          sensors?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string
          relationship: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone: string
          relationship: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string
          relationship?: string
          user_id?: string
        }
        Relationships: []
      }
      health_circles: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          member_count: number | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          member_count?: number | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          member_count?: number | null
          name?: string
        }
        Relationships: []
      }
      health_predictions: {
        Row: {
          condition: string
          confidence: number | null
          created_at: string | null
          id: string
          immediate_actions: Json | null
          indicators: Json | null
          lifestyle_recommendations: Json | null
          overall_health_score: number | null
          recommendation: string | null
          risk_percentage: number | null
          severity: string | null
          timeframe: string | null
          traditional_remedies: Json | null
          treatment_modality:
            | Database["public"]["Enums"]["treatment_modality"]
            | null
          user_id: string
        }
        Insert: {
          condition: string
          confidence?: number | null
          created_at?: string | null
          id?: string
          immediate_actions?: Json | null
          indicators?: Json | null
          lifestyle_recommendations?: Json | null
          overall_health_score?: number | null
          recommendation?: string | null
          risk_percentage?: number | null
          severity?: string | null
          timeframe?: string | null
          traditional_remedies?: Json | null
          treatment_modality?:
            | Database["public"]["Enums"]["treatment_modality"]
            | null
          user_id: string
        }
        Update: {
          condition?: string
          confidence?: number | null
          created_at?: string | null
          id?: string
          immediate_actions?: Json | null
          indicators?: Json | null
          lifestyle_recommendations?: Json | null
          overall_health_score?: number | null
          recommendation?: string | null
          risk_percentage?: number | null
          severity?: string | null
          timeframe?: string | null
          traditional_remedies?: Json | null
          treatment_modality?:
            | Database["public"]["Enums"]["treatment_modality"]
            | null
          user_id?: string
        }
        Relationships: []
      }
      health_vitals: {
        Row: {
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          device_id: string | null
          glucose_level: number | null
          heart_rate: number | null
          hrv: number | null
          id: string
          recorded_at: string | null
          respiratory_rate: number | null
          sleep_hours: number | null
          source: string | null
          spo2: number | null
          steps: number | null
          stress_level: number | null
          temperature: number | null
          user_id: string
        }
        Insert: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          device_id?: string | null
          glucose_level?: number | null
          heart_rate?: number | null
          hrv?: number | null
          id?: string
          recorded_at?: string | null
          respiratory_rate?: number | null
          sleep_hours?: number | null
          source?: string | null
          spo2?: number | null
          steps?: number | null
          stress_level?: number | null
          temperature?: number | null
          user_id: string
        }
        Update: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          device_id?: string | null
          glucose_level?: number | null
          heart_rate?: number | null
          hrv?: number | null
          id?: string
          recorded_at?: string | null
          respiratory_rate?: number | null
          sleep_hours?: number | null
          source?: string | null
          spo2?: number | null
          steps?: number | null
          stress_level?: number | null
          temperature?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          blood_group: string | null
          created_at: string | null
          email: string | null
          full_name: string
          gender: string | null
          health_score: number | null
          id: string
          phone: string | null
          preferred_modality:
            | Database["public"]["Enums"]["treatment_modality"]
            | null
          subscription: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          gender?: string | null
          health_score?: number | null
          id?: string
          phone?: string | null
          preferred_modality?:
            | Database["public"]["Enums"]["treatment_modality"]
            | null
          subscription?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          gender?: string | null
          health_score?: number | null
          id?: string
          phone?: string | null
          preferred_modality?:
            | Database["public"]["Enums"]["treatment_modality"]
            | null
          subscription?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      treatment_modality: "modern" | "ayurvedic" | "siddha" | "integrated"
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
      treatment_modality: ["modern", "ayurvedic", "siddha", "integrated"],
    },
  },
} as const
