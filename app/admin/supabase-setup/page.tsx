"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-supabase"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SupabaseStatus from "@/components/supabase-status"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SupabaseSetupPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando...</p>
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
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Configuração do Supabase</h1>
            <p className="text-muted-foreground">Configure e monitore a integração com o banco de dados Supabase</p>
          </div>

          <SupabaseStatus />

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-4">Scripts SQL Executados Automaticamente:</h3>
            <div className="space-y-2 text-sm">
              <div>
                📄 <strong>Criação de Tabelas</strong> - users, vehicles, vehicle_images, etc.
              </div>
              <div>
                🔒 <strong>Políticas RLS</strong> - Segurança de acesso aos dados
              </div>
              <div>
                ⚙️ <strong>Funções e Triggers</strong> - Automação de processos
              </div>
              <div>
                📊 <strong>Dados Iniciais</strong> - Informações básicas da concessionária
              </div>
              <div>
                🚗 <strong>Veículos de Exemplo</strong> - Dados para demonstração
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-4">Funcionalidades Integradas:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">🔐 Autenticação:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Login/Logout com Supabase Auth</li>
                  <li>• Perfis de usuário completos</li>
                  <li>• Controle de admin automático</li>
                  <li>• Políticas RLS configuradas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">🚗 Veículos:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• CRUD completo de veículos</li>
                  <li>• Imagens e características</li>
                  <li>• Criação por admins</li>
                  <li>• Páginas individuais</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">❤️ Favoritos:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Sistema de favoritos por usuário</li>
                  <li>• Adicionar/remover favoritos</li>
                  <li>• Persistência no banco</li>
                  <li>• Interface reativa</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">📞 Contatos:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Formulários de contato</li>
                  <li>• Leads por veículo</li>
                  <li>• Armazenamento seguro</li>
                  <li>• Acesso para admins</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
