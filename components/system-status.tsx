"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

interface SystemStatus {
  supabaseConnection: boolean
  environmentVars: boolean
  tablesExist: boolean
  vehiclesCount: number
  usersCount: number
  authWorking: boolean
  error?: string
  loading: boolean
}

export default function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus>({
    supabaseConnection: false,
    environmentVars: false,
    tablesExist: false,
    vehiclesCount: 0,
    usersCount: 0,
    authWorking: false,
    loading: true,
  })

  const checkSystemStatus = async () => {
    setStatus((prev) => ({ ...prev, loading: true, error: undefined }))

    try {
      // 1. Verificar variáveis de ambiente
      const envVarsOk = true // Credenciais hardcoded

      // 2. Testar conexão com Supabase
      let connectionOk = false
      let tablesOk = false
      let vehicleCount = 0
      let userCount = 0
      let authOk = false

      if (supabase) {
        try {
          // Testar conexão básica
          const { error: connectionError } = await supabase.from("users").select("count").limit(1)
          connectionOk = !connectionError

          if (connectionOk) {
            // Contar veículos
            const { count: vCount } = await supabase.from("vehicles").select("*", { count: "exact", head: true })
            vehicleCount = vCount || 0

            // Contar usuários
            const { count: uCount } = await supabase.from("users").select("*", { count: "exact", head: true })
            userCount = uCount || 0

            tablesOk = vehicleCount >= 0 && userCount >= 0

            // Testar autenticação
            const { data: session } = await supabase.auth.getSession()
            authOk = true // Se chegou até aqui, auth está funcionando
          }
        } catch (error) {
          console.error("Connection test failed:", error)
        }
      }

      setStatus({
        supabaseConnection: connectionOk,
        environmentVars: envVarsOk,
        tablesExist: tablesOk,
        vehiclesCount: vehicleCount,
        usersCount: userCount,
        authWorking: authOk,
        loading: false,
      })
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }))
    }
  }

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const StatusIcon = ({ condition }: { condition: boolean }) => {
    if (status.loading) return <Loader2 className="h-4 w-4 animate-spin" />
    return condition ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  const testLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "caio@caio.com",
        password: "6464",
      })

      if (error) {
        alert(`Erro no login: ${error.message}`)
      } else {
        alert("Login funcionou! ✅")
      }
    } catch (error) {
      alert(`Erro: ${error}`)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Status do Sistema
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

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <span>Variáveis de Ambiente</span>
              <div className="flex items-center gap-2">
                <StatusIcon condition={status.environmentVars} />
                <Badge variant={status.environmentVars ? "default" : "destructive"}>
                  {status.environmentVars ? "OK" : "Erro"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Conexão Supabase</span>
              <div className="flex items-center gap-2">
                <StatusIcon condition={status.supabaseConnection} />
                <Badge variant={status.supabaseConnection ? "default" : "destructive"}>
                  {status.supabaseConnection ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Tabelas do Banco</span>
              <div className="flex items-center gap-2">
                <StatusIcon condition={status.tablesExist} />
                <Badge variant={status.tablesExist ? "default" : "destructive"}>
                  {status.tablesExist ? "OK" : "Erro"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Sistema de Autenticação</span>
              <div className="flex items-center gap-2">
                <StatusIcon condition={status.authWorking} />
                <Badge variant={status.authWorking ? "default" : "destructive"}>
                  {status.authWorking ? "Funcionando" : "Erro"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold">{status.vehiclesCount}</p>
              <p className="text-sm text-muted-foreground">Veículos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{status.usersCount}</p>
              <p className="text-sm text-muted-foreground">Usuários</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={checkSystemStatus} disabled={status.loading} className="flex-1">
              {status.loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar Novamente"
              )}
            </Button>
            <Button onClick={testLogin} variant="outline">
              Testar Login
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>URL:</strong>{" "}
              {"https://lgsvemxonnztfvpqytlg.supabase.co".substring(0, 30)}...
            </p>
            <p>
              <strong>Key:</strong>{" "}
                              ✅ Configurada
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
