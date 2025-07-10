import { Phone, Mail, MessageCircle } from "lucide-react"

export default function ContactHero() {
  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-6">
          <Phone className="h-12 w-12 text-primary mr-4" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Entre em <span className="text-primary">Contato</span>
          </h1>
        </div>
        <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-8">
          Estamos aqui para ajudá-lo a encontrar o veículo dos seus sonhos. Entre em contato conosco!
        </p>

        {/* Destaques de Contato */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-lg p-4">
            <Phone className="h-6 w-6 text-primary" />
            <span className="font-semibold">Atendimento 24h</span>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-lg p-4">
            <Mail className="h-6 w-6 text-primary" />
            <span className="font-semibold">Resposta Rápida</span>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-lg p-4">
            <MessageCircle className="h-6 w-6 text-primary" />
            <span className="font-semibold">Suporte Personalizado</span>
          </div>
        </div>
      </div>
    </section>
  )
}
