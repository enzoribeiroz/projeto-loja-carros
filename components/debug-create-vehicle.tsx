"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-supabase"
import { canCreateVehiclesHybrid } from "@/lib/vehicles-hybrid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function DebugCreateVehicle() {
  const { user } = useAuth()
  const router = useRouter()
  const [testResult, setTestResult] = useState<string>("")

  const testCreateVehicle = () => {
    console.log("🧪 === TESTE DE CRIAÇÃO DE VEÍCULO ===")

    let result = "🧪 TESTE DE CRIAÇÃO DE VEÍCULO\n\n"

    // Verificar usuário
    result += `👤 Usuário logado: ${user ? "✅ SIM" : "❌ NÃO"}\n`
    if (user) {
      result += `📧 Email: ${user.email}\n`
      result += `🆔 ID: ${user.id}\n`
      result += `👑 É Admin: ${user.isAdmin ? "✅ SIM" : "❌ NÃO"}\n`
      result += `✅ Perfil Completo: ${user.profileComplete ? "✅ SIM" : "❌ NÃO"}\n\n`

      // Verificar permissões
      const canCreate = canCreateVehiclesHybrid(user.email)
      result += `🔑 Pode criar veículos: ${canCreate ? "✅ SIM" : "❌ NÃO"}\n`

      if (canCreate) {
        result += `🚗 Redirecionamento: /admin/criar-veiculo\n`
        result += `✅ TESTE PASSOU - Usuário pode criar veículos!`
      } else {
        result += `❌ TESTE FALHOU - Usuário não tem permissão!`
      }
    } else {
      result += `❌ TESTE FALHOU - Usuário não está logado!`
    }

    console.log(result)
    setTestResult(result)
  }

  const goToCreateVehicle = () => {
    if (!user) {
      alert("Faça login primeiro!")
      router.push("/login")
      return
    }

    if (!canCreateVehiclesHybrid(user.email)) {
      alert("Você não tem permissão para criar veículos!")
      return
    }

    router.push("/admin/criar-veiculo")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Debug - Criar Veículo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status do Usuário */}
          <div className="space-y-2">
            <h3 className="font-semibold">👤 Status do Usuário:</h3>
            {user ? (
              <div className="space-y-1">
                <div>
                  Email: <Badge variant="outline">{user.email}</Badge>
                </div>
                <div>
                  Admin: <Badge variant={user.isAdmin ? "default" : "secondary"}>{user.isAdmin ? "SIM" : "NÃO"}</Badge>
                </div>
                <div>
                  Pode Criar:{" "}
                  <Badge variant={canCreateVehiclesHybrid(user.email) ? "default" : "destructive"}>
                    {canCreateVehiclesHybrid(user.email) ? "SIM" : "NÃO"}
                  </Badge>
                </div>
              </div>
            ) : (
              <Badge variant="destructive">Não logado</Badge>
            )}
          </div>

          {/* Botões de Teste */}
          <div className="flex gap-2">
            <Button onClick={testCreateVehicle} variant="outline">
              🧪 Testar Permissões
            </Button>
            <Button onClick={goToCreateVehicle} disabled={!user || !canCreateVehiclesHybrid(user?.email || "")}>
              🚗 Ir para Criar Veículo
            </Button>
          </div>

          {/* Resultado do Teste */}
          {testResult && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">📋 Resultado do Teste:</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm whitespace-pre-wrap">{testResult}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
