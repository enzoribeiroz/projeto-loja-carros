"use client"

import { Car, Phone, Mail, MapPin, ArrowUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Footer() {
  const scrollToTop = () => {
    // Método mais confiável para scroll suave
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">AutoMax</span>
            </Link>
            <p className="text-slate-300 mb-4 max-w-md">
              Há mais de 25 anos oferecendo os melhores veículos com qualidade, transparência e atendimento excepcional.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-slate-300">(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-slate-300">contato@automax.com.br</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-slate-300">Av. Paulista, 1234 - São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Veículos - EM DESTAQUE */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-primary flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Veículos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/veiculos?filtro=novos"
                  className="text-white hover:text-primary transition-colors font-medium flex items-center"
                >
                  → Carros Novos
                </Link>
              </li>
              <li>
                <Link
                  href="/veiculos?filtro=seminovos"
                  className="text-white hover:text-primary transition-colors font-medium flex items-center"
                >
                  → Seminovos
                </Link>
              </li>
              <li>
                <Link
                  href="/veiculos?filtro=ofertas"
                  className="text-white hover:text-red-400 transition-colors font-medium flex items-center bg-red-600/20 px-2 py-1 rounded"
                >
                  → Ofertas Especiais
                </Link>
              </li>
              <li>
                <Link
                  href="/financiamento"
                  className="text-white hover:text-green-400 transition-colors font-medium flex items-center bg-green-600/20 px-2 py-1 rounded"
                >
                  → Financiamento
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre-nos" className="text-slate-300 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-slate-300 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-slate-300 hover:text-white transition-colors">
                  Agendar Test Drive
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Botão Voltar ao Topo - BEM DESTACADO */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex justify-center mb-6">
            <Button
              onClick={scrollToTop}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-primary/20"
            >
              <ArrowUp className="h-6 w-6 mr-3" />
              VOLTAR AO TOPO
            </Button>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-slate-400">© 2024 AutoMax. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
