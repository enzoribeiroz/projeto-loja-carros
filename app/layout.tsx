import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-supabase"
import { Toaster } from "@/components/ui/toaster"
import ScrollToTop from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AutoMax - Concessionária de Veículos",
  description:
    "Encontre o carro dos seus sonhos na AutoMax. Veículos novos e seminovos com as melhores condições de financiamento.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <ScrollToTop />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
