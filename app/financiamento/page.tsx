"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-supabase"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FinancingHero from "@/components/financing-hero"
import FinancingCalculator from "@/components/financing-calculator"
import VehiclesFilter, { type FilterState } from "@/components/vehicles-filter"
import VehiclesGrid from "@/components/vehicles-grid"
import FloatingFilterButton from "@/components/floating-filter-button"
import { getAllVehiclesHybrid } from "@/lib/vehicles-hybrid"
import type { VehicleWithDetails } from "@/lib/vehicles-supabase"
import { Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FinancingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedBrand: "",
    selectedYear: "",
    selectedPrice: "",
  })

  const [activeTab, setActiveTab] = useState("todos")
  const [selectedVehiclePrice, setSelectedVehiclePrice] = useState<string>("")
  const [vehicles, setVehicles] = useState<VehicleWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user) {
      const fetchVehicles = async () => {
        try {
          const vehiclesData = await getAllVehiclesHybrid()
          setVehicles(vehiclesData)
        } catch (error) {
          console.error("Error fetching vehicles:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchVehicles()
    } else if (mounted && !user) {
      setIsLoading(false)
    }
  }, [mounted, user])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
  }

  const handleSelectVehicle = (price: string) => {
    setSelectedVehiclePrice(price)
    // Scroll suave para a calculadora
    const calculatorElement = document.getElementById("financing-calculator")
    if (calculatorElement) {
      calculatorElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Carregando...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Verificação de segurança - usuário não logado
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <FinancingHero />

        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-8">
              <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
              <p className="text-muted-foreground mb-6">
                Você precisa estar logado para acessar a calculadora de financiamento e visualizar os veículos
                disponíveis.
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => router.push("/login")} className="w-full" size="lg">
                Fazer Login
              </Button>
              <Button onClick={() => router.push("/cadastro")} variant="outline" className="w-full" size="lg">
                Criar Conta
              </Button>
              <Button onClick={() => router.push("/")} variant="ghost" className="w-full">
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FinancingHero />
      <div id="financing-calculator">
        <FinancingCalculator selectedVehiclePrice={selectedVehiclePrice} />
      </div>

      {/* Seção de Veículos */}
      <section className="py-8 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Escolha seu Veículo</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Selecione o veículo dos seus sonhos e veja como fica o financiamento
            </p>
          </div>
        </div>
      </section>

      <VehiclesFilter onFiltersChange={handleFiltersChange} initialFilters={filters} />
      <VehiclesGrid
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={filters.searchQuery}
        selectedBrand={filters.selectedBrand}
        selectedYear={filters.selectedYear}
        selectedPrice={filters.selectedPrice}
        onSelectVehicle={handleSelectVehicle}
        showSelectButton={true}
        vehicles={vehicles}
      />
      <FloatingFilterButton filters={filters} onFiltersChange={handleFiltersChange} />
      <Footer />
    </div>
  )
}
