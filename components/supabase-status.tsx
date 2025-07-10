"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Loader2 } from "lucide-react"
import { checkSupabaseConnection, setupSupabaseDatabase } from "@/lib/supabase-setup"
import { checkEnvironmentVariables } from "@/lib/environment"

export default function SupabaseStatus() {
  const [status, setStatus] = useState<{
    connection: any
    environment: any
    setup: any
  }>({
    connection: null,
    environment: null,
    setup: null,
  })
  const [loading, setLoading] = useState(false)
  const [setupLoading, setSetupLoading] = useState(false)

  const checkStatus = async () => {
    setLoading(true)

    try {
      const [connectionResult, environmentResult] = await Promise.all([
        checkSupabaseConnection(),
        Promise.resolve(checkEnvironmentVariables()),
      ])

      setStatus({
        connection: connectionResult,
        environment: environmentResult,
        setup: status.setup, // Manter o status do setup anterior
      })
    } catch (error) {
      console.error("Erro ao verificar status:", error)
    } finally {
      setLoading(false)
    }
  }

  const runSetup = async () => {
    setSetupLoading(true)

    try {
      console.log("🚀 Iniciando setup do banco...")
      const setupResult = await setupSupabaseDatabase()
      console.log("📊 Resultado do setup:", setupResult)

      setStatus((prev) => ({
        ...prev,
        setup: setupResult,
      }))
    } catch (error) {
      console.error("❌ Erro no setup:", error)
      setStatus((prev) => ({
        ...prev,
        setup: {
          success: false,
          error: error.message,
          message: "Erro durante o setup",
        },
      }))
    } finally {
      setSetupLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const StatusIcon = ({ success }: { success: boolean | null }) => {
    if (success === null) return <AlertCircle className="h-5 w-5 text-yellow-500" />
    return success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Status da Integração Supabase
            <Button variant="outline" size="sm" onClick={checkStatus} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </CardTitle>
          <CardDescription>Verificação do status da conexão e configuração do Supabase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status das Variáveis de Ambiente */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <StatusIcon success={status.environment?.valid} />
              <div>
                <h4 className="font-medium">Variáveis de Ambiente</h4>
                <p className="text-sm text-muted-foreground">{status.environment?.message || "Verificando..."}</p>
              </div>
            </div>
            <Badge variant={status.environment?.valid ? "default" : "destructive"}>
              {status.environment?.valid ? "OK" : "Erro"}
            </Badge>
          </div>

          {/* Status da Conexão */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <StatusIcon success={status.connection?.connected} />
              <div>
                <h4 className="font-medium">Conexão Supabase</h4>
                <p className="text-sm text-muted-foreground">
                  {status.connection?.message || status.connection?.error || "Verificando..."}
                </p>
              </div>
            </div>
            <Badge variant={status.connection?.connected ? "default" : "destructive"}>
              {status.connection?.connected ? "Conectado" : "Erro"}
            </Badge>
          </div>

          {/* Setup do Banco */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <StatusIcon success={status.setup?.success} />
              <div>
                <h4 className="font-medium">Setup do Banco</h4>
                <p className="text-sm text-muted-foreground">
                  {status.setup?.success
                    ? `${status.setup.message} - ${status.setup.results?.join(", ")}`
                    : status.setup?.error || status.setup?.message || "Aguardando configuração"}
                </p>
              </div>
            </div>
            <Button onClick={runSetup} disabled={setupLoading || !status.connection?.connected} size="sm">
              {setupLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Configurando...
                </>
              ) : (
                "Configurar"
              )}
            </Button>
          </div>

          {/* Debug Info */}
          {status.setup && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Debug Info:</h4>
              <pre className="text-xs text-gray-600 overflow-auto">{JSON.stringify(status.setup, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instruções de Configuração */}
      {!status.environment?.valid && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Configuração Necessária</CardTitle>
            <CardDescription>Configure as seguintes variáveis de ambiente:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm bg-gray-100 p-4 rounded">
              <div>NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima</div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Obtenha essas informações no painel do seu projeto Supabase em Settings → API
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
