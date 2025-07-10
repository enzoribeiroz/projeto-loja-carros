"use client"

import { useAuth } from "@/lib/auth-supabase"
import { isSupabaseConfigured } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

export function AuthDebug() {
  const { user, loading } = useAuth()
  const supabaseConfigured = isSupabaseConfigured()
  const [mockUsers, setMockUsers] = useState<any[]>([])

  useEffect(() => {
    // Carregar usuários mock do localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("mock_users")
        if (stored) {
          setMockUsers(JSON.parse(stored))
        }
      } catch (error) {
        console.error("Erro ao carregar usuários mock:", error)
      }
    }
  }, [])

  // Verificar variáveis de ambiente
  const supabaseUrl = "https://lgsvemxonnztfvpqytlg.supabase.co"
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc3ZlbXhvbm56dGZ2cHF5dGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODkyNTYsImV4cCI6MjA2NTc2NTI1Nn0.kJl3K1AHOemP8MHmHx4b9iDPBOdmXxubwiI9IYr4c5M"

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Debug de Autenticação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Supabase URL:</span>
          <Badge variant={supabaseUrl ? "default" : "destructive"}>{supabaseUrl ? "✓" : "✗"}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Supabase Key:</span>
          <Badge variant={supabaseKey ? "default" : "destructive"}>{supabaseKey ? "✓" : "✗"}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Supabase:</span>
          <Badge variant={supabaseConfigured ? "default" : "destructive"}>
            {supabaseConfigured ? "Configurado" : "Não configurado"}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>Loading:</span>
          <Badge variant={loading ? "secondary" : "default"}>{loading ? "Sim" : "Não"}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Usuário:</span>
          <Badge variant={user ? "default" : "secondary"}>{user ? "Logado" : "Não logado"}</Badge>
        </div>
        {user && (
          <div className="mt-2 p-2 bg-muted rounded text-xs">
            <div>
              <strong>ID:</strong> {user.id}
            </div>
            <div>
              <strong>Nome:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Admin:</strong> {user.isAdmin ? "Sim" : "Não"}
            </div>
          </div>
        )}
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/50 rounded text-xs">
          <div className="font-semibold mb-1">Sistema Mock Ativo</div>
          <div>{mockUsers.length} usuários disponíveis</div>
          <div className="mt-1">
            {mockUsers.slice(0, 3).map((u, i) => (
              <div key={i} className="text-xs opacity-75">
                • {u.name} ({u.email})
              </div>
            ))}
            {mockUsers.length > 3 && (
              <div className="text-xs opacity-75">• ... e mais {mockUsers.length - 3} usuários</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
