"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  profileComplete: boolean
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: { name: string; email: string; phone?: string; password: string }) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      console.error("❌ Supabase não configurado!")
      setError("Supabase não configurado")
      setLoading(false)
      return
    }

    console.log("🔧 Inicializando AuthProvider...")

    // Verificar sessão atual
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          console.log("✅ Sessão encontrada:", session.user.email)
          await loadUserProfile(session.user)
        }
      } catch (error) {
        console.error("❌ Erro ao verificar sessão:", error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth state changed:", event)

      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (authUser: any) => {
    if (!supabase) return

    try {
      const { data: profiles } = await supabase.from("users").select("*").eq("id", authUser.id).limit(1)

      if (profiles && profiles.length > 0) {
        const profile = profiles[0]
        setUser({
          id: profile.id,
          name: profile.name || "Usuário",
          email: profile.email,
          phone: profile.phone,
          profileComplete: profile.profile_complete || false,
          isAdmin: profile.is_admin || false,
        })
        setError(null)
      }
    } catch (error) {
      console.error("❌ Erro ao carregar perfil:", error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!supabase) throw new Error("Supabase não configurado")

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        setError(error.message)
        throw new Error(error.message)
      }

      return !!data.user
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: {
    name: string
    email: string
    phone?: string
    password: string
  }): Promise<boolean> => {
    if (!supabase) throw new Error("Supabase não configurado")

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signUp({
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone || "",
          },
        },
      })

      if (error) {
        setError(error.message)
        throw new Error(error.message)
      }

      return !!data.user
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut()
      }
      setUser(null)
      setError(null)
    } catch (error) {
      console.error("❌ Erro no logout:", error)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user || !supabase) return

    try {
      const updateData: any = {}
      if (data.name !== undefined) updateData.name = data.name
      if (data.email !== undefined) updateData.email = data.email
      if (data.phone !== undefined) updateData.phone = data.phone
      if (data.profileComplete !== undefined) updateData.profile_complete = data.profileComplete

      const { error } = await supabase.from("users").update(updateData).eq("id", user.id)

      if (error) throw new Error(error.message)

      setUser({ ...user, ...data })
      setError(null)
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
