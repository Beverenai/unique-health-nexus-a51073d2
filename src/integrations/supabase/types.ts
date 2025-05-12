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
      chat_messages: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          is_user: boolean
          message: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          is_user?: boolean
          message: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          is_user?: boolean
          message?: string
          user_id?: string
        }
        Relationships: []
      }
      coherence_data: {
        Row: {
          created_at: string
          id: string
          scan_id: string
          score: number
        }
        Insert: {
          created_at?: string
          id?: string
          scan_id: string
          score: number
        }
        Update: {
          created_at?: string
          id?: string
          scan_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "coherence_data_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      health_checkins: {
        Row: {
          created_at: string
          date: string
          energy_level: number
          id: string
          mood: number
          notes: string | null
          pain_level: number | null
          sleep_quality: number
          symptoms: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          energy_level: number
          id?: string
          mood: number
          notes?: string | null
          pain_level?: number | null
          sleep_quality: number
          symptoms?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          energy_level?: number
          id?: string
          mood?: number
          notes?: string | null
          pain_level?: number | null
          sleep_quality?: number
          symptoms?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      health_issue_recipes: {
        Row: {
          created_at: string
          health_issue_id: string
          id: string
          priority: string | null
          reason: string | null
          recipe_id: string
        }
        Insert: {
          created_at?: string
          health_issue_id: string
          id?: string
          priority?: string | null
          reason?: string | null
          recipe_id: string
        }
        Update: {
          created_at?: string
          health_issue_id?: string
          id?: string
          priority?: string | null
          reason?: string | null
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_issue_recipes_health_issue_id_fkey"
            columns: ["health_issue_id"]
            isOneToOne: false
            referencedRelation: "health_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_issue_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      health_issues: {
        Row: {
          created_at: string
          description: string
          id: string
          load: number
          name: string
          scan_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          load: number
          name: string
          scan_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          load?: number
          name?: string
          scan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_issues_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      health_systems: {
        Row: {
          area: string
          causes: string
          created_at: string
          id: string
          recommendations: string
          symptoms: string
          user_id: string | null
        }
        Insert: {
          area: string
          causes: string
          created_at?: string
          id?: string
          recommendations: string
          symptoms: string
          user_id?: string | null
        }
        Update: {
          area?: string
          causes?: string
          created_at?: string
          id?: string
          recommendations?: string
          symptoms?: string
          user_id?: string | null
        }
        Relationships: []
      }
      issue_details: {
        Row: {
          created_at: string
          description: string
          id: string
          impact: number
          issue_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          impact: number
          issue_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          impact?: number
          issue_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_details_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "health_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_recommendations: {
        Row: {
          created_at: string
          id: string
          issue_id: string
          recommendation: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_id: string
          recommendation: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_id?: string
          recommendation?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_recommendations_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "health_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_recommendations: {
        Row: {
          category: string
          completed: boolean
          completed_at: string | null
          created_at: string
          due_date: string | null
          id: string
          issue_id: string | null
          plan_id: string
          priority: string
          source: string | null
          text: string
        }
        Insert: {
          category: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          issue_id?: string | null
          plan_id: string
          priority: string
          source?: string | null
          text: string
        }
        Update: {
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          issue_id?: string | null
          plan_id?: string
          priority?: string
          source?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_recommendations_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "health_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_recommendations_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "user_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recipe_ingredients: {
        Row: {
          amount: string | null
          created_at: string
          id: string
          name: string
          recipe_id: string
          unit: string | null
        }
        Insert: {
          amount?: string | null
          created_at?: string
          id?: string
          name: string
          recipe_id: string
          unit?: string | null
        }
        Update: {
          amount?: string | null
          created_at?: string
          id?: string
          name?: string
          recipe_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cook_time: number | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          health_benefits: string[] | null
          id: string
          image_url: string | null
          instructions: Json | null
          name: string
          nutritional_info: Json | null
          prep_time: number | null
          servings: number | null
          tags: string[] | null
          user_id: string | null
        }
        Insert: {
          cook_time?: number | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          health_benefits?: string[] | null
          id?: string
          image_url?: string | null
          instructions?: Json | null
          name: string
          nutritional_info?: Json | null
          prep_time?: number | null
          servings?: number | null
          tags?: string[] | null
          user_id?: string | null
        }
        Update: {
          cook_time?: number | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          health_benefits?: string[] | null
          id?: string
          image_url?: string | null
          instructions?: Json | null
          name?: string
          nutritional_info?: Json | null
          prep_time?: number | null
          servings?: number | null
          tags?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      scanner_components: {
        Row: {
          category: string
          created_at: string
          id: string
          issue_id: string
          level: number
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          issue_id: string
          level: number
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          issue_id?: string
          level?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "scanner_components_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "health_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      scans: {
        Row: {
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          start_date: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string
          status?: string
          title?: string
          user_id?: string
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
