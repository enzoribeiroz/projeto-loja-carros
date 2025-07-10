// Sistema de veículos mock com persistência local
export interface Vehicle {
  id: string
  name: string
  brand: string
  model: string
  year: number
  price: string
  originalPrice?: string
  mileage: string
  fuel: string
  transmission: string
  color: string
  description: string
  features: string[]
  tag: string
  images: string[]
  location: string
  isActive: boolean
  seller: {
    name: string
    avatar: string
    rating: number
    phone: string
    whatsapp: string
  }
}

// Dados iniciais seguros
const initialVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Honda Civic 2023",
    brand: "Honda",
    model: "Civic",
    year: 2023,
    price: "R$ 125.000",
    originalPrice: "R$ 135.000",
    mileage: "15.000 km",
    fuel: "Flex",
    transmission: "CVT",
    color: "Branco Pérola",
    description: "Sedan executivo com tecnologia avançada e excelente economia de combustível.",
    features: ["Ar condicionado", "Direção elétrica", "Vidros elétricos", "Central multimídia", "Câmera de ré"],
    tag: "SEMINOVO",
    images: ["/placeholder.svg?height=300&width=400"],
    location: "São Paulo, SP",
    isActive: true,
    seller: {
      name: "AutoMax Concessionária",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      phone: "(11) 99999-9999",
      whatsapp: "5511999999999",
    },
  },
  {
    id: "2",
    name: "Toyota Corolla 2022",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    price: "R$ 115.000",
    mileage: "25.000 km",
    fuel: "Flex",
    transmission: "CVT",
    color: "Prata",
    description: "Sedan confiável com baixo consumo e manutenção econômica.",
    features: ["Ar condicionado", "Direção hidráulica", "Vidros elétricos", "Som original"],
    tag: "SEMINOVO",
    images: ["/placeholder.svg?height=300&width=400"],
    location: "São Paulo, SP",
    isActive: true,
    seller: {
      name: "AutoMax Concessionária",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      phone: "(11) 99999-9999",
      whatsapp: "5511999999999",
    },
  },
  {
    id: "3",
    name: "Volkswagen Jetta 2021",
    brand: "Volkswagen",
    model: "Jetta",
    year: 2021,
    price: "R$ 95.000",
    originalPrice: "R$ 105.000",
    mileage: "35.000 km",
    fuel: "Flex",
    transmission: "Automático",
    color: "Azul Metálico",
    description: "Sedan alemão com design elegante e performance superior.",
    features: ["Ar condicionado", "Direção elétrica", "Vidros elétricos", "Central multimídia", "Teto solar"],
    tag: "OFERTA ESPECIAL",
    images: ["/placeholder.svg?height=300&width=400"],
    location: "São Paulo, SP",
    isActive: true,
    seller: {
      name: "AutoMax Concessionária",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      phone: "(11) 99999-9999",
      whatsapp: "5511999999999",
    },
  },
]

// Estado global dos veículos
let vehicles: Vehicle[] = [...initialVehicles]

export function canCreateVehicles(email: string): boolean {
  const authorizedEmails = ["caio@caio.com"]
  return authorizedEmails.includes(email.toLowerCase())
}

export function getAllVehicles(): Vehicle[] {
  console.log("📋 [Mock Vehicles] Retornando todos os veículos:", vehicles.length)
  return vehicles.map((v) => ({ ...v })) // Retorna cópias seguras
}

export function getVehicleById(id: string): Vehicle | null {
  console.log("🔍 [Mock Vehicles] Buscando veículo por ID:", id)
  const vehicle = vehicles.find((v) => v.id === id)
  if (vehicle) {
    console.log("✅ [Mock Vehicles] Veículo encontrado:", vehicle.name)
    return { ...vehicle } // Retorna uma cópia
  } else {
    console.log("❌ [Mock Vehicles] Veículo não encontrado")
    return null
  }
}

export function addVehicle(vehicleData: any): Vehicle {
  console.log("➕ [Mock Vehicles] Adicionando novo veículo:", vehicleData.name)

  const newVehicle: Vehicle = {
    id: Date.now().toString(),
    name: vehicleData.name || "Veículo",
    brand: vehicleData.brand || "Marca",
    model: vehicleData.model || "Modelo",
    year: typeof vehicleData.year === "number" ? vehicleData.year : Number.parseInt(vehicleData.year) || 2023,
    price: vehicleData.price || "R$ 0",
    originalPrice: vehicleData.originalPrice,
    mileage: vehicleData.mileage || "0 km",
    fuel: vehicleData.fuel || "Flex",
    transmission: vehicleData.transmission || "Manual",
    color: vehicleData.color || "Branco",
    description: vehicleData.description || "",
    features: Array.isArray(vehicleData.features) ? vehicleData.features : [],
    tag: vehicleData.tag || "DISPONÍVEL",
    images: Array.isArray(vehicleData.images) ? vehicleData.images : ["/placeholder.svg?height=300&width=400"],
    location: "São Paulo, SP",
    isActive: vehicleData.isActive !== false,
    seller: {
      name: "AutoMax Concessionária",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      phone: "(11) 99999-9999",
      whatsapp: "5511999999999",
    },
  }

  vehicles.push(newVehicle)
  console.log("✅ [Mock Vehicles] Veículo adicionado com ID:", newVehicle.id)
  console.log("📊 [Mock Vehicles] Total de veículos:", vehicles.length)

  return { ...newVehicle }
}

export function updateVehicle(id: string, updateData: any): Vehicle | null {
  console.log("🔄 [Mock Vehicles] === INICIANDO ATUALIZAÇÃO MOCK ===")
  console.log("🆔 [Mock Vehicles] ID:", id)
  console.log("📝 [Mock Vehicles] Dados para atualizar:", JSON.stringify(updateData, null, 2))

  const vehicleIndex = vehicles.findIndex((v) => v.id === id)

  if (vehicleIndex === -1) {
    console.error("❌ [Mock Vehicles] Veículo não encontrado com ID:", id)
    console.log(
      "📋 [Mock Vehicles] IDs disponíveis:",
      vehicles.map((v) => v.id),
    )
    return null
  }

  const currentVehicle = vehicles[vehicleIndex]
  console.log("✅ [Mock Vehicles] Veículo encontrado:", currentVehicle.name)

  // Criar veículo atualizado com validação de tipos
  const updatedVehicle: Vehicle = {
    ...currentVehicle,
    name: updateData.name || currentVehicle.name,
    brand: updateData.brand || currentVehicle.brand,
    model: updateData.model || currentVehicle.model,
    year: updateData.year
      ? typeof updateData.year === "number"
        ? updateData.year
        : Number.parseInt(updateData.year)
      : currentVehicle.year,
    price: updateData.price || currentVehicle.price,
    originalPrice: updateData.originalPrice !== undefined ? updateData.originalPrice : currentVehicle.originalPrice,
    mileage: updateData.mileage || currentVehicle.mileage,
    fuel: updateData.fuel || currentVehicle.fuel,
    transmission: updateData.transmission || currentVehicle.transmission,
    color: updateData.color || currentVehicle.color,
    description: updateData.description !== undefined ? updateData.description : currentVehicle.description,
    features: Array.isArray(updateData.features) ? updateData.features : currentVehicle.features,
    tag: updateData.tag || currentVehicle.tag,
    images: Array.isArray(updateData.images) ? updateData.images : currentVehicle.images,
    location: currentVehicle.location,
    isActive: updateData.isActive !== undefined ? updateData.isActive : currentVehicle.isActive,
    seller: currentVehicle.seller, // Manter dados do vendedor
  }

  // Substituir o veículo no array
  vehicles[vehicleIndex] = updatedVehicle

  console.log("✅ [Mock Vehicles] Veículo atualizado com sucesso")
  console.log("📝 [Mock Vehicles] Nome final:", updatedVehicle.name)
  console.log("📊 [Mock Vehicles] Total de veículos:", vehicles.length)

  return { ...updatedVehicle } // Retorna uma cópia
}

export function deleteVehicle(id: string): boolean {
  console.log("🗑️ [Mock Vehicles] Deletando veículo:", id)

  const initialLength = vehicles.length
  vehicles = vehicles.filter((v) => v.id !== id)

  const deleted = vehicles.length < initialLength

  if (deleted) {
    console.log("✅ [Mock Vehicles] Veículo deletado com sucesso")
    console.log("📊 [Mock Vehicles] Total de veículos:", vehicles.length)
  } else {
    console.log("❌ [Mock Vehicles] Veículo não encontrado para deletar")
  }

  return deleted
}

// Função para debug - listar todos os IDs
export function debugListVehicleIds(): void {
  console.log("🔍 [Mock Vehicles] === DEBUG: LISTA DE IDs ===")
  vehicles.forEach((vehicle, index) => {
    console.log(`${index + 1}. ID: ${vehicle.id} - Nome: ${vehicle.name}`)
  })
  console.log("📊 [Mock Vehicles] Total:", vehicles.length)
}

// Função para forçar refresh dos dados
export function refreshVehicles(): Vehicle[] {
  console.log("🔄 [Mock Vehicles] Refresh solicitado")
  return vehicles.map((v) => ({ ...v }))
}
