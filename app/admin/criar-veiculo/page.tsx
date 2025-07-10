"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useAuth } from "@/components/auth-provider"
import { useAuth } from "@/lib/auth-supabase"
import { canCreateVehiclesHybrid, createVehicleHybrid } from "@/lib/vehicles-hybrid"
import ImageUpload from "@/components/image-upload"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { handleCurrencyInput, handleMileageInput, handleFuelConsumptionInput } from "@/lib/format"

export default function CriarVeiculoPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    brand: "",
    price: "",
    year: "",
    mileage: "",
    fuel: "",
    seats: "5 lugares",
    color: "",
    transmission: "",
    description: "",
    tag: "NOVO",
    originalPrice: "",
    fuelConsumption: "",
  })

  const [images, setImages] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      console.log("🔍 Verificando acesso à página de criar veículo...")
      console.log("👤 Usuário:", user)

      if (!user) {
        console.log("❌ Usuário não encontrado, redirecionando para login")
        router.push("/login")
        return
      }

      console.log("📧 Email do usuário:", user?.email)

      const canCreate = canCreateVehiclesHybrid(user?.email || "")
      console.log("🔍 Pode criar veículos:", canCreate)

      if (!canCreate) {
        console.log("❌ Sem permissão, redirecionando para veículos")
        router.push("/veiculos")
        return
      }

      console.log("✅ Acesso autorizado à página de criar veículo")
    }
  }, [mounted, user, router])

  if (!mounted) {
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

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value

    // Aplicar formatação específica para cada campo
    switch (field) {
      case "price":
      case "originalPrice":
        formattedValue = handleCurrencyInput(value)
        break
      case "mileage":
        formattedValue = handleMileageInput(value)
        break
      case "fuelConsumption":
        formattedValue = handleFuelConsumptionInput(value)
        break
      default:
        formattedValue = value
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }))

    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages)
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }))
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures((prev) => [...prev, newFeature.trim()])
      setNewFeature("")
      if (errors.features) {
        setErrors((prev) => ({ ...prev, features: "" }))
      }
    }
  }

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.model.trim()) newErrors.model = "Modelo do carro é obrigatório"
    if (!formData.price.trim()) newErrors.price = "Preço é obrigatório"
    if (!formData.year.trim()) newErrors.year = "Ano é obrigatório"
    if (!formData.mileage.trim()) newErrors.mileage = "Quilometragem é obrigatória"
    if (!formData.fuel.trim()) newErrors.fuel = "Combustível é obrigatório"
    if (!formData.color.trim()) newErrors.color = "Cor é obrigatória"
    if (!formData.transmission.trim()) newErrors.transmission = "Transmissão é obrigatória"
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória"
    if (features.length === 0) newErrors.features = "Adicione pelo menos uma característica"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    formData.name = formData.brand.trim() + " " + formData.model.trim() +  " " + formData.year.trim();

    console.log("🚀 === INICIANDO CRIAÇÃO DE VEÍCULO ===")
    console.log("📝 Dados do formulário:", formData)
    console.log("📸 Imagens:", images)
    console.log("🔧 Características:", features)

    if (!validateForm()) {
      console.log("❌ Validação falhou:", errors)
      return
    }

    // Prevenir múltiplos envios
    if (loading) {
      console.log("⚠️ Formulário já está sendo enviado")
      return
    }

    setLoading(true)

    try {
      // Usar imagens padrão se não houver imagens
      const vehicleImages = images.length > 0 ? images : ["/placeholder.svg?height=400&width=600"]

      const vehicleData = {
        ...formData,
        features,
        images: vehicleImages,
      }

      console.log("📦 Dados finais para criação:", vehicleData)
      console.log("👤 User ID:", user?.id)

      const newVehicle = await createVehicleHybrid(vehicleData, user?.id || "")

      console.log("✅ Veículo criado com sucesso:", newVehicle)

      if (newVehicle && newVehicle.id) {
        alert("Veículo criado com sucesso!")
        router.push(`/veiculo/${newVehicle.id}`)
      } else {
        throw new Error("Veículo criado mas sem ID retornado")
      }
    } catch (error) {
      console.error("❌ === ERRO AO CRIAR VEÍCULO ===", error)
      alert(`Erro ao criar veículo: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Criar Novo Veículo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload de Imagens */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Imagens do Veículo</label>
                  <ImageUpload images={images} onImagesChange={handleImagesChange} maxImages={5} />
                  {errors.images && <p className="text-sm text-red-500 mt-2">{errors.images}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do Carro *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ex: Honda Civic 2023"
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div> */}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Modelo do Carro *</label>
                    <Input
                      value={formData.model}
                      onChange={(e) => handleInputChange("model", e.target.value)}
                      placeholder="Ex: Civic"
                    />
                    {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Marca do Carro *</label>
                    <Input
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                      placeholder="Ex: Honda"
                    />
                    {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preço Atual *</label>
                    <Input
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="Ex: R$ 125.000"
                    />
                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ano *</label>
                    <Input
                      value={formData.year}
                      onChange={(e) => handleInputChange("year", e.target.value)}
                      placeholder="Ex: 2023"
                    />
                    {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quilometragem *</label>
                    <Input
                      value={formData.mileage}
                      onChange={(e) => handleInputChange("mileage", e.target.value)}
                      placeholder="Ex: 0 km ou 15.000 km"
                    />
                    {errors.mileage && <p className="text-sm text-red-500">{errors.mileage}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Combustível *</label>
                    <Select value={formData.fuel} onValueChange={(value) => handleInputChange("fuel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o combustível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Flex">Flex</SelectItem>
                        <SelectItem value="Gasolina">Gasolina</SelectItem>
                        <SelectItem value="Etanol">Etanol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Elétrico">Elétrico</SelectItem>
                        <SelectItem value="Híbrido">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.fuel && <p className="text-sm text-red-500">{errors.fuel}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cor *</label>
                    <Input
                      value={formData.color}
                      onChange={(e) => handleInputChange("color", e.target.value)}
                      placeholder="Ex: Branco Pérola"
                    />
                    {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transmissão *</label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) => handleInputChange("transmission", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de transmissão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automático">Automático</SelectItem>
                        <SelectItem value="CVT">CVT</SelectItem>
                        <SelectItem value="Semi-automático">Semi-automático</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.transmission && <p className="text-sm text-red-500">{errors.transmission}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria</label>
                    <Select value={formData.tag} onValueChange={(value) => handleInputChange("tag", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NOVO">Novo</SelectItem>
                        <SelectItem value="SEMINOVO">Seminovo</SelectItem>
                        <SelectItem value="PREMIUM">Premium</SelectItem>
                        <SelectItem value="OFERTA ESPECIAL">Oferta Especial</SelectItem>
                        <SelectItem value="DISPONÍVEL">Disponível</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.tag === "OFERTA ESPECIAL" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preço Original</label>
                      <Input
                        value={formData.originalPrice}
                        onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                        placeholder="Ex: R$ 135.000"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Consumo de Combustível</label>
                    <Input
                      value={formData.fuelConsumption}
                      onChange={(e) => handleInputChange("fuelConsumption", e.target.value)}
                      placeholder="Ex: 12,5 km/l"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descreva o veículo detalhadamente..."
                    rows={4}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Características *</label>
                  <div className="flex space-x-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Ex: Ar condicionado digital"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  {errors.features && <p className="text-sm text-red-500">{errors.features}</p>}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Criar Veículo"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
