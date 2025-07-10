"use client"

import { useState, useEffect, useCallback } from "react"
import { getAllVehiclesHybrid } from "@/lib/vehicles-hybrid"
import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import VehicleShowcase from "@/components/vehicle-showcase"
import AboutCTA from "@/components/about-cta"
import PartnerLogos from "@/components/partner-logos"
import ScrollToTop from "@/components/scroll-to-top"

export default function HomePage() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  // Função para carregar veículos
  const loadVehicles = useCallback(async () => {
    try {
      setLoading(true)
      console.log("🔄 [Home Page] === CARREGANDO VEÍCULOS ===")
      const allVehicles = await getAllVehiclesHybrid()
      console.log("✅ [Home Page] Veículos carregados:", allVehicles?.length || 0)

      // Verificar se allVehicles é um array válido
      if (!Array.isArray(allVehicles)) {
        console.warn("⚠️ [Home Page] allVehicles não é um array:", allVehicles)
        setVehicles([])
        return
      }

      // Filtrar apenas veículos ativos
      const activeVehicles = allVehicles.filter(
        (vehicle) => vehicle && vehicle.id && vehicle.isActive !== false && vehicle.is_active !== false,
      )
      console.log("✅ [Home Page] Veículos ativos:", activeVehicles.length)

      setVehicles(activeVehicles)
    } catch (error) {
      console.error("❌ [Home Page] Erro ao carregar veículos:", error)
      setVehicles([]) // Garantir que vehicles seja sempre um array
    } finally {
      setLoading(false)
    }
  }, [])

  // Carregar veículos na inicialização
  useEffect(() => {
    loadVehicles()
  }, [loadVehicles])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-white via-slate-100 via-slate-300 via-slate-600 to-slate-900">
      <Header />
      <HeroSection />
      <VehicleShowcase vehicles={vehicles} loading={loading} />
      <AboutCTA />
      <PartnerLogos />
      <ScrollToTop />
      <Footer />
    </div>
  )
}
