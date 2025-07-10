"use client"

import { useAuth } from "@/lib/auth-supabase"
import { canCreateVehicles } from "@/lib/vehicles-supabase"
import { Button } from "@/components/ui/button"
import { Settings, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminButton() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user || !canCreateVehicles(user.email)) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Admin</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push("/admin/criar-veiculo")}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Veículo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
