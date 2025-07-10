import { supabase } from "@/lib/supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"

// Tipos para eventos em tempo real
export interface RealtimeVehicleEvent {
  eventType: "INSERT" | "UPDATE" | "DELETE"
  new?: any
  old?: any
  table: string
}

export interface RealtimeUserEvent {
  eventType: "INSERT" | "UPDATE" | "DELETE"
  new?: any
  old?: any
  table: string
}

// Classe para gerenciar conexões em tempo real
export class SupabaseRealtime {
  private channels: Map<string, RealtimeChannel> = new Map()
  private callbacks: Map<string, Function[]> = new Map()

  // Subscrever mudanças em veículos
  subscribeToVehicles(callback: (event: RealtimeVehicleEvent) => void) {
    const channelName = "vehicles-changes"

    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "vehicles",
          },
          (payload) => {
            console.log("🔔 [Realtime] Vehicle change:", payload)
            callback({
              eventType: payload.eventType as any,
              new: payload.new,
              old: payload.old,
              table: "vehicles",
            })
          },
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "vehicle_images",
          },
          (payload) => {
            console.log("🔔 [Realtime] Vehicle images change:", payload)
            callback({
              eventType: payload.eventType as any,
              new: payload.new,
              old: payload.old,
              table: "vehicle_images",
            })
          },
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "vehicle_features",
          },
          (payload) => {
            console.log("🔔 [Realtime] Vehicle features change:", payload)
            callback({
              eventType: payload.eventType as any,
              new: payload.new,
              old: payload.old,
              table: "vehicle_features",
            })
          },
        )
        .subscribe()

      this.channels.set(channelName, channel)
    }

    // Adicionar callback à lista
    if (!this.callbacks.has(channelName)) {
      this.callbacks.set(channelName, [])
    }
    this.callbacks.get(channelName)?.push(callback)

    return () => this.unsubscribe(channelName, callback)
  }

  // Subscrever mudanças em usuários
  subscribeToUsers(callback: (event: RealtimeUserEvent) => void) {
    const channelName = "users-changes"

    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "users",
          },
          (payload) => {
            console.log("🔔 [Realtime] User change:", payload)
            callback({
              eventType: payload.eventType as any,
              new: payload.new,
              old: payload.old,
              table: "users",
            })
          },
        )
        .subscribe()

      this.channels.set(channelName, channel)
    }

    if (!this.callbacks.has(channelName)) {
      this.callbacks.set(channelName, [])
    }
    this.callbacks.get(channelName)?.push(callback)

    return () => this.unsubscribe(channelName, callback)
  }

  // Subscrever mudanças em favoritos
  subscribeToFavorites(userId: string, callback: (event: any) => void) {
    const channelName = `favorites-${userId}`

    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "favorites",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("🔔 [Realtime] Favorites change:", payload)
            callback({
              eventType: payload.eventType,
              new: payload.new,
              old: payload.old,
              table: "favorites",
            })
          },
        )
        .subscribe()

      this.channels.set(channelName, channel)
    }

    if (!this.callbacks.has(channelName)) {
      this.callbacks.set(channelName, [])
    }
    this.callbacks.get(channelName)?.push(callback)

    return () => this.unsubscribe(channelName, callback)
  }

  // Cancelar subscrição
  private unsubscribe(channelName: string, callback: Function) {
    const callbacks = this.callbacks.get(channelName)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }

      // Se não há mais callbacks, remover o canal
      if (callbacks.length === 0) {
        const channel = this.channels.get(channelName)
        if (channel) {
          supabase.removeChannel(channel)
          this.channels.delete(channelName)
          this.callbacks.delete(channelName)
        }
      }
    }
  }

  // Limpar todas as subscrições
  cleanup() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel)
    })
    this.channels.clear()
    this.callbacks.clear()
  }
}

// Instância global
export const realtimeManager = new SupabaseRealtime()
