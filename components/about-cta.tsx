import { Button } from "@/components/ui/button"
import { Phone, Car, Home } from "lucide-react"
import Link from "next/link"

export default function AboutCTA() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Pronto para fazer parte da família AutoMax?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Entre em contato conosco ou visite nossa loja para descobrir como podemos ajudá-lo a encontrar o veículo dos
          seus sonhos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link href="/contato">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3 flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Entrar em Contato</span>
            </Button>
          </Link>

          <Link href="/veiculos">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 bg-transparent border-white text-white hover:bg-white hover:text-primary flex items-center space-x-2"
            >
              <Car className="h-5 w-5" />
              <span>Ver Loja de Carros</span>
            </Button>
          </Link>
        </div>

        {/* Botão Voltar para Home */}
        <div className="border-t border-white/20 pt-6">
          <Link href="/">
            <Button
              size="lg"
              variant="ghost"
              className="text-lg px-8 py-3 bg-white/10 text-white hover:bg-white/20 border border-white/30 flex items-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Voltar para a Página Inicial</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
