import { supabase } from "./supabase"

// Usar as credenciais hardcoded como no supabase.ts
// const supabaseUrl = "https://lgsvemxonnztfvpqytlg.supabase.co"
// const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc3ZlbXhvbm56dGZ2cHF5dGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODkyNTYsImV4cCI6MjA2NTc2NTI1Nn0.kJl3K1AHOemP8MHmHx4b9iDPBOdmXxubwiI9IYr4c5M"

// const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface VehicleData {
  id?: string
  name: string
  brand?: string
  model?: string
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
  category?: string
  images: string[]
  isActive?: boolean
  doors?: string
  engine?: string
  fuelConsumption?: string
  warranty?: string
  condition?: string
  seats?: string
}

// Event listeners para sincronização
const syncListeners: (() => void)[] = []

export function addSyncListener(callback: () => void) {
  syncListeners.push(callback)
}

export function removeSyncListener(callback: () => void) {
  const index = syncListeners.indexOf(callback)
  if (index > -1) {
    syncListeners.splice(index, 1)
  }
}

function notifySyncListeners() {
  syncListeners.forEach((callback) => {
    try {
      callback()
    } catch (error) {
      console.error("Erro em sync listener:", error)
    }
  })
}

// Função para verificar se o usuário pode criar veículos
export function canCreateVehiclesHybrid(email: string): boolean {
  console.log("🔍 Verificando permissões para email:", email)

  const authorizedEmails = ["caio@caio.com"]
  const normalizedEmail = email.toLowerCase().trim()
  const canCreate = authorizedEmails.includes(normalizedEmail)

  console.log("📧 Email normalizado:", normalizedEmail)
  console.log("📋 Emails autorizados:", authorizedEmails)
  console.log("✅ Pode criar veículos:", canCreate)

  return canCreate
}

// Função para obter todos os veículos - CORRIGIDA COM LOGS DETALHADOS
export async function getAllVehiclesHybrid(): Promise<any[]> {
  try {
    console.log("🔍 === INICIANDO BUSCA DE VEÍCULOS ===")

    // Primeiro, verificar se há veículos na tabela
    const { data: allVehicles, error: countError } = await supabase.from("vehicles").select("id, name, is_active")

    if (countError) {
      console.error("❌ Erro ao contar veículos:", countError)
      throw countError
    }

    console.log("📊 Total de veículos na tabela:", allVehicles?.length || 0)
    console.log("📊 Veículos encontrados:", allVehicles)

    if (!allVehicles || allVehicles.length === 0) {
      console.log("⚠️ Nenhum veículo encontrado na tabela")
      return []
    }

    // Verificar quantos estão ativos
    const activeCount = allVehicles.filter((v) => v.is_active === true).length
    console.log("📊 Veículos ativos:", activeCount)

    // Buscar veículos ativos com todos os dados
    const { data: vehicles, error } = await supabase
      .from("vehicles")
      .select("*")
      // .eq("is_active", true)
      .order("created_at", { ascending: false })

    // if (error) {
    //   console.error("❌ Erro ao buscar veículos ativos:", error)
    //   throw error
    // }

    console.log("✅ Veículos ativos e inativos encontrados:", vehicles?.length || 0)

    if (!vehicles || vehicles.length === 0) {
      console.log("⚠️ Nenhum veículo ativo encontrado")
      return []
    }

    // Processar cada veículo
    const vehiclesWithDetails = await Promise.all(
      vehicles.map(async (vehicle) => {
        console.log(`🔍 Processando veículo: ${vehicle.name}`)

        // Buscar imagens (opcional)
        let images = ["/placeholder.svg?height=400&width=600"]
        try {
          const { data: vehicleImages } = await supabase
            .from("vehicle_images")
            .select("image_url")
            .eq("vehicle_id", vehicle.id)
            .order("is_primary", { ascending: false })

          if (vehicleImages && vehicleImages.length > 0) {
            images = vehicleImages.map((img) => img.image_url)
          }
        } catch (imgError) {
          console.log(`⚠️ Erro ao buscar imagens para ${vehicle.name}:`, imgError)
        }

        // Buscar características (opcional)
        let features: string[] = []
        try {
          const { data: vehicleFeatures } = await supabase
            .from("vehicle_features")
            .select("feature")
            .eq("vehicle_id", vehicle.id)

          if (vehicleFeatures && vehicleFeatures.length > 0) {
            features = vehicleFeatures.map((feat) => feat.feature)
          }
        } catch (featError) {
          console.log(`⚠️ Erro ao buscar características para ${vehicle.name}:`, featError)
        }

        const processedVehicle = {
          ...vehicle,
          images,
          features,
          location: vehicle.location || "São Paulo, SP",
          seller: {
            name: "AutoMax Concessionária",
            avatar: "/placeholder.svg?height=40&width=40",
            rating: 4.8,
            phone: "(11) 99999-9999",
            whatsapp: "5511999999999",
          },
        }

        console.log(`✅ Veículo processado: ${vehicle.name}`)
        return processedVehicle
      }),
    )

    console.log("✅ === BUSCA CONCLUÍDA ===")
    console.log("📊 Total de veículos retornados:", vehiclesWithDetails.length)

    return vehiclesWithDetails
  } catch (error: any) {
    console.error("❌ === ERRO CRÍTICO NA BUSCA ===", error)
    console.error("❌ Detalhes do erro:", {
      message: error.message,
      code: error.code,
      details: error.details,
    })
    return []
  }
}

// Função para obter veículo por ID
export async function getVehicleByIdHybrid(vehicleId: string): Promise<any> {
  try {
    console.log("🔍 Buscando veículo por ID:", vehicleId)

    const { data: vehicle, error } = await supabase.from("vehicles").select("*").eq("id", vehicleId).single()

    if (error) {
      console.error("❌ Erro ao buscar veículo:", error)
      return null
    }

    // Buscar imagens
    const { data: images } = await supabase
      .from("vehicle_images")
      .select("image_url")
      .eq("vehicle_id", vehicleId)
      .order("is_primary", { ascending: false })

    // Buscar características
    const { data: features } = await supabase.from("vehicle_features").select("feature").eq("vehicle_id", vehicleId)

    console.log("✅ Veículo encontrado:", vehicle?.name)

    return {
      ...vehicle,
      images: images?.map((img) => img.image_url) || ["/placeholder.svg?height=400&width=600"],
      features: features?.map((feat) => feat.feature) || [],
      location: vehicle.location || "São Paulo, SP",
      seller: {
        name: "AutoMax Concessionária",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.8,
        phone: "(11) 99999-9999",
        whatsapp: "5511999999999",
      },
    }
  } catch (error) {
    console.error("❌ Erro ao carregar veículo:", error)
    return null
  }
}

// Função para criar veículo - CORRIGIDA
export async function createVehicleHybrid(vehicleData: VehicleData, userId: string): Promise<any> {
  try {
    console.log("🔍 === CRIANDO VEÍCULO ===")
    console.log("📝 Dados recebidos:", vehicleData)
    console.log("👤 User ID:", userId)

    // Preparar dados básicos do veículo
    const supabaseData = {
      name: vehicleData.name.trim(),
      model: vehicleData.model?.trim(),
      brand: vehicleData.brand?.trim(),
      price: parseInt(vehicleData.price.replace(/\D/g, ""), 10) || 0,
      original_price: parseInt(vehicleData.price.replace(/\D/g, ""), 10) || 0,
      year: vehicleData.year.trim(),
      mileage: parseInt(vehicleData.mileage.replace(/\D/g, ""), 10) || 0,
      fuel: vehicleData.fuel.trim(),
      seats: parseInt(vehicleData.mileage.replace(/\D/g, ""), 10) || 5,
      color: vehicleData.color.trim(),
      transmission: vehicleData.transmission.trim(),
      description: vehicleData.description.trim(),
      tag: vehicleData.tag,
      location: "São Paulo, SP",
      is_active: true,
      created_by: userId,
    }

    console.log("📝 Dados para inserção:", supabaseData)

    // 1. Criar o veículo
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .insert([supabaseData])
      .select()
      .single()

    if (vehicleError) {
      console.error("❌ Erro ao criar veículo:", vehicleError)
      throw vehicleError
    }

    console.log("✅ Veículo criado:", vehicle.id, vehicle.name)

    // 2. Inserir imagens se existirem
    if (vehicleData.images && vehicleData.images.length > 0) {
      console.log("📸 Inserindo imagens:", vehicleData.images.length)

      const imageInserts = vehicleData.images.map((imageUrl, index) => ({
        vehicle_id: vehicle.id,
        image_url: imageUrl,
        is_primary: index === 0,
      }))

      const { error: imagesError } = await supabase.from("vehicle_images").insert(imageInserts)

      if (imagesError) {
        console.error("❌ Erro ao inserir imagens:", imagesError)
        // Não falhar por causa das imagens
      } else {
        console.log("✅ Imagens inseridas")
      }
    }

    // 3. Inserir características se existirem
    if (vehicleData.features && vehicleData.features.length > 0) {
      console.log("🔧 Inserindo características:", vehicleData.features.length)

      const featureInserts = vehicleData.features.map((feature) => ({
        vehicle_id: vehicle.id,
        feature: feature.trim(),
      }))

      const { error: featuresError } = await supabase.from("vehicle_features").insert(featureInserts)

      if (featuresError) {
        console.error("❌ Erro ao inserir características:", featuresError)
        // Não falhar por causa das características
      } else {
        console.log("✅ Características inseridas")
      }
    }

    // 4. Retornar veículo completo
    const completeVehicle = {
      ...vehicle,
      images: vehicleData.images || ["/placeholder.svg?height=400&width=600"],
      features: vehicleData.features || [],
      location: vehicle.location || "São Paulo, SP",
      seller: {
        name: "AutoMax Concessionária",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.8,
        phone: "(11) 99999-9999",
        whatsapp: "5511999999999",
      },
    }

    console.log("✅ === VEÍCULO CRIADO COM SUCESSO ===")
    notifySyncListeners()
    return completeVehicle
  } catch (error) {
    console.error("❌ === ERRO AO CRIAR VEÍCULO ===", error)
    throw error
  }
}

// Atualiza imagens do veículo
async function updateVehicleImages(vehicleId: string, images: string[]) {
  // 1. Remover imagens existentes
  const { error: deleteError } = await supabase
    .from("vehicle_images")
    .delete()
    .eq("vehicle_id", vehicleId)

  if (deleteError) {
    console.error("❌ Erro ao deletar imagens anteriores:", deleteError)
    return
  }

  console.log("🗑️ Imagens antigas removidas")

  // 2. Inserir novas imagens
  if (images && images.length > 0) {
    console.log("📸 Inserindo novas imagens:", images.length)

    const imageInserts = images.map((imageUrl, index) => ({
      vehicle_id: vehicleId,
      image_url: imageUrl,
      is_primary: index === 0,
    }))

    const { error: insertError } = await supabase
      .from("vehicle_images")
      .insert(imageInserts)

    if (insertError) {
      console.error("❌ Erro ao inserir novas imagens:", insertError)
    } else {
      console.log("✅ Novas imagens inseridas com sucesso")
    }
  } else {
    console.log("⚠️ Nenhuma imagem fornecida para inserção")
  }
}

// Função para atualizar veículo
export async function updateVehicleHybrid(vehicleId: string, vehicleData: Partial<VehicleData>): Promise<any> {
  try {
    console.log("🔍 Atualizando veículo:", vehicleId)
    console.log("📝 Dados recebidos:", vehicleData)

    // Separar features dos outros dados
    const { features, ...updateData } = vehicleData

    // Mapear campos camelCase para snake_case
    if (updateData.isActive !== undefined) {
      (updateData as any).is_active = updateData.isActive
      delete updateData.isActive
    }

    if (updateData.originalPrice !== undefined) {
      (updateData as any).original_price = updateData.originalPrice
      delete updateData.originalPrice
    }

    // // Mapear outros campos que podem estar em camelCase
    // if (updateData.condition !== undefined) {
    //   (updateData as any).condition = updateData.condition
    //   delete updateData.condition
    // }

    // Converter campos numéricos
    if (updateData.seats !== undefined) {
      if (typeof updateData.seats === 'string') {
        // Extrair apenas os números da string "5 lugares"
        (updateData as any).seats = parseInt(updateData.seats.replace(/\D/g, '')) || 5
      } else {
        (updateData as any).seats = updateData.seats
      }
      delete updateData.seats
    }

    if (updateData.fuelConsumption !== undefined) {
      const raw = updateData.fuelConsumption
      const fuelConsumptionValue =
        typeof raw === 'string'
          ? parseInt(raw.replace(/\D/g, ''), 10) || 4
          : typeof raw === 'number'
            ? raw
            : 4 // fallback para tipo inválido
    
      updateData.fuelConsumption = fuelConsumptionValue.toString();
    }

    if (updateData.doors !== undefined) {
      const raw = updateData.doors
      const doorsValue =
        typeof raw === 'string'
          ? parseInt(raw.replace(/\D/g, ''), 10) || 4
          : typeof raw === 'number'
            ? raw
            : 4 // fallback para tipo inválido
    
      updateData.doors = doorsValue.toString();
    }

    if (updateData.year !== undefined) {
      console.log("🔍 [updateVehicleHybrid] Processando ano:", updateData.year, "tipo:", typeof updateData.year)
    
      let yearValue: number
    
      if (typeof updateData.year === 'string') {
        const parsed = parseInt(updateData.year, 10)
        yearValue = isNaN(parsed) ? 2023 : parsed
        console.log("🔍 [updateVehicleHybrid] Ano convertido:", yearValue)
      } else {
        yearValue = updateData.year
        console.log("🔍 [updateVehicleHybrid] Ano já é número:", yearValue)
      }
    
      updateData.year = yearValue.toString();
    }

    if (updateData.mileage !== undefined) {
      const raw = updateData.mileage
      const mileageValue =
        typeof raw === 'string'
          ? parseInt(raw.replace(/\D/g, ''), 10) || 0
          : typeof raw === 'number'
            ? raw
            : 0 // fallback
    
      updateData.mileage = mileageValue.toString()
    }

    if (updateData.images !== undefined) {
      updateVehicleImages(vehicleId, updateData.images)
      delete updateData.images
    }

    // Remover campos vazios
    Object.keys(updateData).forEach((key) => {
      if ((updateData as any)[key] === "" || (updateData as any)[key] === null) {
        delete (updateData as any)[key]
      }
    })

    console.log("📝 Dados para atualização na tabela vehicles:", updateData)

    // Atualizar dados básicos do veículo
    console.log("🚀 [updateVehicleHybrid] Enviando dados para atualização:", JSON.stringify(updateData, null, 2));
    console.log("🔑 [updateVehicleHybrid] ID do veículo:", vehicleId);
    
    const { data: vehicle, error } = await supabase
      .from("vehicles")
      .update(updateData)
      .eq("id", vehicleId)
      .select()
      .single()

    console.log("🚀 [updateVehicleHybrid] Depois do update", { vehicle, error });

    if (error) {
      console.error("❌ Erro ao atualizar veículo:", error)
      console.error("❌ Detalhes do erro:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      throw error
    }

    console.log("✅ Veículo atualizado:", vehicle.name)

    // Atualizar características se fornecidas
    if (features !== undefined) {
      console.log("🔄 Atualizando características...")
      
      try {
        // Remover características existentes
        const { error: deleteError } = await supabase
          .from("vehicle_features")
          .delete()
          .eq("vehicle_id", vehicleId)

        if (deleteError) {
          console.error("❌ Erro ao deletar características antigas:", deleteError)
        } else {
          console.log("✅ Características antigas removidas")
        }

        // Inserir novas características se existirem
        if (features && features.length > 0) {
          const validFeatures = features.filter((feature) => feature && feature.trim() !== "")
          
          if (validFeatures.length > 0) {
            const featureInserts = validFeatures.map((feature) => ({
              vehicle_id: vehicleId,
              feature: feature.trim(),
            }))

            const { error: featuresError } = await supabase
              .from("vehicle_features")
              .insert(featureInserts)

            if (featuresError) {
              console.error("❌ Erro ao inserir características:", featuresError)
            } else {
              console.log("✅ Características atualizadas:", validFeatures.length)
            }
          }
        }
      } catch (featuresError) {
        console.error("❌ Erro ao atualizar características:", featuresError)
        // Não falhar a atualização por causa das características
      }
    }

    // Buscar características atualizadas para retornar
    let updatedFeatures: string[] = []
    try {
      const { data: featuresData } = await supabase
        .from("vehicle_features")
        .select("feature")
        .eq("vehicle_id", vehicleId)

      if (featuresData) {
        updatedFeatures = featuresData.map((feat) => feat.feature)
      }
    } catch (error: any) {
      console.error("❌ Erro ao buscar características:", error)
    }

    // Buscar imagens para retornar
    let images: string[] = ["/placeholder.svg?height=400&width=600"]
    try {
      const { data: imagesData } = await supabase
        .from("vehicle_images")
        .select("image_url")
        .eq("vehicle_id", vehicleId)
        .order("is_primary", { ascending: false })

      if (imagesData && imagesData.length > 0) {
        images = imagesData.map((img) => img.image_url)
      }
    } catch (error: any) {
      console.error("❌ Erro ao buscar imagens:", error)
    }

    const completeVehicle = {
      ...vehicle,
      images,
      features: updatedFeatures,
      location: vehicle.location || "São Paulo, SP",
      seller: {
        name: "AutoMax Concessionária",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.8,
        phone: "(11) 99999-9999",
        whatsapp: "5511999999999",
      },
    }

    console.log("✅ Veículo atualizado com sucesso:", completeVehicle.name)
    notifySyncListeners()
    return completeVehicle
  } catch (error) {
    console.error("❌ Erro ao atualizar veículo:", error)
    throw error
  }
}

// Função para deletar veículo
export async function deleteVehicleHybrid(vehicleId: string): Promise<void> {
  try {
    console.log("🔍 Deletando veículo:", vehicleId)

    // Deletar imagens
    await supabase.from("vehicle_images").delete().eq("vehicle_id", vehicleId)

    // Deletar características
    await supabase.from("vehicle_features").delete().eq("vehicle_id", vehicleId)

    // Deletar favoritos
    await supabase.from("favorites").delete().eq("vehicle_id", vehicleId)

    // Deletar veículo
    const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId)

    if (error) {
      console.error("❌ Erro ao deletar veículo:", error)
      throw error
    }

    console.log("✅ Veículo deletado")
    notifySyncListeners()
  } catch (error) {
    console.error("❌ Erro ao deletar veículo:", error)
    throw error
  }
}

// Função para alternar status do veículo
export async function toggleVehicleStatusHybrid(vehicleId: string, newStatus: boolean): Promise<void> {
  await updateVehicleHybrid(vehicleId, { isActive: newStatus })
}

// Funções de favoritos
export async function addToFavoritesHybrid(userId: string, vehicleId: string): Promise<void> {
  try {
    const { error } = await supabase.from("favorites").insert([{ user_id: userId, vehicle_id: vehicleId }])

    if (error) throw error
  } catch (error) {
    console.error("❌ Erro ao adicionar favorito:", error)
    throw error
  }
}

export async function removeFromFavoritesHybrid(userId: string, vehicleId: string): Promise<void> {
  try {
    const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("vehicle_id", vehicleId)

    if (error) throw error
  } catch (error) {
    console.error("❌ Erro ao remover favorito:", error)
    throw error
  }
}

export async function isFavoriteHybrid(userId: string, vehicleId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("vehicle_id", vehicleId)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return !!data
  } catch (error) {
    console.error("❌ Erro ao verificar favorito:", error)
    return false
  }
}

export async function getUserFavoritesHybrid(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("favorites").select("vehicle_id").eq("user_id", userId)

    if (error) throw error
    return data?.map((fav) => fav.vehicle_id) || []
  } catch (error) {
    console.error("❌ Erro ao buscar favoritos:", error)
    return []
  }
}

// Função para criar contato
export async function createContactHybrid(contactData: {
  name: string
  email: string
  phone?: string
  message: string
  vehicleId?: string
}): Promise<void> {
  try {
    const { error } = await supabase.from("contacts").insert([
      {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        message: contactData.message,
        vehicle_id: contactData.vehicleId,
      },
    ])

    if (error) throw error
  } catch (error) {
    console.error("❌ Erro ao criar contato:", error)
    throw error
  }
}
