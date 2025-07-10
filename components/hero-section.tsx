import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Shield, Award, Users } from "lucide-react"
import VehicleShowcase from "@/components/vehicle-showcase"
import Link from "next/link"

export default function HeroSection() {
  return (
    <main className="flex-1 bg-gradient-to-b from-slate-900 via-slate-50 via-slate-100 via-slate-200 via-slate-600 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Bem-vindo à <span className="text-yellow-400 drop-shadow-lg font-extrabold">AutoMax</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-200 max-w-3xl mx-auto drop-shadow-md">
            Sua concessionária de confiança com os melhores veículos e atendimento excepcional
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/veiculos">
              <Button size="lg" className="text-lg px-8 py-3">
                Ver Veículos
              </Button>
            </Link>
            <Link href="/contato">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 bg-transparent border-white text-white hover:bg-white hover:text-slate-900"
              >
                Agendar Test Drive
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <VehicleShowcase />

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white drop-shadow-lg">
            Por que escolher a <span className="text-yellow-400 drop-shadow-lg font-extrabold">AutoMax</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Car className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Amplo Estoque</h3>
                <p className="text-muted-foreground">Mais de 500 veículos novos e seminovos das melhores marcas</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Garantia Total</h3>
                <p className="text-muted-foreground">Todos os veículos com garantia estendida e suporte completo</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Qualidade Certificada</h3>
                <p className="text-muted-foreground">Veículos inspecionados e certificados por nossa equipe técnica</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Atendimento VIP</h3>
                <p className="text-muted-foreground">Consultores especializados para te ajudar na melhor escolha</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">
            Pronto para encontrar seu próximo veículo?
          </h2>
          <p className="text-xl mb-8 opacity-90 text-slate-100 drop-shadow-md">
            Entre em contato conosco e descubra as melhores ofertas do mercado
          </p>
          <Link href="/contato">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Falar com Consultor
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
