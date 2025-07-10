"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-supabase"
import { useRealtimeVehicles } from "@/hooks/use-realtime-vehicles"
import { useRealtimeAuth } from "@/hooks/use-realtime-auth"
import {
  canCreateVehiclesHybrid,
  updateVehicleHybrid,
  deleteVehicleHybrid,
  toggleVehicleStatusHybrid,
} from "@/lib/vehicles-hybrid"
import Header from "@/components/header"
import Footer from "@/components/footer"
import VehiclesFilter, { type FilterState } from "@/components/vehicles-filter"
import { RealtimeStatus } from "@/components/realtime-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, Plus, Save, X, Settings, Loader2, Car, BarChart3, RefreshCw } from "lucide-react"
import { formatPrice, unformatCurrency } from "@/lib/format"
import { imageConfigDefault } from "next/dist/shared/lib/image-config"

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
  isActive: boolean
  doors?: string
  engine?: string
  fuelConsumption?: string
  warranty?: string
  condition?: string
}

export default function AdminPanelPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { vehicles, loading, lastUpdate, refresh } = useRealtimeVehicles()

  // Hook para realtime de auth
  useRealtimeAuth()

  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [editingVehicle, setEditingVehicle] = useState<VehicleEditForm | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("vehicles")

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

  // Aplicar filtros
  useEffect(() => {
    let filtered = vehicles

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (vehicle: any) =>
          vehicle.name?.toLowerCase().includes(query) ||
          vehicle.brand?.toLowerCase().includes(query) ||
          vehicle.model?.toLowerCase().includes(query),
      )
    }

    if (filters.selectedBrand) {
      filtered = filtered.filter((vehicle: any) => vehicle.brand?.toLowerCase() === filters.selectedBrand.toLowerCase())
    }

    if (filters.selectedYear) {
      filtered = filtered.filter((vehicle: any) => vehicle.year?.toString() === filters.selectedYear)
    }

    if (filters.selectedPrice) {
      const [min, max] = filters.selectedPrice.split("-").map((p) => Number.parseInt(p.replace(/\D/g, "")))
      filtered = filtered.filter((vehicle: any) => {
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
    console.log("🔄 [Admin Panel] === PREPARANDO EDIÇÃO ===")
    console.log("🆔 [Admin Panel] Vehicle ID:", vehicle.id)

    // Validação de segurança
    if (!vehicle || !vehicle.id) {
      console.error("❌ [Admin Panel] Veículo inválido:", vehicle)
      alert("Erro: Veículo inválido")
      return
    }

    const editForm: VehicleEditForm = {
      id: vehicle.id,
      name: vehicle.name || `${vehicle.brand || ""} ${vehicle.model || ""}`.trim() || "Veículo",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      year: vehicle.year?.toString() || "",
      price: vehicle.price || "",
      originalPrice: vehicle.originalPrice || vehicle.original_price || "",
      mileage: vehicle.mileage || "",
      fuel: vehicle.fuel || "",
      transmission: vehicle.transmission || "",
      color: vehicle.color || "",
      description: vehicle.description || "",
      features: Array.isArray(vehicle.features) ? vehicle.features : [],
      tag: vehicle.tag || "",
      category: vehicle.category || "",
      images: Array.isArray(vehicle.images) ? vehicle.images : [],
      isActive: vehicle.isActive !== false && vehicle.is_active !== false,
      doors: vehicle.doors || "",
      engine: vehicle.engine || "",
      fuelConsumption: vehicle.fuelConsumption || "",
      warranty: vehicle.warranty || "",
      condition: vehicle.condition || "",
    }

    console.log("📝 [Admin Panel] Formulário preparado:", JSON.stringify(editForm, null, 2))
    setEditingVehicle(editForm)
    setIsEditDialogOpen(true)
  }

  // Usar funções de formatação do lib/format.ts

  const handleSaveVehicle = async () => {
    if (!editingVehicle) {
      console.error("❌ [Admin Panel] Nenhum veículo sendo editado")
      return
    }

    console.log("🔄 [Admin Panel] === INICIANDO SALVAMENTO ===")
    console.log("🆔 [Admin Panel] Vehicle ID:", editingVehicle.id)
    console.log("📝 [Admin Panel] Dados para salvar:", JSON.stringify(editingVehicle, null, 2))

    try {
      setIsSaving(true)

      // Preparar dados para atualização
      console.log("🔍 [Admin Panel] Valores antes da conversão:")
      console.log("  - price:", editingVehicle.price, "tipo:", typeof editingVehicle.price)
      console.log("  - originalPrice:", editingVehicle.originalPrice, "tipo:", typeof editingVehicle.originalPrice)
      
      const updateData = {
        name: editingVehicle.name,
        brand: editingVehicle.brand,
        model: editingVehicle.model,
        year: editingVehicle.year,
        price: unformatCurrency(editingVehicle.price || ""), // Remove formatação antes de salvar
        originalPrice: editingVehicle.originalPrice ? unformatCurrency(editingVehicle.originalPrice) : undefined,
        mileage: editingVehicle.mileage,
        fuel: editingVehicle.fuel,
        transmission: editingVehicle.transmission,
        color: editingVehicle.color,
        description: editingVehicle.description,
        features: editingVehicle.features,
        tag: editingVehicle.tag,
        isActive: editingVehicle.isActive,
        doors: editingVehicle.doors,
        engine: editingVehicle.engine,
        fuelConsumption: editingVehicle.fuelConsumption,
        warranty: editingVehicle.warranty,
        condition: editingVehicle.condition,
        seats: "5 lugares", // Valor padrão
        images: editingVehicle.images, // Remove espaços e vazios
      }

      console.log("🚀 [Admin Panel] Chamando updateVehicleHybrid...");
      console.log("🟡 Antes do await updateVehicleHybrid");
      const updatedVehicle = await updateVehicleHybrid(editingVehicle.id, updateData);
      console.log("🟢 Depois do await updateVehicleHybrid", updatedVehicle);

      if (!updatedVehicle) {
        throw new Error("Nenhum veículo foi retornado da atualização")
      }

      console.log("✅ [Admin Panel] Veículo atualizado:", updatedVehicle.id)
      console.log("📝 [Admin Panel] Dados atualizados:", JSON.stringify(updatedVehicle, null, 2))

      // Fechar dialog - o realtime vai atualizar automaticamente
      setIsEditDialogOpen(false)
      setEditingVehicle(null)

      console.log("✅ [Admin Panel] === SALVAMENTO COMPLETO ===")
      alert("Veículo atualizado com sucesso!")
    } catch (error: any) {
      console.error("❌ [Admin Panel] === ERRO NO SALVAMENTO ===", error)
      alert(`Erro ao salvar veículo: ${error?.message || 'Erro desconhecido'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm("Tem certeza que deseja excluir este veículo permanentemente?")) return

    console.log("🗑️ [Admin Panel] Deletando veículo:", vehicleId)

    try {
      await deleteVehicleHybrid(vehicleId)
      console.log("✅ [Admin Panel] Veículo deletado com sucesso")
      alert("Veículo excluído com sucesso!")
    } catch (error) {
      console.error("❌ [Admin Panel] Erro ao excluir veículo:", error)
      alert("Erro ao excluir veículo. Tente novamente.")
    }
  }

  const handleToggleStatus = async (vehicleId: string, currentStatus: boolean) => {
    console.log("🔄 [Admin Panel] Alterando status:", vehicleId, "para:", !currentStatus)

    try {
      await toggleVehicleStatusHybrid(vehicleId, !currentStatus)
      console.log("✅ [Admin Panel] Status alterado com sucesso")
      alert(`Veículo ${!currentStatus ? "ativado" : "desativado"} com sucesso!`)
    } catch (error) {
      console.error("❌ [Admin Panel] Erro ao alterar status:", error)
      alert("Erro ao alterar status. Tente novamente.")
    }
  }

  const addFeature = () => {
    if (!editingVehicle) return
    console.log("➕ [Admin Panel] Adicionando nova característica")
    setEditingVehicle({
      ...editingVehicle,
      features: [...editingVehicle.features, ""],
    })
  }

  const updateFeature = (index: number, value: string) => {
    if (!editingVehicle) return
    console.log("📝 [Admin Panel] Atualizando característica", index, ":", value)
    const newFeatures = [...editingVehicle.features]
    newFeatures[index] = value
    setEditingVehicle({
      ...editingVehicle,
      features: newFeatures,
    })
  }

  const removeFeature = (index: number) => {
    if (!editingVehicle) return
    console.log("🗑️ [Admin Panel] Removendo característica", index)
    const newFeatures = editingVehicle.features.filter((_, i) => i !== index)
    setEditingVehicle({
      ...editingVehicle,
      features: newFeatures,
    })
  }

  const addImage = () => {
    if (!editingVehicle) return
    console.log("➕ [Admin Panel] Adicionando nova imagem")
    setEditingVehicle({
      ...editingVehicle,
      images: [...editingVehicle.images, ""],
    })
  }

  const updateImage = (index: number, value: string) => {
    if (!editingVehicle) return
    console.log("📝 [Admin Panel] Atualizando imagem", index, ":", value)
    const newImages = [...editingVehicle.images]
    newImages[index] = value
    setEditingVehicle({
      ...editingVehicle,
      images: newImages,
    })
  }

  const removeImage = (index: number) => {
    if (!editingVehicle) return
    console.log("🗑️ [Admin Panel] Removendo imagem", index)
    const newImages = editingVehicle.images.filter((_, i) => i !== index)
    setEditingVehicle({
      ...editingVehicle,
      images: newImages,
    })
  }

  // Estatísticas
  const stats = {
    total: vehicles.length,
    active: vehicles.filter((v: any) => v.isActive !== false && v.is_active !== false).length,
    inactive: vehicles.filter((v: any) => v.isActive === false || v.is_active === false).length,
    offers: vehicles.filter((v: any) => v.tag === "OFERTA ESPECIAL").length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Carregando painel administrativo...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Painel Administrativo</h1>
              <p className="text-gray-600 dark:text-gray-400">Gerencie todos os veículos do sistema</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <RealtimeStatus />
            <div className="text-xs text-muted-foreground">Última atualização: {lastUpdate.toLocaleTimeString()}</div>
            <Button variant="outline" onClick={refresh} className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Atualizar</span>
            </Button>
            <Button onClick={() => router.push("/admin/criar-veiculo")} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Novo Veículo</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vehicles" className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Veículos ({vehicles.length})</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Estatísticas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Inativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ofertas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.offers}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-6">
            {/* Filtros */}
            <VehiclesFilter onFiltersChange={handleFiltersChange} initialFilters={filters} />

            {/* Lista de Veículos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles
                .map((vehicle: any) => {
                  // Verificação de segurança
                  if (!vehicle || !vehicle.id) {
                    console.warn("⚠️ [Admin Panel] Veículo inválido ignorado:", vehicle)
                    return null
                  }

                  return (
                    <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {vehicle.name || `${vehicle.brand || ""} ${vehicle.model || ""}`.trim() || "Veículo"}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{vehicle.year || "Ano não informado"}</p>
                            <p className="text-xs text-muted-foreground">ID: {vehicle.id}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge variant={vehicle.tag === "OFERTA ESPECIAL" ? "destructive" : "default"}>
                              {vehicle.tag || "DISPONÍVEL"}
                            </Badge>
                            <Badge
                              variant={
                                vehicle.isActive !== false && vehicle.is_active !== false ? "default" : "secondary"
                              }
                            >
                              {vehicle.isActive !== false && vehicle.is_active !== false ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Preço:</span>
                            <span className="font-semibold">{vehicle.price || "Não informado"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Combustível:</span>
                            <span className="text-sm">{vehicle.fuel || "Não informado"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Cor:</span>
                            <span className="text-sm">{vehicle.color || "Não informado"}</span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={vehicle.isActive !== false && vehicle.is_active !== false}
                                onCheckedChange={() =>
                                  handleToggleStatus(
                                    vehicle.id,
                                    vehicle.isActive !== false && vehicle.is_active !== false,
                                  )
                                }
                              />
                              <span className="text-sm">
                                {vehicle.isActive !== false && vehicle.is_active !== false ? "Ativo" : "Inativo"}
                              </span>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex justify-between gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditVehicle(vehicle)}
                              className="flex-1"
                            >
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
                  )
                })
                .filter(Boolean)}{" "}
              {/* Remove elementos null */}
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de Edição Completa */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Veículo Completo - ID: {editingVehicle?.id}</DialogTitle>
          </DialogHeader>

          {editingVehicle && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Veículo *</Label>
                    <Input
                      id="name"
                      value={editingVehicle.name}
                      onChange={(e) => {
                        console.log("📝 [Admin Panel] Nome alterado:", e.target.value)
                        setEditingVehicle({ ...editingVehicle, name: e.target.value })
                      }}
                      placeholder="Ex: Honda Civic 2023"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Ano *</Label>
                    <Input
                      id="year"
                      value={editingVehicle.year}
                      onChange={(e) => {
                        console.log("📝 [Admin Panel] Ano alterado:", e.target.value)
                        setEditingVehicle({ ...editingVehicle, year: e.target.value })
                      }}
                      placeholder="2023"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="brand">Marca *</Label>
                    <Input
                      id="brand"
                      value={editingVehicle.brand}
                      onChange={(e) => {
                        console.log("📝 [Admin Panel] Marca alterada:", e.target.value)
                        setEditingVehicle({ ...editingVehicle, brand: e.target.value })
                      }}
                      placeholder="Honda"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Modelo *</Label>
                    <Input
                      id="model"
                      value={editingVehicle.model}
                      onChange={(e) => {
                        console.log("📝 [Admin Panel] Modelo alterado:", e.target.value)
                        setEditingVehicle({ ...editingVehicle, model: e.target.value })
                      }}
                      placeholder="Civic"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Cor *</Label>
                    <Input
                      id="color"
                      value={editingVehicle.color}
                      onChange={(e) => {
                        console.log("📝 [Admin Panel] Cor alterada:", e.target.value)
                        setEditingVehicle({ ...editingVehicle, color: e.target.value })
                      }}
                      placeholder="Branco"
                    />
                  </div>
                </div>
              </div>

              {/* Preços */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preços</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Preço Atual *</Label>
                    <Input
                      id="price"
                      value={editingVehicle.price}
                      onChange={(e) => {
                        const formattedValue = formatPrice(e.target.value)
                        console.log("📝 [Admin Panel] Preço alterado:", formattedValue)
                        setEditingVehicle({ ...editingVehicle, price: formattedValue })
                      }}
                      placeholder="85.000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Preço Original (para ofertas)</Label>
                    <Input
                      id="originalPrice"
                      value={editingVehicle.originalPrice || ""}
                      onChange={(e) => {
                        const formattedValue = formatPrice(e.target.value)
                        console.log("📝 [Admin Panel] Preço original alterado:", formattedValue)
                        setEditingVehicle({ ...editingVehicle, originalPrice: formattedValue })
                      }}
                      placeholder="95.000"
                    />
                  </div>
                </div>
              </div>

              {/* Especificações Técnicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Especificações Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="fuel">Combustível *</Label>
                    <Select
                      value={editingVehicle.fuel}
                      onValueChange={(value) => {
                        console.log("📝 [Admin Panel] Combustível alterado:", value)
                        setEditingVehicle({ ...editingVehicle, fuel: value })
                      }}
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
                      onValueChange={(value) => {
                        console.log("📝 [Admin Panel] Transmissão alterada:", value)
                        setEditingVehicle({ ...editingVehicle, transmission: value })
                      }}
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
                    <Label htmlFor="doors">Portas</Label>
                    <Input
                      id="doors"
                      value={editingVehicle.doors || ""}
                      onChange={(e) => {
                        console.log("📝 [Admin Panel] Portas alteradas:", e.target.value)
                        setEditingVehicle({ ...editingVehicle, doors: e.target.value })
                      }}
                      placeholder="4 portas"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="engine">Motor</Label>
                    <Input
                      id="engine"
                      value={editingVehicle.engine || ""}
                      onChange={(e) => {
                        console.log("📝 [Admin Panel] Motor alterado:", e.target.value)
                        setEditingVehicle({ ...editingVehicle, engine: e.target.value })
                      }}
                      placeholder="2.0 16V"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mileage">Quilometragem</Label>
                    <Input
                      id="mileage"
                      value={editingVehicle.mileage}
                      onChange={(e) => {
                        console.log("📝 [Admin Panel] Quilometragem alterada:", e.target.value)
                        setEditingVehicle({ ...editingVehicle, mileage: e.target.value })
                      }}
                      placeholder="50.000 km"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fuelConsumption">Consumo</Label>
                    <Input
                      id="fuelConsumption"
                      value={editingVehicle.fuelConsumption || ""}
                      onChange={(e) => {
                        console.log("📝 [Admin Panel] Consumo alterado:", e.target.value)
                        setEditingVehicle({ ...editingVehicle, fuelConsumption: e.target.value })
                      }}
                      placeholder="12 km/l"
                    />
                  </div>
                </div>
              </div>

              {/* Categoria e Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Categoria e Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="tag">Tag *</Label>
                    <Select
                      value={editingVehicle.tag}
                      onValueChange={(value) => {
                        console.log("📝 [Admin Panel] Tag alterada:", value)
                        setEditingVehicle({ ...editingVehicle, tag: value })
                      }}
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
                    <Label htmlFor="condition">Condição</Label>
                    <Select
                      value={editingVehicle.condition || ""}
                      onValueChange={(value) => {
                        console.log("📝 [Admin Panel] Condição alterada:", value)
                        setEditingVehicle({ ...editingVehicle, condition: value })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Novo">Novo</SelectItem>
                        <SelectItem value="Seminovo">Seminovo</SelectItem>
                        <SelectItem value="Usado">Usado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="warranty">Garantia</Label>
                    <Input
                      id="warranty"
                      value={editingVehicle.warranty || ""}
                      onChange={(e) => {
                        console.log("📝 [Admin Panel] Garantia alterada:", e.target.value)
                        setEditingVehicle({ ...editingVehicle, warranty: e.target.value })
                      }}
                      placeholder="12 meses"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={editingVehicle.isActive}
                    onCheckedChange={(checked) => {
                      console.log("📝 [Admin Panel] Status ativo alterado:", checked)
                      setEditingVehicle({ ...editingVehicle, isActive: checked })
                    }}
                  />
                  <Label htmlFor="isActive">Veículo ativo (visível ao público)</Label>
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Descrição</h3>
                <Textarea
                  value={editingVehicle.description}
                  onChange={(e) => {
                    console.log("📝 [Admin Panel] Descrição alterada")
                    setEditingVehicle({ ...editingVehicle, description: e.target.value })
                  }}
                  placeholder="Descreva as características e condições do veículo..."
                  rows={4}
                />
              </div>

              {/* Características */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Características</h3>
                <div className="space-y-2">
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

              {/* Imagens */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Imagens</h3>
                <div className="space-y-2">
                  {editingVehicle.images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={image}
                        onChange={(e) => updateImage(index, e.target.value)}
                        placeholder="URL da imagem"
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm" onClick={() => removeImage(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addImage} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Imagem
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
