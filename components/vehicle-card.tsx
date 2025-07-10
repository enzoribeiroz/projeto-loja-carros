"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Tag, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatPrice } from "@/lib/format"

interface Vehicle {
  id: number
  name: string
  images: string[]
  tag: string
  seller: {
    name: string
    avatar: string
    rating: number
  }
  price: string
  originalPrice?: string
  postDate: string
}

interface VehicleCardProps {
  vehicle: Vehicle
  onSelectVehicle?: (price: string) => void
  showSelectButton?: boolean
}

export default function VehicleCard({ vehicle, onSelectVehicle, showSelectButton = false }: VehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLoginAlert, setShowLoginAlert] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length)
  }

  const handleSelectVehicle = () => {
    if (!user) {
      setShowLoginAlert(true)
      setTimeout(() => setShowLoginAlert(false), 3000)
      return
    }

    if (!user.profileComplete) {
      router.push("/complete-profile")
      return
    }

    if (onSelectVehicle) {
      onSelectVehicle(vehicle.price)
    }
  }

  const handleViewMore = () => {
    if (!user) {
      setShowLoginAlert(true)
      setTimeout(() => setShowLoginAlert(false), 3000)
      return
    }

    if (!user.profileComplete) {
      router.push("/complete-profile")
      return
    }

    router.push(`/veiculo/${vehicle.id}`)
  }

  const isOferta = vehicle.tag === "OFERTA ESPECIAL"
  const formattedPrice = formatPrice(vehicle.price)
  const formattedOriginalPrice = vehicle.originalPrice ? formatPrice(vehicle.originalPrice) : null

  return (
    <div className="relative">
      {showLoginAlert && (
        <Alert className="absolute top-0 left-0 right-0 z-10 bg-yellow-50 border-yellow-200">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">Login necessário!</span>
            <Button
              variant="link"
              className="p-0 h-auto font-medium text-primary underline ml-1"
              onClick={() => router.push("/login")}
            >
              Faça login para ver detalhes dos veículos
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={vehicle.images[currentImageIndex] || "/placeholder.svg"}
              alt={vehicle.name}
              className="w-full h-48 object-cover"
            />

            <Badge
              className={`absolute top-4 left-1/2 transform -translate-x-1/2 font-semibold ${
                isOferta ? "bg-red-600 text-white hover:bg-red-700" : "bg-primary text-primary-foreground"
              }`}
            >
              {isOferta && <Tag className="h-3 w-3 mr-1" />}
              {vehicle.tag}
            </Badge>

            {isOferta && vehicle.originalPrice && (
              <Badge className="absolute top-4 right-4 bg-green-600 text-white font-bold">
                {Math.round(
                  ((Number.parseFloat(vehicle.originalPrice.replace(/[^\d]/g, "")) -
                    Number.parseFloat(vehicle.price.replace(/[^\d]/g, ""))) /
                    Number.parseFloat(vehicle.originalPrice.replace(/[^\d]/g, ""))) *
                    100,
                )}
                % OFF
              </Badge>
            )}

            {vehicle.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {vehicle.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {vehicle.images.map((_, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className={`w-2 h-2 rounded-full p-0 ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">{vehicle.name}</h3>

              <div className="flex items-center gap-2">
                {isOferta && formattedOriginalPrice && (
                  <span className="text-sm text-muted-foreground line-through">{formattedOriginalPrice}</span>
                )}
                <p className={`text-2xl font-bold ${isOferta ? "text-red-600" : "text-primary"}`}>{formattedPrice}</p>
              </div>

              {isOferta && vehicle.originalPrice && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  Economia de{" "}
                  {formatPrice(
                    Number.parseFloat(vehicle.originalPrice.replace(/[^\d]/g, "")) -
                      Number.parseFloat(vehicle.price.replace(/[^\d]/g, "")),
                  )}
                </p>
              )}
            </div>

            <div className="space-y-2">
              {showSelectButton && (
                <Button onClick={handleSelectVehicle} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {!user ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Login Necessário
                    </>
                  ) : (
                    "Selecionar para Financiamento"
                  )}
                </Button>
              )}

              <Button
                onClick={handleViewMore}
                className={`w-full ${isOferta ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                variant={isOferta ? "default" : "outline"}
              >
                {!user ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Login para Ver Mais
                  </>
                ) : isOferta ? (
                  "Ver Oferta"
                ) : (
                  "Ver Mais"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
