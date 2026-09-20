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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      montature: {
        Row: {
          attivo: boolean
          carati_max: number | null
          carati_min: number | null
          categoria: string
          codice: string
          descrizione: string
          forme_compatibili: string[]
          id: string
          immagine: string | null
          metalli: string[]
          nome: string
          ordine: number
        }
        Insert: {
          attivo?: boolean
          carati_max?: number | null
          carati_min?: number | null
          categoria: string
          codice: string
          descrizione: string
          forme_compatibili?: string[]
          id?: string
          immagine?: string | null
          metalli?: string[]
          nome: string
          ordine?: number
        }
        Update: {
          attivo?: boolean
          carati_max?: number | null
          carati_min?: number | null
          categoria?: string
          codice?: string
          descrizione?: string
          forme_compatibili?: string[]
          id?: string
          immagine?: string | null
          metalli?: string[]
          nome?: string
          ordine?: number
        }
        Relationships: []
      }
      nivoda_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      nivoda_token: {
        Row: {
          expires_at: string
          id: number
          token: string
        }
        Insert: {
          expires_at: string
          id?: number
          token: string
        }
        Update: {
          expires_at?: string
          id?: number
          token?: string
        }
        Relationships: []
      }
      richieste: {
        Row: {
          canale: string | null
          cliente_email: string | null
          cliente_nome: string | null
          cliente_telefono: string | null
          creata_il: string
          gioiello: string | null
          id: string
          metallo: string | null
          misura: string | null
          montatura_codice: string | null
          note: string | null
          pietra_id: string | null
          pietra_tipo: string | null
          pietra_titolo: string | null
          stato: string
        }
        Insert: {
          canale?: string | null
          cliente_email?: string | null
          cliente_nome?: string | null
          cliente_telefono?: string | null
          creata_il?: string
          gioiello?: string | null
          id?: string
          metallo?: string | null
          misura?: string | null
          montatura_codice?: string | null
          note?: string | null
          pietra_id?: string | null
          pietra_tipo?: string | null
          pietra_titolo?: string | null
          stato?: string
        }
        Update: {
          canale?: string | null
          cliente_email?: string | null
          cliente_nome?: string | null
          cliente_telefono?: string | null
          creata_il?: string
          gioiello?: string | null
          id?: string
          metallo?: string | null
          misura?: string | null
          montatura_codice?: string | null
          note?: string | null
          pietra_id?: string | null
          pietra_tipo?: string | null
          pietra_titolo?: string | null
          stato?: string
        }
        Relationships: []
      }
      saved_jewelry: {
        Row: {
          created_at: string | null
          description: string | null
          gemma: string
          id: string
          image_url: string
          materiale: string
          prezzo: string | null
          session_id: string
          stile: string
          taglio: string | null
          tipo: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          gemma: string
          id?: string
          image_url: string
          materiale: string
          prezzo?: string | null
          session_id: string
          stile: string
          taglio?: string | null
          tipo: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          gemma?: string
          id?: string
          image_url?: string
          materiale?: string
          prezzo?: string | null
          session_id?: string
          stile?: string
          taglio?: string | null
          tipo?: string
        }
        Relationships: []
      }
      site_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content_key: string
          content_type: string | null
          content_value: string | null
          created_at: string | null
          id: string
          section: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          content_key: string
          content_type?: string | null
          content_value?: string | null
          created_at?: string | null
          id?: string
          section: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          content_key?: string
          content_type?: string | null
          content_value?: string | null
          created_at?: string | null
          id?: string
          section?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
