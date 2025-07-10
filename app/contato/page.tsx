import Header from "@/components/header"
import Footer from "@/components/footer"
import ContactHero from "@/components/contact-hero"
import ContactInfo from "@/components/contact-info"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ContactHero />
      <ContactInfo />
      <Footer />
    </div>
  )
}
