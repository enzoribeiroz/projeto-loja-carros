"use client"

import { useEffect } from "react"
import AboutHero from "@/components/about-hero"
import CompanyInfo from "@/components/company-info"
import PartnerLogos from "@/components/partner-logos"
import ReviewsCarousel from "@/components/reviews-carousel"
import AboutCTA from "@/components/about-cta"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AboutPage() {
  useEffect(() => {
    // Sempre começar no topo da página
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutHero />
      <CompanyInfo />
      <PartnerLogos />
      <ReviewsCarousel />
      <AboutCTA />
      <Footer />
    </div>
  )
}
