"use client"

import { useState, useEffect } from "react"
import { Car, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatPrice, formatMileage } from "@/lib/format"
import type { VehicleWithDetails } from "@/lib/vehicles-supabase"

interface VehiclesGridProps {
  activeTab: string
  onTabChange: (tab: string) => void
  searchQuery: string
  selectedBrand: string
  selectedYear: string
  selectedPrice: string
  onSelectVehicle: (vehiclePrice: string) => void
  showSelectButton?: boolean
  vehicles: VehicleWithDetails[]
  loading?: boolean
}

export default function VehiclesGrid({
  activeTab,
  onTabChange,
  searchQuery,
  selectedBrand,
  selectedYear,
  selectedPrice,
  onSelectVehicle,
  showSelectButton = true,
  vehicles,
  loading = false,
}: VehiclesGridProps) {
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleWithDetails[]>([])

  // Filtrar veículos baseado nos filtros ativos
  useEffect(() => {
    let filtered = vehicles.filter((vehicle) => {
      // Verificação de segurança
      if (!vehicle || !vehicle.id) {
        console.warn("⚠️ [Vehicles Grid] Veículo inválido:", vehicle)
        return false
      }

      // Filtro por categoria/tab
      if (activeTab !== "todos") {
        const category = activeTab.toLowerCase()
        const vehicleCategory = vehicle.category?.toLowerCase() || ""
        const vehicleTag = vehicle.tag?.toLowerCase() || ""

        if (category === "novos") {
          return vehicleTag.includes("novo") || vehicleCategory === "novos"
        } else if (category === "seminovos") {
          return vehicleTag.includes("seminovo") || vehicleCategory === "seminovos"
        } else if (category === "premium") {
          return vehicleTag.includes("premium") || vehicleCategory === "premium"
        } else if (category === "ofertas") {
          return vehicleTag.includes("oferta") || vehicleCategory === "ofertas"
        }
      }

              // Filtro por busca
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            vehicle.name?.toLowerCase().includes(query) ||
            vehicle.brand?.toLowerCase().includes(query) ||
            vehicle.model?.toLowerCase().includes(query) ||
            vehicle.description?.toLowerCase().includes(query)
          )
        }

        return true
      })

    // Filtro por marca
    if (selectedBrand) {
      filtered = filtered.filter((vehicle) => vehicle.brand?.toLowerCase() === selectedBrand.toLowerCase())
    }

    // Filtro por ano
    if (selectedYear) {
      filtered = filtered.filter((vehicle) => vehicle.year?.toString() === selectedYear)
    }

    // Filtro por preço
    if (selectedPrice) {
      const [min, max] = selectedPrice.split("-").map((p) => Number.parseInt(p.replace(/\D/g, "")))
      filtered = filtered.filter((vehicle) => {
        const price = Number.parseInt(String(vehicle.price)?.replace(/\D/g, "") || "0")
        if (selectedPrice === "300000+") return price >= 300000
        return price >= min && price <= max
      })
    }

    console.log("✅ [Vehicles Grid] Veículos filtrados:", filtered.length)
    setFilteredVehicles(filtered)
  }, [vehicles, activeTab, searchQuery, selectedBrand, selectedYear, selectedPrice])

  // Contar veículos por categoria
  const counts = {
    todos: vehicles.filter((v) => v && v.id && v.is_active !== false).length,
    novos: vehicles.filter(
      (v) =>
        v &&
        v.id &&
        v.is_active !== false &&
        (v.tag?.toLowerCase().includes("novo") || v.category === "novos"),
    ).length,
    seminovos: vehicles.filter(
      (v) =>
        v &&
        v.id &&
        v.is_active !== false &&
        (v.tag?.toLowerCase().includes("seminovo") || v.category === "seminovos"),
    ).length,
    premium: vehicles.filter(
      (v) =>
        v &&
        v.id &&
        v.is_active !== false &&
        (v.tag?.toLowerCase().includes("premium") || v.category === "premium"),
    ).length,
    ofertas: vehicles.filter(
      (v) =>
        v &&
        v.id &&
        v.is_active !== false &&
        (v.tag?.toLowerCase().includes("oferta") || v.category === "ofertas"),
    ).length,
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Carregando veículos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="todos">Todos ({counts.todos})</TabsTrigger>
          <TabsTrigger value="novos">Novos ({counts.novos})</TabsTrigger>
          <TabsTrigger value="seminovos">Seminovos ({counts.seminovos})</TabsTrigger>
          <TabsTrigger value="premium">Premium ({counts.premium})</TabsTrigger>
          <TabsTrigger value="ofertas">Ofertas ({counts.ofertas})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum veículo encontrado</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedBrand || selectedYear || selectedPrice
                  ? "Tente ajustar os filtros para encontrar mais veículos."
                  : "Não há veículos disponíveis nesta categoria no momento."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => {
                // Verificação de segurança adicional
                if (!vehicle || !vehicle.id) {
                  console.warn("⚠️ [Vehicles Grid] Veículo inválido na renderização:", vehicle)
                  return null
                }

                const isOferta = vehicle.tag === "OFERTA ESPECIAL" || vehicle.category === "ofertas"
                const vehicleName = vehicle.name || `${vehicle.brand || ""} ${vehicle.model || ""}`.trim() || "Veículo"
                const vehiclePrice = formatPrice(vehicle.price) || vehicle.price || "Consulte"
                const vehicleOriginalPrice = vehicle.original_price
                  ? formatPrice(vehicle.original_price)
                  : null
                const vehicleYear = vehicle.year || "N/A"
                const vehicleMileage = formatMileage(vehicle.mileage) || vehicle.mileage || "N/A"
                const vehicleFuel = vehicle.fuel || "N/A"
                const vehicleLocation = vehicle.location || "São Paulo, SP"

                return (
                  <Card key={String(vehicle.id)} className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <Link href="/veiculo/[id]" as={`/veiculo/${vehicle.id}`} key={vehicle.id} className="no-underline">
                      <div className="relative">
                        <img
                          src={
                            vehicle.images && vehicle.images.length > 0
                              ? vehicle.images[0]
                              : "/placeholder.svg?height=200&width=300"
                          }
                          alt={vehicleName}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                        <Badge
                          className={`absolute top-2 left-2 font-semibold ${
                            isOferta ? "bg-red-600 text-white" : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {vehicle.tag || "DISPONÍVEL"}
                        </Badge>
                      </div>

                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{vehicleName}</CardTitle>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{vehicleYear}</span>
                          <span className="text-sm text-muted-foreground">{vehicleLocation}</span>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              {isOferta && vehicleOriginalPrice && (
                                <p className="text-sm text-muted-foreground line-through">{vehicleOriginalPrice}</p>
                              )}
                              <p className={`text-xl font-bold ${isOferta ? "text-red-600" : "text-primary"}`}>
                                {vehiclePrice}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Quilometragem:</span>
                              <p className="font-medium">{vehicleMileage}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Combustível:</span>
                              <p className="font-medium">{vehicleFuel}</p>
                            </div>
                          </div>

                          {showSelectButton && (
                            <Button
                              onClick={() => onSelectVehicle(String(vehicle.price))}
                              className="w-full mt-4 group-hover:bg-primary/90"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
