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
      body_model_data: {
        Row: {
          body_part: string
          color_code: string | null
          created_at: string
          health_score: number
          id: string
          insights: string[] | null
          scan_id: string
        }
        Insert: {
          body_part: string
          color_code?: string | null
          created_at?: string
          health_score: number
          id?: string
          insights?: string[] | null
          scan_id: string
        }
        Update: {
          body_part?: string
          color_code?: string | null
          created_at?: string
          health_score?: number
          id?: string
          insights?: string[] | null
          scan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "body_model_data_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_health_insights: {
        Row: {
          chat_session_id: string | null
          created_at: string
          detailed_information: Json | null
          id: string
          insight_type: string
          scan_health_id: string | null
          summary: string | null
        }
        Insert: {
          chat_session_id?: string | null
          created_at?: string
          detailed_information?: Json | null
          id?: string
          insight_type: string
          scan_health_id?: string | null
          summary?: string | null
        }
        Update: {
          chat_session_id?: string | null
          created_at?: string
          detailed_information?: Json | null
          id?: string
          insight_type?: string
          scan_health_id?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_health_insights_chat_session_id_fkey"
            columns: ["chat_session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_health_insights_scan_health_id_fkey"
            columns: ["scan_health_id"]
            isOneToOne: false
            referencedRelation: "scan_health_data"
            referencedColumns: ["Name"]
          },
        ]
      }
      chat_interactions: {
        Row: {
          content: string | null
          created_at: string
          id: string
          interaction_type: string
          metadata: Json | null
          session_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type: string
          metadata?: Json | null
          session_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          metadata?: Json | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_interactions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_message_insights: {
        Row: {
          created_at: string
          health_parameter_id: string
          id: string
          message_id: string
          relevance_score: number | null
        }
        Insert: {
          created_at?: string
          health_parameter_id: string
          id?: string
          message_id: string
          relevance_score?: number | null
        }
        Update: {
          created_at?: string
          health_parameter_id?: string
          id?: string
          message_id?: string
          relevance_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_message_insights_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_user: boolean
          message: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_user?: boolean
          message: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_user?: boolean
          message?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          last_interaction: string
          session_name: string | null
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          last_interaction?: string
          session_name?: string | null
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          last_interaction?: string
          session_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      diagnoses: {
        Row: {
          created_at: string
          diagnosed_at: string | null
          history: Json[] | null
          id: string
          name: string
          notes: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          diagnosed_at?: string | null
          history?: Json[] | null
          id?: string
          name: string
          notes?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          diagnosed_at?: string | null
          history?: Json[] | null
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      health_goals: {
        Row: {
          created_at: string | null
          current_value: number
          id: string
          metric_id: string | null
          start_date: string | null
          status: string | null
          target_date: string | null
          target_value: number
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_value?: number
          id?: string
          metric_id?: string | null
          start_date?: string | null
          status?: string | null
          target_date?: string | null
          target_value: number
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_value?: number
          id?: string
          metric_id?: string | null
          start_date?: string | null
          status?: string | null
          target_date?: string | null
          target_value?: number
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      health_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      health_parameter_nutrition: {
        Row: {
          created_at: string
          id: string
          reason: string
          recommendation_id: string | null
          relevance_score: number | null
          scan_health_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          recommendation_id?: string | null
          relevance_score?: number | null
          scan_health_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          recommendation_id?: string | null
          relevance_score?: number | null
          scan_health_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_parameter_nutrition_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "nutrition_recommendations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_parameter_nutrition_scan_health_id_fkey"
            columns: ["scan_health_id"]
            isOneToOne: false
            referencedRelation: "scan_health_data"
            referencedColumns: ["Name"]
          },
        ]
      }
      health_parameter_recommendations: {
        Row: {
          created_at: string
          id: string
          recommendation_id: string | null
          relevance_score: number | null
          scan_health_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          recommendation_id?: string | null
          relevance_score?: number | null
          scan_health_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          recommendation_id?: string | null
          relevance_score?: number | null
          scan_health_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_parameter_recommendations_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "health_recommendations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_parameter_recommendations_scan_health_id_fkey"
            columns: ["scan_health_id"]
            isOneToOne: false
            referencedRelation: "scan_health_data"
            referencedColumns: ["Name"]
          },
        ]
      }
      health_parameters: {
        Row: {
          adjustment_guidance: string | null
          Category: string | null
          category_description: string | null
          created_at: string | null
          "Example Metric": string | null
          id: string
          is_latest: boolean | null
          level_explanation: string | null
          lifestyle_recommendations: Json | null
          main_category: string | null
          "Measurement Value": string | null
          replaced_by: string | null
          scan_date: string | null
          status: string | null
          Subcategory: string | null
          Trend: string | null
          trend_status: string | null
          user_id: string | null
        }
        Insert: {
          adjustment_guidance?: string | null
          Category?: string | null
          category_description?: string | null
          created_at?: string | null
          "Example Metric"?: string | null
          id?: string
          is_latest?: boolean | null
          level_explanation?: string | null
          lifestyle_recommendations?: Json | null
          main_category?: string | null
          "Measurement Value"?: string | null
          replaced_by?: string | null
          scan_date?: string | null
          status?: string | null
          Subcategory?: string | null
          Trend?: string | null
          trend_status?: string | null
          user_id?: string | null
        }
        Update: {
          adjustment_guidance?: string | null
          Category?: string | null
          category_description?: string | null
          created_at?: string | null
          "Example Metric"?: string | null
          id?: string
          is_latest?: boolean | null
          level_explanation?: string | null
          lifestyle_recommendations?: Json | null
          main_category?: string | null
          "Measurement Value"?: string | null
          replaced_by?: string | null
          scan_date?: string | null
          status?: string | null
          Subcategory?: string | null
          Trend?: string | null
          trend_status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      health_parameters_backup: {
        Row: {
          adjustment_guidance: string | null
          Category: string | null
          category_description: string | null
          "Example Metric": string | null
          id: string | null
          is_latest: boolean | null
          level_explanation: string | null
          lifestyle_recommendations: Json | null
          main_category: Database["public"]["Enums"]["health_category"] | null
          "Measurement Value": string | null
          replaced_by: string | null
          scan_date: string | null
          scan_id: string | null
          status: Database["public"]["Enums"]["health_parameter_status"] | null
          Subcategory: string | null
          Trend: string | null
          trend_status: string | null
          user_id: string | null
        }
        Insert: {
          adjustment_guidance?: string | null
          Category?: string | null
          category_description?: string | null
          "Example Metric"?: string | null
          id?: string | null
          is_latest?: boolean | null
          level_explanation?: string | null
          lifestyle_recommendations?: Json | null
          main_category?: Database["public"]["Enums"]["health_category"] | null
          "Measurement Value"?: string | null
          replaced_by?: string | null
          scan_date?: string | null
          scan_id?: string | null
          status?: Database["public"]["Enums"]["health_parameter_status"] | null
          Subcategory?: string | null
          Trend?: string | null
          trend_status?: string | null
          user_id?: string | null
        }
        Update: {
          adjustment_guidance?: string | null
          Category?: string | null
          category_description?: string | null
          "Example Metric"?: string | null
          id?: string | null
          is_latest?: boolean | null
          level_explanation?: string | null
          lifestyle_recommendations?: Json | null
          main_category?: Database["public"]["Enums"]["health_category"] | null
          "Measurement Value"?: string | null
          replaced_by?: string | null
          scan_date?: string | null
          scan_id?: string | null
          status?: Database["public"]["Enums"]["health_parameter_status"] | null
          Subcategory?: string | null
          Trend?: string | null
          trend_status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      health_recommendations: {
        Row: {
          category: Database["public"]["Enums"]["recommendation_category"]
          created_at: string
          description: string | null
          health_risks: string[] | null
          id: string
          recommended_actions: string[] | null
          substance_name: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["recommendation_category"]
          created_at?: string
          description?: string | null
          health_risks?: string[] | null
          id?: string
          recommended_actions?: string[] | null
          substance_name: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["recommendation_category"]
          created_at?: string
          description?: string | null
          health_risks?: string[] | null
          id?: string
          recommended_actions?: string[] | null
          substance_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      measurements: {
        Row: {
          category: Database["public"]["Enums"]["measurement_category"]
          created_at: string
          id: string
          notes: string | null
          parameter_name: string
          reference_max: number | null
          reference_min: number | null
          scan_id: string
          unit: string | null
          value: number
        }
        Insert: {
          category: Database["public"]["Enums"]["measurement_category"]
          created_at?: string
          id?: string
          notes?: string | null
          parameter_name: string
          reference_max?: number | null
          reference_min?: number | null
          scan_id: string
          unit?: string | null
          value: number
        }
        Update: {
          category?: Database["public"]["Enums"]["measurement_category"]
          created_at?: string
          id?: string
          notes?: string | null
          parameter_name?: string
          reference_max?: number | null
          reference_min?: number | null
          scan_id?: string
          unit?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "measurements_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_recommendations: {
        Row: {
          benefits: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          nutrients: string[] | null
          type: Database["public"]["Enums"]["nutrition_recommendation_type"]
        }
        Insert: {
          benefits?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          nutrients?: string[] | null
          type: Database["public"]["Enums"]["nutrition_recommendation_type"]
        }
        Update: {
          benefits?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          nutrients?: string[] | null
          type?: Database["public"]["Enums"]["nutrition_recommendation_type"]
        }
        Relationships: []
      }
      nutrition_tracking: {
        Row: {
          created_at: string
          followed_at: string
          id: string
          notes: string | null
          recommendation_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          followed_at?: string
          id?: string
          notes?: string | null
          recommendation_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          followed_at?: string
          id?: string
          notes?: string | null
          recommendation_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_tracking_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "nutrition_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      predictive_insights: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          current_value: string | null
          id: string
          parameter_name: string
          predicted_value: string | null
          prediction_date: string | null
          recommendation: string | null
          severity: string | null
          trend_direction: string | null
          type: Database["public"]["Enums"]["prediction_type"]
          updated_at: string | null
          user_id: string | null
          valid_until: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          current_value?: string | null
          id?: string
          parameter_name: string
          predicted_value?: string | null
          prediction_date?: string | null
          recommendation?: string | null
          severity?: string | null
          trend_direction?: string | null
          type: Database["public"]["Enums"]["prediction_type"]
          updated_at?: string | null
          user_id?: string | null
          valid_until?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          current_value?: string | null
          id?: string
          parameter_name?: string
          predicted_value?: string | null
          prediction_date?: string | null
          recommendation?: string | null
          severity?: string | null
          trend_direction?: string | null
          type?: Database["public"]["Enums"]["prediction_type"]
          updated_at?: string | null
          user_id?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          blood_type: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          gender_type: string | null
          height: number | null
          id: string
          last_name: string | null
          sex: string | null
          updated_at: string | null
          username: string | null
          weight: number | null
        }
        Insert: {
          avatar_url?: string | null
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          gender_type?: string | null
          height?: number | null
          id: string
          last_name?: string | null
          sex?: string | null
          updated_at?: string | null
          username?: string | null
          weight?: number | null
        }
        Update: {
          avatar_url?: string | null
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          gender_type?: string | null
          height?: number | null
          id?: string
          last_name?: string | null
          sex?: string | null
          updated_at?: string | null
          username?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      scan_health_data: {
        Row: {
          Category: string | null
          Dietary_Recommendations: string | null
          Info: string | null
          Measurement_Value: string | null
          Name: string
          Physical_Activity: string | null
          Possible_Symptoms: string | null
          Potential_Risks: string | null
          Related_Metrics: string | null
          Severity_Level: string | null
          Subcategory: string | null
          Suggested_Health_Goal: string | null
          Supplements: string | null
          Trend: string | null
          user_id: string | null
        }
        Insert: {
          Category?: string | null
          Dietary_Recommendations?: string | null
          Info?: string | null
          Measurement_Value?: string | null
          Name: string
          Physical_Activity?: string | null
          Possible_Symptoms?: string | null
          Potential_Risks?: string | null
          Related_Metrics?: string | null
          Severity_Level?: string | null
          Subcategory?: string | null
          Suggested_Health_Goal?: string | null
          Supplements?: string | null
          Trend?: string | null
          user_id?: string | null
        }
        Update: {
          Category?: string | null
          Dietary_Recommendations?: string | null
          Info?: string | null
          Measurement_Value?: string | null
          Name?: string
          Physical_Activity?: string | null
          Possible_Symptoms?: string | null
          Potential_Risks?: string | null
          Related_Metrics?: string | null
          Severity_Level?: string | null
          Subcategory?: string | null
          Suggested_Health_Goal?: string | null
          Supplements?: string | null
          Trend?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      scans: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          started_at: string
          status: Database["public"]["Enums"]["scan_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["scan_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["scan_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      symptom_logs: {
        Row: {
          created_at: string
          id: string
          logged_at: string
          notes: string | null
          severity: number
          symptom_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logged_at?: string
          notes?: string | null
          severity: number
          symptom_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logged_at?: string
          notes?: string | null
          severity?: number
          symptom_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "symptom_logs_symptom_id_fkey"
            columns: ["symptom_id"]
            isOneToOne: false
            referencedRelation: "symptoms"
            referencedColumns: ["id"]
          },
        ]
      }
      symptoms: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_custom: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_custom?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_custom?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      voice_settings: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
          voice_enabled: boolean | null
          voice_type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          voice_enabled?: boolean | null
          voice_type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          voice_enabled?: boolean | null
          voice_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_health_parameter_averages: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          metric: string
          avg_value: number
          measurement_unit: string
        }[]
      }
    }
    Enums: {
      gender_type: "male" | "female" | "other"
      health_category:
        | "energy_metabolic"
        | "structural_physical"
        | "pathogens_environmental"
        | "hormonal_immune"
        | "mental_digestive"
      health_parameter_status: "active" | "archived" | "replaced"
      health_parameter_type:
        | "nutrition"
        | "energy"
        | "pathogen"
        | "hormone"
        | "metabolism"
        | "environmental"
        | "respiratory"
        | "circulatory"
        | "hydration"
        | "immune"
        | "psychological"
        | "digestive"
      measurement_category:
        | "organ_system"
        | "nutrition"
        | "energy_field"
        | "tissue"
        | "pathogen"
        | "hormone"
        | "metabolism"
        | "environmental"
        | "respiratory"
        | "circulatory"
        | "physical"
        | "hydration"
        | "immune"
        | "psychological"
        | "digestive"
      nutrition_recommendation_type: "food" | "supplement" | "lifestyle"
      prediction_type: "trend" | "risk" | "projection"
      recommendation_category:
        | "allergens_contact"
        | "allergens_food"
        | "allergens_additives"
        | "allopathic_drugs"
        | "diagnostic_investigations"
        | "fragrances"
        | "herbs"
        | "homeopathic_remedies"
        | "microorganisms"
        | "pollutants"
        | "body_systems"
      scan_status: "pending" | "completed" | "failed"
      symptom_severity: "mild" | "moderate" | "severe"
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
    Enums: {
      gender_type: ["male", "female", "other"],
      health_category: [
        "energy_metabolic",
        "structural_physical",
        "pathogens_environmental",
        "hormonal_immune",
        "mental_digestive",
      ],
      health_parameter_status: ["active", "archived", "replaced"],
      health_parameter_type: [
        "nutrition",
        "energy",
        "pathogen",
        "hormone",
        "metabolism",
        "environmental",
        "respiratory",
        "circulatory",
        "hydration",
        "immune",
        "psychological",
        "digestive",
      ],
      measurement_category: [
        "organ_system",
        "nutrition",
        "energy_field",
        "tissue",
        "pathogen",
        "hormone",
        "metabolism",
        "environmental",
        "respiratory",
        "circulatory",
        "physical",
        "hydration",
        "immune",
        "psychological",
        "digestive",
      ],
      nutrition_recommendation_type: ["food", "supplement", "lifestyle"],
      prediction_type: ["trend", "risk", "projection"],
      recommendation_category: [
        "allergens_contact",
        "allergens_food",
        "allergens_additives",
        "allopathic_drugs",
        "diagnostic_investigations",
        "fragrances",
        "herbs",
        "homeopathic_remedies",
        "microorganisms",
        "pollutants",
        "body_systems",
      ],
      scan_status: ["pending", "completed", "failed"],
      symptom_severity: ["mild", "moderate", "severe"],
    },
  },
} as const
