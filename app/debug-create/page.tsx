import DebugCreateVehicle from "@/components/debug-create-vehicle"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function DebugCreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DebugCreateVehicle />
      <Footer />
    </div>
  )
}
