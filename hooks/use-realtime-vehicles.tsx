"use client"

import { useState, useEffect } from "react"
import { realtimeManager, type RealtimeVehicleEvent } from "@/lib/supabase-realtime"
import { getAllVehiclesHybrid } from "@/lib/vehicles-hybrid"

export function useRealtimeVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Carregar veículos iniciais
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true)
        const allVehicles = await getAllVehiclesHybrid()
        setVehicles(allVehicles)
        setLastUpdate(new Date())
      } catch (error) {
        console.error("Error loading vehicles:", error)
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [])

  // Configurar realtime
  useEffect(() => {
    console.log("🔔 [Realtime] Configurando subscrição de veículos...")

    const unsubscribe = realtimeManager.subscribeToVehicles((event: RealtimeVehicleEvent) => {
      console.log("🔔 [Realtime] Evento recebido:", event)

      // Recarregar todos os veículos quando houver mudança
      const reloadVehicles = async () => {
        try {
          const updatedVehicles = await getAllVehiclesHybrid()
          setVehicles(updatedVehicles)
          setLastUpdate(new Date())
          console.log("✅ [Realtime] Veículos atualizados:", updatedVehicles.length)
        } catch (error) {
          console.error("❌ [Realtime] Erro ao recarregar veículos:", error)
        }
      }

      reloadVehicles()
    })

    return () => {
      console.log("🔔 [Realtime] Removendo subscrição de veículos...")
      unsubscribe()
    }
  }, [])

  return {
    vehicles,
    loading,
    lastUpdate,
    refresh: async () => {
      setLoading(true)
      try {
        const allVehicles = await getAllVehiclesHybrid()
        setVehicles(allVehicles)
        setLastUpdate(new Date())
      } catch (error) {
        console.error("Error refreshing vehicles:", error)
      } finally {
        setLoading(false)
      }
    },
  }
}
