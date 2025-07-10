import { createClient } from "@supabase/supabase-js"

// Configurações do Supabase
const supabaseUrl = "https://lgsvemxonnztfvpqytlg.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc3ZlbXhvbm56dGZ2cHF5dGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODkyNTYsImV4cCI6MjA2NTc2NTI1Nn0.kJl3K1AHOemP8MHmHx4b9iDPBOdmXxubwiI9IYr4c5M"

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types para TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          is_admin: boolean
          profile_complete: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          phone?: string | null
          is_admin?: boolean
          profile_complete?: boolean
        }
        Update: {
          email?: string
          name?: string | null
          phone?: string | null
          profile_complete?: boolean
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          name: string
          brand: string
          model: string
          year: number
          price: number
          original_price: number | null
          mileage: number
          fuel: string
          transmission: string
          color: string
          seats: number
          description: string | null
          tag: string
          category: string
          location: string
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          brand: string
          model: string
          year: number
          price: number
          original_price?: number | null
          mileage?: number
          fuel: string
          transmission: string
          color: string
          seats?: number
          description?: string | null
          tag?: string
          category?: string
          location?: string
          is_active?: boolean
          created_by?: string | null
        }
        Update: {
          name?: string
          brand?: string
          model?: string
          year?: number
          price?: number
          original_price?: number | null
          mileage?: number
          fuel?: string
          transmission?: string
          color?: string
          seats?: number
          description?: string | null
          tag?: string
          category?: string
          location?: string
          is_active?: boolean
          updated_at?: string
        }
      }
      vehicle_images: {
        Row: {
          id: string
          vehicle_id: string
          image_url: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          vehicle_id: string
          image_url: string
          is_primary?: boolean
        }
        Update: {
          image_url?: string
          is_primary?: boolean
        }
      }
      vehicle_features: {
        Row: {
          id: string
          vehicle_id: string
          feature: string
          created_at: string
        }
        Insert: {
          vehicle_id: string
          feature: string
        }
        Update: {
          feature?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          vehicle_id: string
        }
        Update: never
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          vehicle_id: string | null
          created_at: string
        }
        Insert: {
          name: string
          email: string
          phone?: string | null
          message: string
          vehicle_id?: string | null
        }
        Update: never
      }
      seller_info: {
        Row: {
          id: string
          name: string
          avatar: string
          rating: number
          phone: string
          whatsapp: string
          created_at: string
          updated_at: string
        }
        Insert: {
          name?: string
          avatar?: string
          rating?: number
          phone?: string
          whatsapp?: string
        }
        Update: {
          name?: string
          avatar?: string
          rating?: number
          phone?: string
          whatsapp?: string
          updated_at?: string
        }
      }
    }
  }
}

export type User = Database["public"]["Tables"]["users"]["Row"]
export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"]
export type VehicleImage = Database["public"]["Tables"]["vehicle_images"]["Row"]
export type VehicleFeature = Database["public"]["Tables"]["vehicle_features"]["Row"]
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"]
export type Contact = Database["public"]["Tables"]["contacts"]["Row"]
export type SellerInfo = Database["public"]["Tables"]["seller_info"]["Row"]

// Função helper para verificar se Supabase está configurado
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabase)
}
