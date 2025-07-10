"use client"

import type React from "react"

import { Search, Menu, User, Settings, LogOut, Car, Home, X, ChevronDown, LogIn } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-supabase"
import { canCreateVehiclesHybrid } from "@/lib/vehicles-hybrid"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/veiculos?busca=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/veiculos")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e as any)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const navigateToPage = (url: string) => {
    setIsAccountMenuOpen(false)
    router.push(url)
  }

  const handleLogout = () => {
    logout()
    setIsAccountMenuOpen(false)
    router.push("/")
  }

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Verificar se o usuário pode criar veículos
  const canCreate = mounted && user && canCreateVehiclesHybrid(user.email)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo e Página Inicial */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">AutoMax</span>
          </Link>

          <Link
            href="/"
            className="text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center space-x-2 bg-primary/15 px-4 py-2 rounded-full border border-primary/30 hover:bg-primary/25 shadow-sm"
          >
            <Home className="h-4 w-4" />
            <span>Página Inicial</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/sobre-nos"
            className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10"
          >
            Sobre Nós
          </Link>

          <Link
            href="/veiculos"
            className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10"
          >
            Veículos
          </Link>

          <Link
            href="/contato"
            className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10"
          >
            Contato
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Pesquisar veículos..."
                className="w-64 pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {/* Botão Admin - Visível apenas para usuários autorizados */}
          {canCreate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/painel")}
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Painel Admin</span>
            </Button>
          )}

          {/* Sua Conta - Menu Customizado */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            >
              <User className="h-4 w-4" />
              <span>{user ? "Sua Conta" : "Entrar"}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isAccountMenuOpen ? "rotate-180" : ""}`} />
            </Button>

            {/* Menu Dropdown */}
            {isAccountMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-[9999]">
                <div className="py-1">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                        {user.name || user.email}
                      </div>

                      <button
                        onClick={() => navigateToPage("/perfil")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </button>

                      <button
                        onClick={() => navigateToPage("/configuracoes")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configurações</span>
                      </button>

                      {/* Opção Admin no menu mobile/dropdown */}
                      {canCreate && (
                        <>
                          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                          <button
                            onClick={() => navigateToPage("/admin/painel")}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Painel Admin</span>
                          </button>
                        </>
                      )}

                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                        Acesse sua conta
                      </div>

                      <button
                        onClick={() => navigateToPage("/login")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Login</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col space-y-4 mt-6">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Pesquisar veículos..."
                    className="pl-10 pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>

              <Link
                href="/"
                className="text-lg font-bold text-primary hover:text-primary/80 transition-colors py-3 flex items-center space-x-3 bg-primary/15 px-4 rounded-lg border border-primary/30"
              >
                <Home className="h-5 w-5" />
                <span>Página Inicial</span>
              </Link>

              <Link
                href="/sobre-nos"
                className="text-lg font-semibold text-slate-700 hover:text-primary transition-colors py-3 px-2 rounded-lg hover:bg-primary/10"
              >
                Sobre Nós
              </Link>

              <Link
                href="/veiculos"
                className="text-lg font-semibold text-slate-700 hover:text-primary transition-colors py-3 px-2 rounded-lg hover:bg-primary/10"
              >
                Veículos
              </Link>

              <Link
                href="/contato"
                className="text-lg font-semibold text-slate-700 hover:text-primary transition-colors py-3 px-2 rounded-lg hover:bg-primary/10"
              >
                Contato
              </Link>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">{user ? "Sua Conta" : "Acesse sua conta"}</h3>
                <div className="space-y-2">
                  {user ? (
                    <>
                      <button
                        onClick={() => navigateToPage("/perfil")}
                        className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors py-2 w-full text-left"
                      >
                        <User className="h-4 w-4" />
                        <span>Perfil</span>
                      </button>
                      <button
                        onClick={() => navigateToPage("/configuracoes")}
                        className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors py-2 w-full text-left"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Configurações</span>
                      </button>

                      {/* Botão Admin no menu mobile */}
                      {canCreate && (
                        <button
                          onClick={() => navigateToPage("/admin/painel")}
                          className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors py-2 w-full text-left"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Painel Admin</span>
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors py-2 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => navigateToPage("/login")}
                      className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors py-2 w-full text-left"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
