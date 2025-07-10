"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function SupabaseDebug() {
  const [status, setStatus] = useState<{
    connection: boolean
    tables: string[]
    vehicles: number
    users: number
    error?: string
  }>({
    connection: false,
    tables: [],
    vehicles: 0,
    users: 0,
  })

  const checkConnection = async () => {
    try {
      // Testar conexão básica
      const { data: connectionTest, error: connectionError } = await supabase.from("users").select("count").limit(1)

      if (connectionError) {
        setStatus((prev) => ({ ...prev, error: connectionError.message }))
        return
      }

      // Listar tabelas
      const { data: tables } = await supabase.rpc("get_table_names").catch(() => ({ data: [] }))

      // Contar veículos
      const { count: vehicleCount } = await supabase.from("vehicles").select("*", { count: "exact", head: true })

      // Contar usuários
      const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true })

      setStatus({
        connection: true,
        tables: tables || [
          "users",
          "vehicles",
          "vehicle_images",
          "vehicle_features",
          "favorites",
          "contacts",
          "seller_info",
        ],
        vehicles: vehicleCount || 0,
        users: userCount || 0,
      })
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }))
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Diagnóstico Supabase
            {status.connection ? (
              <Badge variant="default" className="bg-green-500">
                Conectado
              </Badge>
            ) : (
              <Badge variant="destructive">Desconectado</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">
                <strong>Erro:</strong> {status.error}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Usuários:</p>
              <p className="text-2xl font-bold">{status.users}</p>
            </div>
            <div>
              <p className="font-medium">Veículos:</p>
              <p className="text-2xl font-bold">{status.vehicles}</p>
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Tabelas:</p>
            <div className="flex flex-wrap gap-1">
              {status.tables.map((table) => (
                <Badge key={table} variant="outline">
                  {table}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={checkConnection} className="w-full">
            Verificar Novamente
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || "Não configurada"}
            </p>
            <p>
              <strong>Key:</strong>{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configurada ✅" : "Não configurada ❌"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
