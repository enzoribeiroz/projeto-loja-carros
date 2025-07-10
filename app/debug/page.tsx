import SupabaseDebug from "@/components/supabase-debug"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Diagnóstico do Sistema</h1>
          <SupabaseDebug />
        </div>
      </div>

      <Footer />
    </div>
  )
}
