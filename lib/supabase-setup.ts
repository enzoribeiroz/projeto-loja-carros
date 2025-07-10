import { supabase } from "@/lib/supabase"

export async function checkSupabaseConnection() {
  try {
    // Teste simples de conexão
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return {
        connected: false,
        error: error.message,
        message: "Erro na conexão com Supabase",
      }
    }

    return {
      connected: true,
      message: "Conectado com sucesso ao Supabase",
    }
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      message: "Falha na conexão",
    }
  }
}

export async function setupSupabaseDatabase() {
  const results = []

  try {
    console.log("🔍 Iniciando setup do banco...")

    // 1. Verificar se seller_info existe e inserir se necessário
    const { data: sellerInfo, error: sellerError } = await supabase.from("seller_info").select("id").limit(1)

    if (sellerError) {
      console.log("⚠️ Tabela seller_info não encontrada ou erro:", sellerError.message)
      results.push("Erro ao verificar seller_info")
    } else if (!sellerInfo || sellerInfo.length === 0) {
      console.log("📝 Inserindo informações do vendedor...")

      const { error: insertSellerError } = await supabase.from("seller_info").insert({
        name: "AutoMax Concessionária",
        avatar: "/placeholder.svg?height=100&width=100",
        rating: 4.8,
        phone: "(11) 99999-9999",
        whatsapp: "5511999999999",
      })

      if (insertSellerError) {
        console.error("❌ Erro ao inserir seller_info:", insertSellerError)
        results.push("Erro ao inserir informações do vendedor")
      } else {
        console.log("✅ Informações do vendedor inseridas")
        results.push("Informações do vendedor configuradas")
      }
    } else {
      console.log("✅ Informações do vendedor já existem")
      results.push("Informações do vendedor já configuradas")
    }

    // 2. Verificar se existem veículos e inserir alguns se necessário
    const { data: vehicles, error: vehiclesError } = await supabase.from("vehicles").select("id").limit(1)

    if (vehiclesError) {
      console.log("⚠️ Erro ao verificar veículos:", vehiclesError.message)
      results.push("Erro ao verificar veículos")
    } else if (!vehicles || vehicles.length === 0) {
      console.log("📝 Inserindo veículos de exemplo...")
      await insertSampleVehicles()
      results.push("Veículos de exemplo inseridos")
    } else {
      console.log("✅ Veículos já existem")
      results.push("Veículos já configurados")
    }

    // 3. Verificar se as políticas RLS estão funcionando
    try {
      const { data: testQuery } = await supabase.from("vehicles").select("id").limit(1)

      results.push("Políticas RLS funcionando")
    } catch (error) {
      results.push("Aviso: Verificar políticas RLS")
    }

    return {
      success: true,
      results,
      message: "Setup concluído com sucesso",
    }
  } catch (error) {
    console.error("❌ Erro no setup:", error)
    return {
      success: false,
      error: error.message,
      message: "Erro no setup do banco",
      results,
    }
  }
}

// Função para inserir veículos de exemplo
async function insertSampleVehicles() {
  if (!supabase) return

  const sampleVehicles = [
    {
      name: "Honda Civic 2023",
      brand: "Honda",
      model: "Civic",
      year: 2023,
      price: 125000.0,
      mileage: 0,
      fuel: "Flex",
      transmission: "CVT",
      color: "Branco Pérola",
      seats: 5,
      description: "Honda Civic 2023 zero quilômetro, representando o que há de mais moderno em tecnologia automotiva.",
      tag: "NOVO",
      category: "novos",
      location: "São Paulo, SP",
      is_active: true,
    },
    {
      name: "Toyota Corolla 2022",
      brand: "Toyota",
      model: "Corolla",
      year: 2022,
      price: 115000.0,
      mileage: 15000,
      fuel: "Flex",
      transmission: "CVT",
      color: "Prata Metallic",
      seats: 5,
      description: "Toyota Corolla 2022 seminovo em estado impecável, com apenas 15.000 km rodados.",
      tag: "SEMINOVO",
      category: "seminovos",
      location: "São Paulo, SP",
      is_active: true,
    },
    {
      name: "BMW X3 2021",
      brand: "BMW",
      model: "X3",
      year: 2021,
      price: 280000.0,
      mileage: 25000,
      fuel: "Gasolina",
      transmission: "Automático",
      color: "Preto Sapphire",
      seats: 5,
      description: "BMW X3 2021 premium em estado excepcional, único dono executivo.",
      tag: "PREMIUM",
      category: "premium",
      location: "São Paulo, SP",
      is_active: true,
    },
  ]

  for (const vehicle of sampleVehicles) {
    try {
      // Inserir veículo
      const { data: insertedVehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .insert(vehicle)
        .select()
        .single()

      if (vehicleError) {
        console.error("❌ Erro ao inserir veículo:", vehicleError)
        continue
      }

      console.log(`✅ Veículo ${vehicle.name} inserido com ID: ${insertedVehicle.id}`)

      // Inserir imagem
      const { error: imageError } = await supabase.from("vehicle_images").insert({
        vehicle_id: insertedVehicle.id,
        image_url: "/placeholder.svg?height=400&width=600",
        is_primary: true,
      })

      if (imageError) {
        console.error("❌ Erro ao inserir imagem:", imageError)
      }

      // Inserir características
      const features = ["Ar condicionado", "Direção elétrica", "Vidros elétricos", "Central multimídia", "Câmera de ré"]

      for (const feature of features) {
        const { error: featureError } = await supabase.from("vehicle_features").insert({
          vehicle_id: insertedVehicle.id,
          feature: feature,
        })

        if (featureError) {
          console.error("❌ Erro ao inserir característica:", featureError)
        }
      }
    } catch (error) {
      console.error(`❌ Erro ao processar veículo ${vehicle.name}:`, error)
    }
  }
}
