import Header from "@/components/header"
import Footer from "@/components/footer"
import AuthDebugPanel from "@/components/auth-debug-panel"

export default function DebugAuthPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Debug de Autenticação</h1>
            <p className="text-muted-foreground mt-2">Painel para diagnosticar problemas de login e registro</p>
          </div>

          <AuthDebugPanel />
        </div>
      </div>

      <Footer />
    </div>
  )
}
