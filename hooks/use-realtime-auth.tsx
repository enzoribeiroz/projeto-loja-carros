"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-supabase"
import { realtimeManager } from "@/lib/supabase-realtime"

export function useRealtimeAuth() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    console.log("🔔 [Realtime] Configurando subscrição de usuário:", user.id)

    const unsubscribe = realtimeManager.subscribeToUsers((event) => {
      console.log("🔔 [Realtime] Mudança no usuário:", event)

      // Se o usuário atual foi modificado, pode recarregar dados
      if (event.new?.id === user.id || event.old?.id === user.id) {
        console.log("🔔 [Realtime] Usuário atual foi modificado")
        // Aqui você pode disparar uma atualização do contexto de auth
      }
    })

    return () => {
      console.log("🔔 [Realtime] Removendo subscrição de usuário")
      unsubscribe()
    }
  }, [user])
}
