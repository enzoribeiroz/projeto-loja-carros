import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"]
type VehicleInsert = Database["public"]["Tables"]["vehicles"]["Insert"]
type VehicleImageInsert = Database["public"]["Tables"]["vehicle_images"]["Insert"]
type VehicleFeatureInsert = Database["public"]["Tables"]["vehicle_features"]["Insert"]

export interface VehicleWithDetails extends VehicleRow {
  images: string[]
  features: string[]
  seller: {
    name: string
    avatar: string
    rating: number
    phone: string
    whatsapp: string
  }
}

// Função para verificar se o usuário pode criar veículos
export function canCreateVehicles(email: string): boolean {
  const authorizedEmails = ["caio@caio.com"]
  return authorizedEmails.includes(email.toLowerCase())
}

// Função auxiliar para validar e limpar dados numéricos
function sanitizeNumericField(value: any): string | null {
  if (value === undefined || value === null || value === "") {
    return null
  }

  const stringValue = String(value).trim()
  if (stringValue === "") {
    return null
  }

  return stringValue
}

// Função auxiliar para validar campos obrigatórios
function validateVehicleData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || String(data.name).trim() === "") {
    errors.push("Nome é obrigatório")
  }

  if (!data.price || String(data.price).trim() === "") {
    errors.push("Preço é obrigatório")
  }

  if (!data.year || String(data.year).trim() === "") {
    errors.push("Ano é obrigatório")
  }

  if (!data.fuel || String(data.fuel).trim() === "") {
    errors.push("Combustível é obrigatório")
  }

  if (!data.color || String(data.color).trim() === "") {
    errors.push("Cor é obrigatória")
  }

  if (!data.transmission || String(data.transmission).trim() === "") {
    errors.push("Transmissão é obrigatória")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Função auxiliar para atualizar características - SEM VERIFICAÇÃO DE AUTH
async function updateVehicleFeatures(vehicleId: string, features: string[]) {
  if (!isSupabaseConfigured() || !supabase) {
    console.log("⚠️ [Supabase] Supabase não configurado, pulando características")
    return
  }

  try {
    console.log("🔄 [Supabase] === ATUALIZANDO CARACTERÍSTICAS (SEM AUTH) ===")
    console.log("🆔 [Supabase] Vehicle ID:", vehicleId)
    console.log("📝 [Supabase] Features:", features)

    // Remover características existentes
    console.log("🗑️ [Supabase] Removendo características antigas...")
    const { error: deleteError } = await supabase.from("vehicle_features").delete().eq("vehicle_id", vehicleId)

    if (deleteError) {
      console.error("❌ [Supabase] Erro ao deletar características:", deleteError)
      console.log("⚠️ [Supabase] Continuando mesmo com erro de delete...")
    } else {
      console.log("✅ [Supabase] Características antigas removidas")
    }

    // Inserir novas características se existirem
    const validFeatures = features.filter((feature) => feature && feature.trim() !== "")

    if (validFeatures.length === 0) {
      console.log("ℹ️ [Supabase] Nenhuma característica para inserir")
      return
    }

    const featureInserts = validFeatures.map((feature) => ({
      vehicle_id: vehicleId,
      feature: feature.trim(),
    }))

    console.log("➕ [Supabase] Inserindo características:", featureInserts.length)

    const { error: featuresError } = await supabase.from("vehicle_features").insert(featureInserts)

    if (featuresError) {
      console.error("❌ [Supabase] Erro ao inserir características:", featuresError)
      console.error("❌ [Supabase] Detalhes do erro:", JSON.stringify(featuresError, null, 2))
      console.log("⚠️ [Supabase] Continuando sem características...")
    } else {
      console.log("✅ [Supabase] Características inseridas com sucesso")
    }
  } catch (error) {
    console.error("❌ [Supabase] Erro geral ao atualizar características:", error)
    console.log("⚠️ [Supabase] Continuando sem atualizar características...")
  }
}

// Função para obter todos os veículos do Supabase
export async function getAllVehiclesFromSupabase(): Promise<VehicleWithDetails[]> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase não configurado")
  }

  try {
    // Buscar veículos
    const { data: vehicles, error: vehiclesError } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false })

    if (vehiclesError) throw vehiclesError

    // Buscar imagens para todos os veículos
    const { data: images, error: imagesError } = await supabase
      .from("vehicle_images")
      .select("*")
      .order("is_primary", { ascending: false })

    if (imagesError) throw imagesError

    // Buscar características para todos os veículos
    const { data: features, error: featuresError } = await supabase.from("vehicle_features").select("*")

    if (featuresError) throw featuresError

    // Buscar informações do vendedor
    const { data: sellerInfo, error: sellerError } = await supabase.from("seller_info").select("*").limit(1).single()

    if (sellerError) throw sellerError

    // Combinar dados
    const vehiclesWithDetails: VehicleWithDetails[] = vehicles.map((vehicle) => ({
      ...vehicle,
      images: images.filter((img) => img.vehicle_id === vehicle.id).map((img) => img.image_url),
      features: features.filter((feat) => feat.vehicle_id === vehicle.id).map((feat) => feat.feature),
      seller: {
        name: sellerInfo.name,
        avatar: sellerInfo.avatar,
        rating: sellerInfo.rating,
        phone: sellerInfo.phone,
        whatsapp: sellerInfo.whatsapp,
      },
    }))

    return vehiclesWithDetails
  } catch (error) {
    console.error("Error fetching vehicles from Supabase:", error)
    throw error
  }
}

// Função para obter um veículo por ID do Supabase
export async function getVehicleByIdFromSupabase(id: string): Promise<VehicleWithDetails | null> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase não configurado")
  }

  try {
    // Buscar veículo
    const { data: vehicle, error: vehicleError } = await supabase.from("vehicles").select("*").eq("id", id).single()

    if (vehicleError) throw vehicleError

    // Buscar imagens
    const { data: images, error: imagesError } = await supabase
      .from("vehicle_images")
      .select("*")
      .eq("vehicle_id", id)
      .order("is_primary", { ascending: false })

    if (imagesError) throw imagesError

    // Buscar características
    const { data: features, error: featuresError } = await supabase
      .from("vehicle_features")
      .select("*")
      .eq("vehicle_id", id)

    if (featuresError) throw featuresError

    // Buscar informações do vendedor
    const { data: sellerInfo, error: sellerError } = await supabase.from("seller_info").select("*").limit(1).single()

    if (sellerError) throw sellerError

    return {
      ...vehicle,
      images: images.map((img) => img.image_url),
      features: features.map((feat) => feat.feature),
      seller: {
        name: sellerInfo.name,
        avatar: sellerInfo.avatar,
        rating: sellerInfo.rating,
        phone: sellerInfo.phone,
        whatsapp: sellerInfo.whatsapp,
      },
    }
  } catch (error) {
    console.error("Error fetching vehicle from Supabase:", error)
    return null
  }
}

// Função para criar um novo veículo no Supabase
export async function createVehicleInSupabase(
  vehicleData: {
    name: string
    price: string
    originalPrice?: string
    year: string
    mileage: string
    fuel: string
    seats: string
    color: string
    transmission: string
    description: string
    tag: "NOVO" | "SEMINOVO" | "PREMIUM" | "OFERTA ESPECIAL"
    images: string[]
    features: string[]
  },
  userId: string,
): Promise<VehicleWithDetails> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase não configurado")
  }

  try {
    // Validar dados
    const validation = validateVehicleData(vehicleData)
    if (!validation.isValid) {
      throw new Error(`Dados inválidos: ${validation.errors.join(", ")}`)
    }

    // Preparar dados do veículo
    const vehicleInsertData: any = {
      name: String(vehicleData.name).trim(),
      price: String(vehicleData.price).trim(),
      original_price: sanitizeNumericField(vehicleData.originalPrice),
      year: String(vehicleData.year).trim(),
      mileage: String(vehicleData.mileage || "0 km").trim(),
      fuel: String(vehicleData.fuel).trim(),
      seats: String(vehicleData.seats || "5 lugares").trim(),
      color: String(vehicleData.color).trim(),
      transmission: String(vehicleData.transmission).trim(),
      description: String(vehicleData.description || "").trim(),
      tag: vehicleData.tag,
      location: "São Paulo, SP",
      created_by: userId,
    }

    console.log("🚀 [Supabase] Criando veículo com dados:", vehicleInsertData)

    // Criar veículo
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .insert(vehicleInsertData)
      .select()
      .single()

    if (vehicleError) throw vehicleError

    // Inserir imagens
    if (vehicleData.images.length > 0) {
      const imageInserts: VehicleImageInsert[] = vehicleData.images.map((imageUrl, index) => ({
        vehicle_id: vehicle.id,
        image_url: imageUrl,
        is_primary: index === 0,
      }))

      const { error: imagesError } = await supabase.from("vehicle_images").insert(imageInserts)

      if (imagesError) throw imagesError
    }

    // Inserir características
    if (vehicleData.features.length > 0) {
      const featureInserts: VehicleFeatureInsert[] = vehicleData.features.map((feature) => ({
        vehicle_id: vehicle.id,
        feature: feature,
      }))

      const { error: featuresError } = await supabase.from("vehicle_features").insert(featureInserts)

      if (featuresError) throw featuresError
    }

    // Buscar informações do vendedor
    const { data: sellerInfo, error: sellerError } = await supabase.from("seller_info").select("*").limit(1).single()

    if (sellerError) throw sellerError

    // Retornar veículo completo
    return {
      ...vehicle,
      images: vehicleData.images,
      features: vehicleData.features,
      seller: {
        name: sellerInfo.name,
        avatar: sellerInfo.avatar,
        rating: sellerInfo.rating,
        phone: sellerInfo.phone,
        whatsapp: sellerInfo.whatsapp,
      },
    }
  } catch (error) {
    console.error("Error creating vehicle in Supabase:", error)
    throw error
  }
}

// Função para atualizar um veículo no Supabase - ROBUSTA COM VALIDAÇÃO
export async function updateVehicle(
  vehicleId: string,
  vehicleData: Partial<{
    name: string
    price: string
    originalPrice?: string
    year: string
    mileage: string
    fuel: string
    seats: string
    color: string
    transmission: string
    description: string
    tag: "NOVO" | "SEMINOVO" | "PREMIUM" | "OFERTA ESPECIAL"
    features: string[]
    isActive: boolean
    doors?: string
    engine?: string
    fuelConsumption?: string
    warranty?: string
    condition?: string
  }>,
): Promise<VehicleWithDetails | null> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase não configurado")
  }

  console.log("🔄 [Supabase] === ATUALIZAÇÃO COM VALIDAÇÃO ===")
  console.log("🆔 [Supabase] Vehicle ID:", vehicleId)

  try {
    // ETAPA 1: Buscar o veículo atual
    console.log("🔍 [Supabase] Buscando veículo atual...")
    const { data: currentVehicle, error: fetchError } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", vehicleId)
      .single()

    if (fetchError || !currentVehicle) {
      console.error("❌ [Supabase] Veículo não encontrado:", fetchError)
      throw new Error(`Veículo com ID ${vehicleId} não encontrado`)
    }

    console.log("✅ [Supabase] Veículo atual encontrado:", currentVehicle.name)

    // ETAPA 2: Preparar dados para atualização com validação
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // Validar e sanitizar campos
    if (vehicleData.name !== undefined) {
      const name = String(vehicleData.name).trim()
      if (name === "") {
        throw new Error("Nome não pode estar vazio")
      }
      updateData.name = name
    }

    if (vehicleData.price !== undefined) {
      const price = String(vehicleData.price).trim()
      if (price === "") {
        throw new Error("Preço não pode estar vazio")
      }
      updateData.price = price
    }

    if (vehicleData.originalPrice !== undefined) {
      updateData.original_price = sanitizeNumericField(vehicleData.originalPrice)
    }

    if (vehicleData.year !== undefined) {
      const year = String(vehicleData.year).trim()
      if (year === "") {
        throw new Error("Ano não pode estar vazio")
      }
      updateData.year = year
    }

    if (vehicleData.mileage !== undefined) {
      updateData.mileage = String(vehicleData.mileage || "0 km").trim()
    }

    if (vehicleData.fuel !== undefined) {
      const fuel = String(vehicleData.fuel).trim()
      if (fuel === "") {
        throw new Error("Combustível não pode estar vazio")
      }
      updateData.fuel = fuel
    }

    if (vehicleData.seats !== undefined) {
      updateData.seats = String(vehicleData.seats || "5 lugares").trim()
    }

    if (vehicleData.color !== undefined) {
      const color = String(vehicleData.color).trim()
      if (color === "") {
        throw new Error("Cor não pode estar vazia")
      }
      updateData.color = color
    }

    if (vehicleData.transmission !== undefined) {
      const transmission = String(vehicleData.transmission).trim()
      if (transmission === "") {
        throw new Error("Transmissão não pode estar vazia")
      }
      updateData.transmission = transmission
    }

    if (vehicleData.description !== undefined) {
      updateData.description = String(vehicleData.description || "").trim()
    }

    if (vehicleData.tag !== undefined) {
      updateData.tag = vehicleData.tag
    }

    if (vehicleData.isActive !== undefined) {
      updateData.is_active = vehicleData.isActive
    }

    console.log("📝 [Supabase] Dados validados para atualização:", Object.keys(updateData))

    // ETAPA 3: Executar UPDATE
    console.log("🚀 [Supabase] Executando UPDATE...")
    const { error: updateError } = await supabase.from("vehicles").update(updateData).eq("id", vehicleId)

    if (updateError) {
      console.error("❌ [Supabase] Erro no UPDATE:", updateError)
      throw new Error(`Erro ao atualizar veículo: ${updateError.message}`)
    }

    console.log("✅ [Supabase] UPDATE executado com sucesso")

    // ETAPA 4: Atualizar características (sem falhar)
    if (vehicleData.features !== undefined) {
      console.log("🔄 [Supabase] Tentando atualizar características...")
      try {
        await updateVehicleFeatures(vehicleId, vehicleData.features)
      } catch (featuresError) {
        console.error("❌ [Supabase] Erro nas características:", featuresError)
        console.log("⚠️ [Supabase] Continuando sem características...")
      }
    }

    // ETAPA 5: Retornar dados combinados
    console.log("🔄 [Supabase] Preparando resposta combinada...")

    const combinedVehicle: VehicleWithDetails = {
      ...currentVehicle,
      ...updateData,
      // Garantir que campos obrigatórios existam
      name: updateData.name || currentVehicle.name || "Veículo",
      price: updateData.price || currentVehicle.price || "R$ 0",
      year: updateData.year || currentVehicle.year || "2023",
      fuel: updateData.fuel || currentVehicle.fuel || "Flex",
      color: updateData.color || currentVehicle.color || "Branco",
      transmission: updateData.transmission || currentVehicle.transmission || "Manual",
      description: updateData.description !== undefined ? updateData.description : currentVehicle.description || "",
      tag: updateData.tag || currentVehicle.tag || "DISPONÍVEL",
      mileage: updateData.mileage || currentVehicle.mileage || "0 km",
      seats: updateData.seats || currentVehicle.seats || "5 lugares",
      location: currentVehicle.location || "São Paulo, SP",
      is_active: updateData.is_active !== undefined ? updateData.is_active : currentVehicle.is_active !== false,
      created_at: currentVehicle.created_at,
      updated_at: updateData.updated_at,
      created_by: currentVehicle.created_by,
      original_price:
        updateData.original_price !== undefined ? updateData.original_price : currentVehicle.original_price,
      // Dados relacionados
      images: [],
      features: vehicleData.features || [],
      seller: {
        name: "AutoMax Concessionária",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.8,
        phone: "(11) 99999-9999",
        whatsapp: "5511999999999",
      },
    }

    console.log("✅ [Supabase] === ATUALIZAÇÃO COMPLETA ===")
    return combinedVehicle
  } catch (error) {
    console.error("❌ [Supabase] === ERRO CRÍTICO ===", error)
    throw error // Re-throw para que o erro seja tratado pelo chamador
  }
}

// Função para deletar um veículo do Supabase
export async function deleteVehicle(vehicleId: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase não configurado")
  }

  try {
    // Deletar características do veículo
    const { error: featuresError } = await supabase.from("vehicle_features").delete().eq("vehicle_id", vehicleId)

    if (featuresError) throw featuresError

    // Deletar imagens do veículo
    const { error: imagesError } = await supabase.from("vehicle_images").delete().eq("vehicle_id", vehicleId)

    if (imagesError) throw imagesError

    // Deletar favoritos relacionados
    const { error: favoritesError } = await supabase.from("favorites").delete().eq("vehicle_id", vehicleId)

    if (favoritesError) throw favoritesError

    // Deletar o veículo
    const { error: vehicleError } = await supabase.from("vehicles").delete().eq("id", vehicleId)

    if (vehicleError) throw vehicleError
  } catch (error) {
    console.error("Error deleting vehicle from Supabase:", error)
    throw error
  }
}

// Função para adicionar aos favoritos
export async function addToFavorites(userId: string, vehicleId: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase não configurado")
  }

  try {
    const { error } = await supabase.from("favorites").insert({
      user_id: userId,
      vehicle_id: vehicleId,
    })

    if (error) throw error
  } catch (error) {
    console.error("Error adding to favorites:", error)
    throw error
  }
}

// Função para remover dos favoritos
export async function removeFromFavorites(userId: string, vehicleId: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase não configurado")
  }

  try {
    const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("vehicle_id", vehicleId)

    if (error) throw error
  } catch (error) {
    console.error("Error removing from favorites:", error)
    throw error
  }
}

// Função para verificar se é favorito
export async function isFavorite(userId: string, vehicleId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("vehicle_id", vehicleId)
      .single()

    if (error) return false
    return !!data
  } catch (error) {
    return false
  }
}

// Função para obter favoritos do usuário
export async function getUserFavorites(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase não configurado")
  }

  try {
    const { data, error } = await supabase.from("favorites").select("vehicle_id").eq("user_id", userId)

    if (error) throw error

    return data.map((fav) => fav.vehicle_id)
  } catch (error) {
    console.error("Error fetching user favorites:", error)
    return []
  }
}

// Função para criar contato/lead
export async function createContact(contactData: {
  name: string
  email: string
  phone?: string
  message: string
  vehicleId?: string
}): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase não configurado")
  }

  try {
    const { error } = await supabase.from("contacts").insert({
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || null,
      message: contactData.message,
      vehicle_id: contactData.vehicleId || null,
    })

    if (error) throw error
  } catch (error) {
    console.error("Error creating contact:", error)
    throw error
  }
}

// Função para adicionar um novo veículo (compatibilidade com sistema antigo)
export async function addVehicle(
  vehicleData: {
    name: string
    price: string
    originalPrice?: string
    year: string
    mileage: string
    fuel: string
    seats: string
    color: string
    transmission: string
    description: string
    tag: string
    images: string[]
    features: string[]
  },
  userId: string,
): Promise<VehicleWithDetails | null> {
  try {
    return await createVehicleInSupabase(
      {
        ...vehicleData,
        tag: vehicleData.tag as "NOVO" | "SEMINOVO" | "PREMIUM" | "OFERTA ESPECIAL",
      },
      userId,
    )
  } catch (error) {
    console.error("Error adding vehicle:", error)
    return null
  }
}
