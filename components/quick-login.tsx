"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuickLoginProps {
  onLogin?: () => void
}

export function QuickLogin({ onLogin }: QuickLoginProps) {
  const { login } = useAuth()

  const handleQuickLogin = async (email: string, password: string, name: string) => {
    try {
      await login(email, password)
      onLogin?.()
    } catch (error) {
      console.error("Erro no login rápido:", error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Login Rápido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => handleQuickLogin("test1@test.com", "test", "Usuário Teste")}
        >
          👤 Usuário Teste (test1@test.com)
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => handleQuickLogin("caio@caio.com", "6464", "Caio Admin")}
        >
          👑 Admin (caio@caio.com)
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => handleQuickLogin("joao@teste.com", "123456", "João Silva")}
        >
          👤 João Silva (joao@teste.com)
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => handleQuickLogin("maria@teste.com", "senha123", "Maria Santos")}
        >
          👤 Maria Santos (maria@teste.com)
        </Button>
      </CardContent>
    </Card>
  )
}
