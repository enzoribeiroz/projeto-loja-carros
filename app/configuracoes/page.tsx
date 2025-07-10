"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-supabase"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"

export default function ConfiguracoesPage() {
  const router = useRouter()
  const { user, logout, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
      setMessage({ type: "success", text: "Logout realizado com sucesso!" })
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao fazer logout. Tente novamente." })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    // Implementar futuramente
    setMessage({ type: "error", text: "Funcionalidade em desenvolvimento." })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={() => router.push("/perfil")} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Perfil</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {message && (
            <Alert className={`${message.type === "success" ? "border-green-500" : "border-red-500"}`}>
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription
                className={
                  message.type === "success" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                }
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Informações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações da Conta</span>
              </CardTitle>
              <CardDescription>Suas informações pessoais e status da conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Nome</span>
                  </div>
                  <p className="font-medium text-foreground">{user.name}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </div>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>Telefone</span>
                  </div>
                  <p className="font-medium text-foreground">{user.phone || "Não informado"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Tipo de Conta</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.isAdmin ? "default" : "secondary"}>
                      {user.isAdmin ? "Administrador" : "Usuário"}
                    </Badge>
                    {user.profileComplete && (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Perfil Completo
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle>Ações da Conta</CardTitle>
              <CardDescription>Gerencie suas informações e configurações de segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-3">
                <Button
                  variant="outline"
                  className="justify-start h-auto p-4"
                  onClick={() => router.push("/editar-perfil")}
                >
                  <div className="flex items-center space-x-3">
                    <Edit className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Editar Perfil</div>
                      <div className="text-sm text-muted-foreground">Altere suas informações pessoais</div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start h-auto p-4"
                  onClick={() => router.push("/alterar-senha")}
                >
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Alterar Senha</div>
                      <div className="text-sm text-muted-foreground">Mude sua senha de acesso</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Zona de Perigo */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Zona de Perigo</CardTitle>
              <CardDescription>Ações irreversíveis que afetam sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Sair da Conta</h3>
                  <p className="text-sm text-muted-foreground">Fazer logout e retornar à página inicial</p>
                </div>
                <Button variant="outline" onClick={handleLogout} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sair"}
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-red-600 dark:text-red-400">Excluir Conta</h3>
                  <p className="text-sm text-muted-foreground">
                    Remover permanentemente sua conta e todos os dados associados
                  </p>
                </div>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
