"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, User, Database, Shield, Trash2, CheckCircle } from "lucide-react"

interface AuthDebugInfo {
  authUsers: any[]
  publicUsers: any[]
  currentSession: any
  policies: any[]
  loading: boolean
  error?: string
}

export default function AuthDebugPanel() {
  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo>({
    authUsers: [],
    publicUsers: [],
    currentSession: null,
    policies: [],
    loading: true,
  })

  const [testResults, setTestResults] = useState<{ [key: string]: string }>({})

  const loadDebugInfo = async () => {
    setDebugInfo((prev) => ({ ...prev, loading: true, error: undefined }))

    try {
      // 1. Verificar sessão atual
      const { data: session } = await supabase.auth.getSession()

      // 2. Buscar usuários da tabela public
      const { data: publicUsers, error: publicError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })

      if (publicError) {
        throw new Error(`Erro ao buscar usuários public: ${publicError.message}`)
      }

      setDebugInfo({
        authUsers: [], // Não podemos acessar auth.users diretamente do cliente
        publicUsers: publicUsers || [],
        currentSession: session?.session,
        policies: [], // Não podemos acessar políticas do cliente
        loading: false,
      })
    } catch (error) {
      setDebugInfo((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }))
    }
  }

  const testLogin = async (email: string, password: string) => {
    const key = `login-${email}`
    setTestResults((prev) => ({ ...prev, [key]: "🔄 Testando..." }))

    try {
      console.log(`🧪 Testando login: ${email}`)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setTestResults((prev) => ({ ...prev, [key]: `❌ ${error.message}` }))
        console.error("Login error:", error)
      } else {
        setTestResults((prev) => ({ ...prev, [key]: `✅ Login OK!` }))
        console.log("Login success:", data)
        setTimeout(loadDebugInfo, 1000) // Recarregar info após delay
      }
    } catch (error) {
      setTestResults((prev) => ({ ...prev, [key]: `❌ Erro: ${error}` }))
      console.error("Login exception:", error)
    }
  }

  const testRegister = async () => {
    const testEmail = `teste${Date.now()}@teste.com`
    const key = "register"
    setTestResults((prev) => ({ ...prev, [key]: "🔄 Testando..." }))

    try {
      console.log(`🧪 Testando registro: ${testEmail}`)
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: "teste123",
        options: {
          data: {
            name: "Usuário Teste",
          },
        },
      })

      if (error) {
        setTestResults((prev) => ({ ...prev, [key]: `❌ ${error.message}` }))
        console.error("Register error:", error)
      } else {
        setTestResults((prev) => ({ ...prev, [key]: `✅ Registro OK: ${testEmail}` }))
        console.log("Register success:", data)
        setTimeout(loadDebugInfo, 3000) // Aguardar trigger
      }
    } catch (error) {
      setTestResults((prev) => ({ ...prev, [key]: `❌ Erro: ${error}` }))
      console.error("Register exception:", error)
    }
  }

  const clearAllUsers = async () => {
    if (!confirm("⚠️ ATENÇÃO: Isso vai deletar TODOS os usuários da tabela public.users. Continuar?")) {
      return
    }

    try {
      const { error } = await supabase.from("users").delete().neq("id", "00000000-0000-0000-0000-000000000000")

      if (error) {
        alert(`❌ Erro ao limpar usuários: ${error.message}`)
      } else {
        alert("✅ Todos os usuários foram removidos!")
        loadDebugInfo()
      }
    } catch (error) {
      alert(`❌ Erro: ${error}`)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setTestResults((prev) => ({ ...prev, logout: "✅ Logout OK!" }))
      loadDebugInfo()
    } catch (error) {
      setTestResults((prev) => ({ ...prev, logout: `❌ Erro: ${error}` }))
    }
  }

  useEffect(() => {
    loadDebugInfo()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Debug de Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {debugInfo.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-red-700 text-sm">
                <strong>Erro:</strong> {debugInfo.error}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button onClick={loadDebugInfo} disabled={debugInfo.loading} className="flex items-center gap-2">
              {debugInfo.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Atualizar
            </Button>

            <Button onClick={() => testLogin("caio@caio.com", "6464")} variant="outline">
              Login Admin
            </Button>

            <Button onClick={() => testLogin("test1@test.com", "test123")} variant="outline">
              Login User
            </Button>

            <Button onClick={testRegister} variant="outline">
              Novo Registro
            </Button>

            <Button onClick={logout} variant="secondary">
              Logout
            </Button>

            <Button onClick={clearAllUsers} variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Limpar Tudo
            </Button>
          </div>

          {/* Resultados dos testes */}
          {Object.keys(testResults).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Resultados dos Testes:</h4>
              {Object.entries(testResults).map(([key, result]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">{key}:</span>
                  <span>{result}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Sessão Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {debugInfo.currentSession ? (
            <div className="space-y-2">
              <div>
                <strong>Email:</strong> {debugInfo.currentSession.user?.email}
              </div>
              <div>
                <strong>ID:</strong>{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">{debugInfo.currentSession.user?.id}</code>
              </div>
              <div className="flex items-center gap-2">
                <strong>Confirmado:</strong>
                {debugInfo.currentSession.user?.email_confirmed_at ? (
                  <Badge variant="default">✅ Sim</Badge>
                ) : (
                  <Badge variant="destructive">❌ Não</Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">Nenhuma sessão ativa</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Usuários na Tabela Public ({debugInfo.publicUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {debugInfo.publicUsers.length > 0 ? (
            <div className="space-y-2">
              {debugInfo.publicUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{user.email}</div>
                    <div className="text-sm text-muted-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground font-mono bg-gray-100 px-1 rounded">{user.id}</div>
                  </div>
                  <div className="flex gap-2">
                    {user.is_admin && <Badge variant="default">Admin</Badge>}
                    {user.profile_complete && <Badge variant="secondary">Completo</Badge>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">Nenhum usuário encontrado</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
