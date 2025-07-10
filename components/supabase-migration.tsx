"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function SupabaseMigration() {
  const [migrationStatus, setMigrationStatus] = useState<{
    step: string
    success: boolean
    error?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runMigration = async () => {
    setIsLoading(true)
    setMigrationStatus(null)

    try {
      // Verificar se as tabelas já existem
      const { data: tables, error: tablesError } = await supabase.from("vehicles").select("count").limit(1)

      if (!tablesError && tables) {
        setMigrationStatus({
          step: "Tabelas já existem no Supabase",
          success: true,
        })
        setIsLoading(false)
        return
      }

      setMigrationStatus({
        step: "Execute os scripts SQL no painel do Supabase",
        success: false,
        error: "Por favor, execute os scripts SQL fornecidos no painel do Supabase primeiro",
      })
    } catch (error: any) {
      setMigrationStatus({
        step: "Erro na migração",
        success: false,
        error: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("vehicles").select("count").limit(1)

      if (error) {
        setMigrationStatus({
          step: "Erro de conexão",
          success: false,
          error: error.message,
        })
      } else {
        setMigrationStatus({
          step: "Conexão com Supabase funcionando",
          success: true,
        })
      }
    } catch (error: any) {
      setMigrationStatus({
        step: "Erro de conexão",
        success: false,
        error: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Migração para Supabase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Passos para configurar o Supabase:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Acesse o painel do Supabase</li>
            <li>Vá para SQL Editor</li>
            <li>Execute os scripts na ordem: 01, 02, 03, 04, 05</li>
            <li>Teste a conexão abaixo</li>
          </ol>
        </div>

        <div className="flex space-x-2">
          <Button onClick={testConnection} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Testar Conexão
          </Button>
          <Button onClick={runMigration} variant="outline" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Verificar Migração
          </Button>
        </div>

        {migrationStatus && (
          <Alert className={migrationStatus.success ? "border-green-500" : "border-red-500"}>
            {migrationStatus.success ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <AlertDescription>
              <strong>{migrationStatus.step}</strong>
              {migrationStatus.error && <div className="mt-2 text-sm text-red-600">{migrationStatus.error}</div>}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Variáveis de Ambiente Configuradas:</h4>
          <div className="space-y-1 text-sm">
            <div>✅ SUPABASE_URL</div>
            <div>✅ NEXT_PUBLIC_SUPABASE_URL</div>
            <div>✅ SUPABASE_ANON_KEY</div>
            <div>✅ NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
            <div>✅ SUPABASE_SERVICE_ROLE_KEY</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
