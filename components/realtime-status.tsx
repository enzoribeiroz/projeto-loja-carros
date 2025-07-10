"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function RealtimeStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastPing, setLastPing] = useState<Date | null>(null)

  useEffect(() => {
    // Testar conexão realtime
    const testChannel = supabase
      .channel("connection-test")
      .on("presence", { event: "sync" }, () => {
        setIsConnected(true)
        setLastPing(new Date())
      })
      .subscribe((status) => {
        console.log("🔔 [Realtime] Status da conexão:", status)
        setIsConnected(status === "SUBSCRIBED")
        if (status === "SUBSCRIBED") {
          setLastPing(new Date())
        }
      })

    // Ping periódico para testar conexão
    const pingInterval = setInterval(() => {
      testChannel.send({
        type: "broadcast",
        event: "ping",
        payload: { timestamp: Date.now() },
      })
    }, 30000) // A cada 30 segundos

    return () => {
      clearInterval(pingInterval)
      supabase.removeChannel(testChannel)
    }
  }, [])

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center space-x-1">
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        <span>{isConnected ? "Tempo Real Ativo" : "Desconectado"}</span>
      </Badge>
      {lastPing && <span className="text-xs text-muted-foreground">Último ping: {lastPing.toLocaleTimeString()}</span>}
    </div>
  )
}
