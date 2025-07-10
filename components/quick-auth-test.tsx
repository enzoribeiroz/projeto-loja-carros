"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TestResult {
  status: "idle" | "testing" | "success" | "error"
  message: string
  details?: any
}

export default function QuickAuthTest() {
  const [adminTest, setAdminTest] = useState<TestResult>({ status: "idle", message: "" })
  const [userTest, setUserTest] = useState<TestResult>({ status: "idle", message: "" })
  const [customTest, setCustomTest] = useState<TestResult>({ status: "idle", message: "" })

  const [customEmail, setCustomEmail] = useState("")
  const [customPassword, setCustomPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const testLogin = async (email: string, password: string, setResult: (result: TestResult) => void) => {
    setResult({ status: "testing", message: "Testando login..." })

    try {
      console.log(`🔐 Testando login: ${email} / ${password}`)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        console.error("❌ Erro de login:", error)
        setResult({
          status: "error",
          message: error.message,
          details: error,
        })
      } else if (data.user) {
        console.log("✅ Login bem-sucedido:", data.user.email)
        setResult({
          status: "success",
          message: `Login OK! ID: ${data.user.id?.slice(0, 8)}...`,
          details: data.user,
        })

        // Fazer logout automático após 2 segundos
        setTimeout(async () => {
          await supabase.auth.signOut()
          console.log("👋 Logout automático realizado")
        }, 2000)
      } else {
        setResult({
          status: "error",
          message: "Login retornou dados vazios",
        })
      }
    } catch (error) {
      console.error("❌ Erro no teste:", error)
      setResult({
        status: "error",
        message: `Erro: ${error}`,
      })
    }
  }

  const testCustomLogin = () => {
    if (!customEmail || !customPassword) {
      setCustomTest({ status: "error", message: "Preencha email e senha" })
      return
    }
    testLogin(customEmail, customPassword, setCustomTest)
  }

  const renderTestResult = (result: TestResult) => {
    if (result.status === "idle") return null

    return (
      <div className="mt-2 p-2 rounded border">
        <div className="flex items-center gap-2">
          {result.status === "testing" && <Loader2 className="h-4 w-4 animate-spin" />}
          {result.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
          {result.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
          <span
            className={`text-sm font-medium ${
              result.status === "success" ? "text-green-700" : result.status === "error" ? "text-red-700" : ""
            }`}
          >
            {result.message}
          </span>
        </div>

        {result.details && (
          <details className="mt-2">
            <summary className="text-xs text-muted-foreground cursor-pointer">Ver detalhes</summary>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
              {JSON.stringify(result.details, null, 2)}
            </pre>
          </details>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>🧪 Teste Completo de Autenticação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Testes Pré-definidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Button
                onClick={() => testLogin("caio@caio.com", "6464", setAdminTest)}
                disabled={adminTest.status === "testing"}
                className="w-full"
                variant="outline"
              >
                {adminTest.status === "testing" ? "Testando..." : "Testar Admin"}
              </Button>
              <div className="text-xs text-muted-foreground">caio@caio.com / 6464</div>
              {renderTestResult(adminTest)}
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => testLogin("test1@test.com", "test123", setUserTest)}
                disabled={userTest.status === "testing"}
                className="w-full"
                variant="outline"
              >
                {userTest.status === "testing" ? "Testando..." : "Testar User"}
              </Button>
              <div className="text-xs text-muted-foreground">test1@test.com / test123</div>
              {renderTestResult(userTest)}
            </div>
          </div>

          {/* Teste Customizado */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Teste Customizado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="custom-email">Email</Label>
                <Input
                  id="custom-email"
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-password">Senha</Label>
                <div className="relative">
                  <Input
                    id="custom-password"
                    type={showPassword ? "text" : "password"}
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="sua senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={testCustomLogin} disabled={customTest.status === "testing"} className="w-full">
                  {customTest.status === "testing" ? "Testando..." : "Testar Login"}
                </Button>
              </div>
            </div>
            {renderTestResult(customTest)}
          </div>
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Instruções</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              Execute o script <code>106-diagnose-and-fix-credentials.sql</code> no Supabase
            </li>
            <li>Aguarde ver as mensagens de sucesso nos logs</li>
            <li>Teste os logins usando os botões acima</li>
            <li>Se ainda falhar, verifique o console do navegador (F12)</li>
            <li>Use o teste customizado para testar outras credenciais</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
