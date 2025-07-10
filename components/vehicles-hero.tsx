import { Car } from "lucide-react"

export default function VehiclesHero() {
  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-6">
          <Car className="h-12 w-12 text-primary mr-4" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Nossos <span className="text-primary">Veículos</span>
          </h1>
        </div>
        <p className="text-xl text-slate-200 max-w-2xl mx-auto">
          Explore nossa ampla seleção de veículos novos e seminovos das melhores marcas do mercado
        </p>
      </div>
    </section>
  )
}
