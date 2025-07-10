"use client"

import { useState, useEffect } from "react"
import { getAllVehiclesHybrid } from "@/lib/vehicles-hybrid"
import VehicleCard from "./vehicle-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Car, Loader2 } from "lucide-react"

interface Vehicle {
  id: string
  name: string
  price: string
  originalPrice?: string
  year: string
  mileage: string
  fuel: string
  transmission: string
  color: string
  seats: string
  description: string
  tag: string
  images: string[]
  features: string[]
  location: string
  seller: {
    name: string
    avatar: string
    rating: number
    phone: string
    whatsapp: string
  }
}

interface VehicleShowcaseProps {
  vehicles?: Vehicle[]
  loading?: boolean
}

export default function VehicleShowcase({ vehicles: propVehicles, loading: propLoading }: VehicleShowcaseProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(propVehicles || [])
  const [loading, setLoading] = useState(propLoading ?? true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (propVehicles) {
      setVehicles(propVehicles)
      setLoading(propLoading ?? false)
      return
    }

    const loadVehicles = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("🔄 [VehicleShowcase] Carregando veículos...")

        const allVehicles = await getAllVehiclesHybrid()
        console.log("📊 [VehicleShowcase] Veículos carregados:", allVehicles?.length || 0)

        if (!Array.isArray(allVehicles)) {
          console.warn("⚠️ [VehicleShowcase] Dados inválidos:", allVehicles)
          setVehicles([])
          setError("Dados de veículos inválidos")
          return
        }

        // Filtrar apenas veículos ativos
        const activeVehicles = allVehicles.filter((vehicle) => vehicle && vehicle.id && vehicle.is_active !== false)

        console.log("✅ [VehicleShowcase] Veículos ativos:", activeVehicles.length)
        setVehicles(activeVehicles)

        if (activeVehicles.length === 0) {
          setError("Nenhum veículo ativo encontrado")
        }
      } catch (error) {
        console.error("❌ [VehicleShowcase] Erro ao carregar veículos:", error)
        setError("Erro ao carregar veículos")
        setVehicles([])
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [propVehicles, propLoading])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Veículos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Confira nossa seleção de veículos seminovos e novos com a melhor qualidade do mercado
            </p>
          </div>

          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Carregando veículos...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Veículos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Confira nossa seleção de veículos seminovos e novos com a melhor qualidade do mercado
            </p>
          </div>

          <div className="text-center py-12">
            <Car className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar veículos</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Tentar novamente
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Veículos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Confira nossa seleção de veículos seminovos e novos com a melhor qualidade do mercado
            </p>
          </div>

          <div className="text-center py-12">
            <Car className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum veículo disponível</h3>
            <p className="text-gray-600 mb-6">Não há veículos disponíveis no momento.</p>
            <Button asChild>
              <Link href="/veiculos">Ver Todos os Veículos</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // Mostrar apenas os primeiros 6 veículos na homepage
  const displayVehicles = vehicles.slice(0, 6)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Veículos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Confira nossa seleção de veículos seminovos e novos com a melhor qualidade do mercado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {vehicles.length > 6 && (
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/veiculos">Ver Todos os Veículos ({vehicles.length})</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
