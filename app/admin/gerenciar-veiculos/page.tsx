"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-supabase"
import {
  getAllVehiclesHybrid,
  canCreateVehiclesHybrid,
  updateVehicleHybrid,
  deleteVehicleHybrid,
} from "@/lib/vehicles-hybrid"
import Header from "@/components/header"
import Footer from "@/components/footer"
import VehiclesFilter, { type FilterState } from "@/components/vehicles-filter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, Plus, Save, X, Settings, Loader2 } from "lucide-react"

interface VehicleEditForm {
  id: string
  name: string
  brand: string
  model: string
  year: string
  price: string
  originalPrice?: string
  mileage: string
  fuel: string
  transmission: string
  color: string
  description: string
  features: string[]
  tag: string
  category: string
  images: string[]
}

export default function ManageVehiclesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingVehicle, setEditingVehicle] = useState<VehicleEditForm | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedBrand: "",
    selectedYear: "",
    selectedPrice: "",
  })

  // Verificar permissões
  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (!canCreateVehiclesHybrid(user.email)) {
      router.push("/veiculos")
      return
    }
  }, [user, router])

  // Carregar veículos
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true)
        const allVehicles = await getAllVehiclesHybrid()
        setVehicles(allVehicles)
        setFilteredVehicles(allVehicles)
      } catch (error) {
        console.error("Erro ao carregar veículos:", error)
      } finally {
        setLoading(false)
      }
    }
    loadVehicles()
  }, [])

  // Aplicar filtros
  useEffect(() => {
    let filtered = vehicles

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.name?.toLowerCase().includes(query) ||
          vehicle.brand?.toLowerCase().includes(query) ||
          vehicle.model?.toLowerCase().includes(query),
      )
    }

    if (filters.selectedBrand) {
      filtered = filtered.filter((vehicle) => vehicle.brand?.toLowerCase() === filters.selectedBrand.toLowerCase())
    }

    if (filters.selectedYear) {
      filtered = filtered.filter((vehicle) => vehicle.year?.toString() === filters.selectedYear)
    }

    if (filters.selectedPrice) {
      const [min, max] = filters.selectedPrice.split("-").map((p) => Number.parseInt(p.replace(/\D/g, "")))
      filtered = filtered.filter((vehicle) => {
        const price = Number.parseInt(vehicle.price?.replace(/\D/g, "") || "0")
        if (filters.selectedPrice === "300000+") return price >= 300000
        return price >= min && price <= max
      })
    }

    setFilteredVehicles(filtered)
  }, [filters, vehicles])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleEditVehicle = (vehicle: any) => {
    const editForm: VehicleEditForm = {
      id: vehicle.id,
      name: vehicle.name || `${vehicle.brand} ${vehicle.model}`,
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      year: vehicle.year?.toString() || "",
      price: vehicle.price || "",
      originalPrice: vehicle.originalPrice || "",
      mileage: vehicle.mileage || "",
      fuel: vehicle.fuel || "",
      transmission: vehicle.transmission || "",
      color: vehicle.color || "",
      description: vehicle.description || "",
      features: vehicle.features || [],
      tag: vehicle.tag || "",
      category: vehicle.category || "",
      images: vehicle.images || [],
    }
    setEditingVehicle(editForm)
    setIsEditDialogOpen(true)
  }

  const handleSaveVehicle = async () => {
    if (!editingVehicle) return

    try {
      setIsSaving(true)
      await updateVehicleHybrid(editingVehicle.id, editingVehicle)

      // Atualizar lista local
      const updatedVehicles = vehicles.map((v) => (v.id === editingVehicle.id ? { ...v, ...editingVehicle } : v))
      setVehicles(updatedVehicles)

      setIsEditDialogOpen(false)
      setEditingVehicle(null)
      alert("Veículo atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar veículo:", error)
      alert("Erro ao salvar veículo. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm("Tem certeza que deseja excluir este veículo?")) return

    try {
      await deleteVehicleHybrid(vehicleId)
      const updatedVehicles = vehicles.filter((v) => v.id !== vehicleId)
      setVehicles(updatedVehicles)
      alert("Veículo excluído com sucesso!")
    } catch (error) {
      console.error("Erro ao excluir veículo:", error)
      alert("Erro ao excluir veículo. Tente novamente.")
    }
  }

  const addFeature = () => {
    if (!editingVehicle) return
    setEditingVehicle({
      ...editingVehicle,
      features: [...editingVehicle.features, ""],
    })
  }

  const updateFeature = (index: number, value: string) => {
    if (!editingVehicle) return
    const newFeatures = [...editingVehicle.features]
    newFeatures[index] = value
    setEditingVehicle({
      ...editingVehicle,
      features: newFeatures,
    })
  }

  const removeFeature = (index: number) => {
    if (!editingVehicle) return
    const newFeatures = editingVehicle.features.filter((_, i) => i !== index)
    setEditingVehicle({
      ...editingVehicle,
      features: newFeatures,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Carregando veículos...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/veiculos")} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciar Veículos</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredVehicles.length} de {vehicles.length} veículos
              </p>
            </div>
          </div>
          <Button onClick={() => router.push("/admin/criar-veiculo")} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Novo Veículo</span>
          </Button>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <VehiclesFilter onFiltersChange={handleFiltersChange} initialFilters={filters} />
        </div>

        {/* Lista de Veículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{vehicle.name || `${vehicle.brand} ${vehicle.model}`}</CardTitle>
                    <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                  </div>
                  <Badge variant={vehicle.tag === "OFERTA ESPECIAL" ? "destructive" : "default"}>{vehicle.tag}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Preço:</span>
                    <span className="font-semibold">{vehicle.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Combustível:</span>
                    <span className="text-sm">{vehicle.fuel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cor:</span>
                    <span className="text-sm">{vehicle.color}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditVehicle(vehicle)} className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum veículo encontrado</h3>
            <p className="text-muted-foreground mb-4">Ajuste os filtros ou crie um novo veículo.</p>
            <Button onClick={() => router.push("/admin/criar-veiculo")}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Veículo
            </Button>
          </div>
        )}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Veículo</DialogTitle>
          </DialogHeader>

          {editingVehicle && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Veículo *</Label>
                  <Input
                    id="name"
                    value={editingVehicle.name}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                    placeholder="Ex: Honda Civic 2023"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Ano *</Label>
                  <Input
                    id="year"
                    value={editingVehicle.year}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, year: e.target.value })}
                    placeholder="2023"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço *</Label>
                  <Input
                    id="price"
                    value={editingVehicle.price}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, price: e.target.value })}
                    placeholder="R$ 85.000"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Preço Original (para ofertas)</Label>
                  <Input
                    id="originalPrice"
                    value={editingVehicle.originalPrice || ""}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, originalPrice: e.target.value })}
                    placeholder="R$ 95.000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fuel">Combustível *</Label>
                  <Select
                    value={editingVehicle.fuel}
                    onValueChange={(value) => setEditingVehicle({ ...editingVehicle, fuel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flex">Flex</SelectItem>
                      <SelectItem value="Gasolina">Gasolina</SelectItem>
                      <SelectItem value="Etanol">Etanol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Híbrido">Híbrido</SelectItem>
                      <SelectItem value="Elétrico">Elétrico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transmission">Transmissão *</Label>
                  <Select
                    value={editingVehicle.transmission}
                    onValueChange={(value) => setEditingVehicle({ ...editingVehicle, transmission: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Automático">Automático</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="color">Cor *</Label>
                  <Input
                    id="color"
                    value={editingVehicle.color}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, color: e.target.value })}
                    placeholder="Branco"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tag">Tag *</Label>
                  <Select
                    value={editingVehicle.tag}
                    onValueChange={(value) => setEditingVehicle({ ...editingVehicle, tag: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOVO">NOVO</SelectItem>
                      <SelectItem value="SEMINOVO">SEMINOVO</SelectItem>
                      <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                      <SelectItem value="OFERTA ESPECIAL">OFERTA ESPECIAL</SelectItem>
                      <SelectItem value="DISPONÍVEL">DISPONÍVEL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mileage">Quilometragem</Label>
                  <Input
                    id="mileage"
                    value={editingVehicle.mileage}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, mileage: e.target.value })}
                    placeholder="50.000 km"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={editingVehicle.description}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                  placeholder="Descreva as características e condições do veículo..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Características</Label>
                <div className="space-y-2 mt-2">
                  {editingVehicle.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Ex: Ar condicionado"
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm" onClick={() => removeFeature(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addFeature} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Característica
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveVehicle} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
