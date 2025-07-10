"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-supabase"
import { getVehicleByIdHybrid } from "@/lib/vehicles-hybrid"
import { addToFavorites, removeFromFavorites } from "@/lib/vehicles-supabase"
import { formatPrice, formatMileage } from "@/lib/format"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Star,
  Calendar,
  Gauge,
  Fuel,
  Users,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Lock,
  RefreshCw,
} from "lucide-react"

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState(null)
  const [vehicle, setVehicle] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user: authUser } = useAuth()

  const vehicleId = params.id as string

  useEffect(() => {
    setMounted(true)
  }, [])

  // Função para carregar veículo
  const loadVehicle = async () => {
    try {
      setLoading(true)
      console.log("🔄 [Vehicle Detail] === CARREGANDO VEÍCULO ===")
      console.log("🆔 [Vehicle Detail] Vehicle ID:", vehicleId)
      const vehicleData = await getVehicleByIdHybrid(vehicleId)
      console.log("📝 [Vehicle Detail] Dados do veículo:", JSON.stringify(vehicleData, null, 2))
      setVehicle(vehicleData)

      if (authUser && vehicleData) {
        try {
          // Try to check favorite status, but don't fail if it doesn't work
          const favoriteStatus = await checkFavoriteStatus(authUser.id, vehicleData.id)
          setIsFavorite(favoriteStatus)
        } catch (error) {
          console.warn("Could not check favorite status:", error)
          setIsFavorite(false)
        }
      }
    } catch (error) {
      console.error("❌ [Vehicle Detail] Error loading vehicle:", error)
      setVehicle(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mounted) {
      setUser(authUser)

      // Verificar se o usuário está logado
      if (!authUser) {
        // Redirecionar para login se não estiver logado
        router.push("/login")
        return
      }

      loadVehicle()
    }
  }, [mounted, authUser, vehicleId, router])

  // Recarregar veículo quando a página ganha foco
  useEffect(() => {
    const handleFocus = () => {
      if (mounted && authUser) {
        console.log("🔄 [Vehicle Detail] Página ganhou foco, recarregando veículo...")
        loadVehicle()
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && mounted && authUser) {
        console.log("🔄 [Vehicle Detail] Página ficou visível, recarregando veículo...")
        loadVehicle()
      }
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [mounted, authUser])

  // Helper function to safely check favorite status
  const checkFavoriteStatus = async (userId: string, vehicleId: string) => {
    // This is a placeholder - implement based on your favorites system
    return false
  }

  const handleRefresh = async () => {
    console.log("🔄 [Vehicle Detail] Refresh manual solicitado")
    await loadVehicle()
  }

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

  // Verificação de segurança - usuário não logado
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-8">
              <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
              <p className="text-muted-foreground mb-6">
                Você precisa estar logado para visualizar os detalhes dos veículos.
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => router.push("/login")} className="w-full" size="lg">
                Fazer Login
              </Button>
              <Button onClick={() => router.push("/cadastro")} variant="outline" className="w-full" size="lg">
                Criar Conta
              </Button>
              <Button onClick={() => router.push("/veiculos")} variant="ghost" className="w-full">
                Voltar para Veículos
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Carregando detalhes do veículo...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Veículo não encontrado</h2>
            <div className="space-y-3">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button onClick={() => router.push("/veiculos")}>Voltar para Veículos</Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Ensure vehicle has required properties with fallbacks
  const vehicleImages = vehicle.images || ["/placeholder.svg?height=400&width=600"]
  const vehicleFeatures = vehicle.features || []

  // Create seller object with fallbacks
  const seller = vehicle.seller ||
    vehicle.sellerInfo || {
      name: "AutoMax Concessionária",
      avatar: "/placeholder.svg?height=48&width=48",
      rating: "4.8",
      phone: "(11) 99999-9999",
      whatsapp: "11999999999",
    }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length)
  }

  const handleContact = (type: "phone" | "whatsapp") => {
    const phone = seller.phone || "(11) 99999-9999"
    const whatsapp = seller.whatsapp || seller.phone || "11999999999"

    if (type === "phone") {
      window.open(`tel:${phone}`)
    } else {
      const message = encodeURIComponent(
        `Olá! Tenho interesse no ${vehicle.name || vehicle.brand + " " + vehicle.model}`,
      )
      const cleanWhatsapp = whatsapp.replace(/\D/g, "")
      window.open(`https://wa.me/${cleanWhatsapp}?text=${message}`)
    }
  }

  const handleShare = () => {
    const vehicleName = vehicle.name || `${vehicle.brand} ${vehicle.model}`
    const vehiclePrice = formatPrice(vehicle.price) || "Consulte o preço"

    if (navigator.share) {
      navigator.share({
        title: vehicleName,
        text: `Confira este ${vehicleName} por ${vehiclePrice}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copiado para a área de transferência!")
    }
  }

  const toggleFavorite = async () => {
    if (!user || !vehicle) return

    try {
      if (isFavorite) {
        await removeFromFavorites(user.id, vehicle.id)
      } else {
        await addToFavorites(user.id, vehicle.id)
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.warn("Could not toggle favorite:", error)
    }
  }

  const isOferta = vehicle.tag === "OFERTA ESPECIAL" || vehicle.category === "ofertas"
  const vehicleName = vehicle.name || `${vehicle.brand} ${vehicle.model}`
  const vehiclePrice = formatPrice(vehicle.price)
  const vehicleOriginalPrice = vehicle.originalPrice ? formatPrice(vehicle.originalPrice) : null
  const vehicleYear = vehicle.year || "N/A"
  const vehicleMileage = formatMileage(vehicle.mileage)
  const vehicleFuel = vehicle.fuel || "N/A"
  const vehicleSeats = vehicle.seats || "N/A"
  const vehicleColor = vehicle.color || "N/A"
  const vehicleTransmission = vehicle.transmission || "N/A"
  const vehicleDescription = vehicle.description || "Descrição não disponível."
  const vehicleLocation = vehicle.location || "São Paulo, SP"
  const vehiclePostDate = vehicle.postDate || vehicle.createdAt || "Recente"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={vehicleImages[currentImageIndex] || "/placeholder.svg"}
                    alt={vehicleName}
                    className="w-full h-96 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=400&width=600"
                    }}
                  />

                  <Badge
                    className={`absolute top-4 left-4 font-semibold ${
                      isOferta ? "bg-red-600 text-white" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {vehicle.tag || (isOferta ? "OFERTA ESPECIAL" : "DISPONÍVEL")}
                  </Badge>

                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={toggleFavorite}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handleShare}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Navigation Arrows - Only show if more than 1 image */}
                  {vehicleImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Image Indicators - Only show if more than 1 image */}
                  {vehicleImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {vehicleImages.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentImageIndex ? "bg-white" : "bg-white/50"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Gallery - Only show if more than 1 image */}
            {vehicleImages.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {vehicleImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${vehicleName} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{vehicleName}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {vehiclePostDate}
                      </span>
                      <span>{vehicleLocation}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {isOferta && vehicleOriginalPrice && (
                      <p className="text-lg text-muted-foreground line-through">{vehicleOriginalPrice}</p>
                    )}
                    <p className={`text-3xl font-bold ${isOferta ? "text-red-600" : "text-primary"}`}>{vehiclePrice}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ano</p>
                      <p className="font-semibold">{vehicleYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gauge className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Quilometragem</p>
                      <p className="font-semibold">{vehicleMileage}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Fuel className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Combustível</p>
                      <p className="font-semibold">{vehicleFuel}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Lugares</p>
                      <p className="font-semibold">{vehicleSeats}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Descrição</h3>
                  <p className="text-muted-foreground leading-relaxed">{vehicleDescription}</p>
                </div>
              </CardContent>
            </Card>

            {vehicleFeatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Características</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {vehicleFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={seller.avatar || "/placeholder.svg?height=48&width=48"}
                    alt={seller.name || "Vendedor"}
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                    }}
                  />
                  <div>
                    <h4 className="font-semibold">{seller.name || "AutoMax Concessionária"}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{seller.rating || "4.8"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={() => handleContact("phone")} className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar
                  </Button>
                  <Button onClick={() => handleContact("whatsapp")} variant="outline" className="w-full" size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes Técnicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cor:</span>
                    <span className="font-medium">{vehicleColor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transmissão:</span>
                    <span className="font-medium">{vehicleTransmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Combustível:</span>
                    <span className="font-medium">{vehicleFuel}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
