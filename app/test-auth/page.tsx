import SimpleAuthTest from "@/components/simple-auth-test"

export default function TestAuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teste de Autenticação</h1>
          <p className="text-gray-600 mt-2">Execute o script SQL primeiro, depois teste os logins</p>
        </div>

        <SimpleAuthTest />
      </div>
    </div>
  )
}
