"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-supabase"
import { useRealtimeVehicles } from "@/hooks/use-realtime-vehicles"
import { canCreateVehiclesHybrid } from "@/lib/vehicles-hybrid"
import Header from "@/components/header"
import Footer from "@/components/footer"
import VehiclesHero from "@/components/vehicles-hero"
import VehiclesFilter, { type FilterState } from "@/components/vehicles-filter"
import VehiclesGrid from "@/components/vehicles-grid"
import FloatingFilterButton from "@/components/floating-filter-button"
import { RealtimeStatus } from "@/components/realtime-status"
import { Button } from "@/components/ui/button"
import { Plus, Settings, RefreshCw } from "lucide-react"

export default function VehiclesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const { vehicles, loading, lastUpdate, refresh } = useRealtimeVehicles()

  const filtroParam = searchParams.get("filtro")
  const buscaParam = searchParams.get("busca")

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedBrand: "",
    selectedYear: "",
    selectedPrice: "",
  })

  const [activeTab, setActiveTab] = useState("todos")

  // Definir aba ativa baseada no parâmetro da URL
  useEffect(() => {
    if (filtroParam) {
      switch (filtroParam.toLowerCase()) {
        case "novos":
          setActiveTab("novos")
          break
        case "seminovos":
          setActiveTab("seminovos")
          break
        case "premium":
          setActiveTab("premium")
          break
        case "ofertas":
          setActiveTab("ofertas")
          break
        default:
          setActiveTab("todos")
      }
    }
  }, [filtroParam])

  // Definir termo de busca baseado no parâmetro da URL
  useEffect(() => {
    if (buscaParam) {
      setFilters((prev) => ({
        ...prev,
        searchQuery: decodeURIComponent(buscaParam),
      }))
    }
  }, [buscaParam])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
  }

  const handleSelectVehicle = (vehicleId: string) => {
    router.push(`/veiculo/${vehicleId}`)
  }

  const handleCreateVehicle = () => {
    console.log("🚗 Tentando criar veículo...")
    console.log("👤 Usuário atual:", user)

    if (!user) {
      console.log("❌ Usuário não logado, redirecionando para login")
      router.push("/login")
      return
    }

    console.log("🔍 Verificando permissões para:", user.email)
    console.log("🔑 É admin?", user.isAdmin)
    console.log("🔑 Pode criar?", canCreateVehiclesHybrid(user.email))

    if (!canCreateVehiclesHybrid(user.email)) {
      console.log("❌ Sem permissão para criar veículos")
      alert("Você não tem permissão para criar veículos.")
      return
    }

    console.log("✅ Redirecionando para criar veículo...")
    router.push("/admin/criar-veiculo")
  }

  const handleAdminPanel = () => {
    if (!user) {
      router.push("/login")
      return
    }
    if (!canCreateVehiclesHybrid(user.email)) {
      alert("Você não tem permissão para administrar veículos.")
      return
    }
    router.push("/admin/painel")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <VehiclesHero />

      {/* Botões Admin e Status Realtime */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <RealtimeStatus />
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">Última atualização: {lastUpdate.toLocaleTimeString()}</div>
            <Button onClick={refresh} variant="outline" className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Atualizar</span>
            </Button>
            {user && canCreateVehiclesHybrid(user.email) && (
              <>
                <Button onClick={handleAdminPanel} variant="outline" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Painel Admin</span>
                </Button>
                {user &&
                  (() => {
                    const canCreate = canCreateVehiclesHybrid(user.email)
                    console.log("🔍 Renderizando botão - Usuário:", user.email, "Pode criar:", canCreate)
                    return canCreate
                  })() && (
                    <Button onClick={handleCreateVehicle} className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Criar Veículo</span>
                    </Button>
                  )}
              </>
            )}
          </div>
        </div>
      </div>

      <VehiclesFilter onFiltersChange={handleFiltersChange} initialFilters={filters} />
      <VehiclesGrid
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={filters.searchQuery}
        selectedBrand={filters.selectedBrand}
        selectedYear={filters.selectedYear}
        selectedPrice={filters.selectedPrice}
        onSelectVehicle={handleSelectVehicle}
        showSelectButton={false}
        vehicles={vehicles}
        loading={loading}
      />
      <FloatingFilterButton filters={filters} onFiltersChange={handleFiltersChange} />
      <Footer />
    </div>
  )
}
