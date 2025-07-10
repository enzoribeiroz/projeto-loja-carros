"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimpleAuthTest() {
  const [adminResult, setAdminResult] = useState("")
  const [userResult, setUserResult] = useState("")
  const [loading, setLoading] = useState(false)

  const testAdmin = async () => {
    setLoading(true)
    setAdminResult("🔄 Testando admin...")

    try {
      console.log("🔐 Testando login admin: caio@caio.com")

      const { data, error } = await supabase.auth.signInWithPassword({
        email: "caio@caio.com",
        password: "6464",
      })

      if (error) {
        console.error("❌ Erro admin:", error)
        setAdminResult(`❌ Erro: ${error.message}`)
      } else if (data.user) {
        console.log("✅ Admin logado:", data.user.id)
        setAdminResult(`✅ Admin OK! ID: ${data.user.id.slice(0, 8)}...`)

        // Logout após 2 segundos
        setTimeout(async () => {
          await supabase.auth.signOut()
          console.log("👋 Admin deslogado")
        }, 2000)
      }
    } catch (err) {
      console.error("❌ Erro admin catch:", err)
      setAdminResult(`❌ Erro: ${err}`)
    }

    setLoading(false)
  }

  const testUser = async () => {
    setLoading(true)
    setUserResult("🔄 Testando user...")

    try {
      console.log("🔐 Testando login user: test1@test.com")

      const { data, error } = await supabase.auth.signInWithPassword({
        email: "test1@test.com",
        password: "test123",
      })

      if (error) {
        console.error("❌ Erro user:", error)
        setUserResult(`❌ Erro: ${error.message}`)
      } else if (data.user) {
        console.log("✅ User logado:", data.user.id)
        setUserResult(`✅ User OK! ID: ${data.user.id.slice(0, 8)}...`)

        // Logout após 2 segundos
        setTimeout(async () => {
          await supabase.auth.signOut()
          console.log("👋 User deslogado")
        }, 2000)
      }
    } catch (err) {
      console.error("❌ Erro user catch:", err)
      setUserResult(`❌ Erro: ${err}`)
    }

    setLoading(false)
  }

  const clearResults = () => {
    setAdminResult("")
    setUserResult("")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Teste de Login Simples
          <Button variant="outline" size="sm" onClick={clearResults}>
            Limpar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Button onClick={testAdmin} disabled={loading} className="w-full" variant="default">
              {loading ? "⏳ Testando..." : "🔐 Testar Admin"}
            </Button>
            <div className="text-sm text-gray-600 font-mono">caio@caio.com / 6464</div>
            {adminResult && (
              <div
                className={`p-3 rounded text-sm font-mono ${
                  adminResult.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {adminResult}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button onClick={testUser} disabled={loading} className="w-full" variant="secondary">
              {loading ? "⏳ Testando..." : "👤 Testar User"}
            </Button>
            <div className="text-sm text-gray-600 font-mono">test1@test.com / test123</div>
            {userResult && (
              <div
                className={`p-3 rounded text-sm font-mono ${
                  userResult.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {userResult}
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Instruções:</h3>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li>
                Execute o script <code className="bg-blue-100 px-1 rounded">108-nuclear-clean-users.sql</code> no
                Supabase
              </li>
              <li>Aguarde ver as mensagens de sucesso no SQL Editor</li>
              <li>Teste os logins usando os botões acima</li>
              <li>Abra o console do navegador (F12) para logs detalhados</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
