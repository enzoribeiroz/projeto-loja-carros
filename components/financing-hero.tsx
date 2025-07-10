import { Calculator, TrendingUp, Shield } from "lucide-react"

export default function FinancingHero() {
  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-6">
          <Calculator className="h-12 w-12 text-primary mr-4" />
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="text-primary">Financiamento</span> AutoMax
          </h1>
        </div>
        <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-8">
          Calcule as melhores condições de financiamento para seu veículo dos sonhos
        </p>

        {/* Benefícios do Financiamento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-lg p-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-semibold">Taxas Competitivas</span>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-lg p-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold">Aprovação Rápida</span>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-lg p-4">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="font-semibold">Simulação Gratuita</span>
          </div>
        </div>
      </div>
    </section>
  )
}
