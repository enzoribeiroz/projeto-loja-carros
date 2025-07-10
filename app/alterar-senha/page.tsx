"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-supabase"
import { supabase } from "@/lib/supabase"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function AlterarSenhaPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Validações
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("As senhas não coincidem")
      }

      if (formData.newPassword.length < 4) {
        throw new Error("A nova senha deve ter pelo menos 4 caracteres")
      }

      if (!supabase) {
        throw new Error("Erro de configuração do sistema")
      }

      console.log("🔐 Iniciando alteração de senha...")

      // Verificar se há sessão ativa
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Session error:", sessionError)
        throw new Error("Erro de sessão: " + sessionError.message)
      }

      if (!session) {
        throw new Error("Sessão expirada. Faça login novamente.")
      }

      console.log("✅ Sessão válida, atualizando senha...")

      // Atualizar senha no Supabase
      const { data, error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      })

      if (error) {
        console.error("Password update error:", error)
        throw new Error("Erro ao alterar senha: " + error.message)
      }

      console.log("✅ Senha alterada com sucesso:", data)

      setMessage({
        type: "success",
        text: "Senha alterada com sucesso! Você será redirecionado em 3 segundos.",
      })

      // Limpar formulário
      setFormData({
        newPassword: "",
        confirmPassword: "",
      })

      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push("/configuracoes")
      }, 3000)
    } catch (error) {
      console.error("Password change error:", error)
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao alterar senha. Tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (message) setMessage(null)
  }

  const togglePasswordVisibility = (field: "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
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
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-foreground">Você precisa estar logado para alterar sua senha.</p>
                <Button onClick={() => router.push("/login")} className="mt-4">
                  Fazer Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">Alterar Senha</CardTitle>
              <p className="text-muted-foreground">Digite sua nova senha abaixo</p>
            </CardHeader>
            <CardContent>
              {message && (
                <Alert className={`mb-4 ${message.type === "success" ? "border-green-500" : "border-red-500"}`}>
                  {message.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <AlertDescription
                    className={
                      message.type === "success"
                        ? "text-green-700 dark:text-green-400"
                        : "text-red-700 dark:text-red-400"
                    }
                  >
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-foreground">
                    Nova Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange("newPassword", e.target.value)}
                      placeholder="Digite sua nova senha"
                      required
                      minLength={4}
                      className="bg-background text-foreground"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("new")}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    Confirmar Nova Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="Confirme sua nova senha"
                      required
                      minLength={4}
                      className="bg-background text-foreground"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Alterando senha...
                    </>
                  ) : (
                    "Alterar Senha"
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <h3 className="font-semibold text-sm mb-2 text-foreground">Dicas de Segurança:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use pelo menos 8 caracteres</li>
                  <li>• Combine letras, números e símbolos</li>
                  <li>• Não use informações pessoais</li>
                  <li>• Não reutilize senhas de outras contas</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
