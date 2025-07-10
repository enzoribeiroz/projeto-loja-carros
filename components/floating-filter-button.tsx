"use client"

import { useState, useEffect } from "react"
import { Filter, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { FilterState } from "./vehicles-filter"

interface FloatingFilterButtonProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export default function FloatingFilterButton({ filters, onFiltersChange }: FloatingFilterButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Mostra o botão quando rolar mais de 400px (após a seção de filtros)
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value,
    }
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: "",
      selectedBrand: "",
      selectedYear: "",
      selectedPrice: "",
    })
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== "").length
  }

  const activeFiltersCount = getActiveFiltersCount()

  if (!isVisible) return null

  return (
    <>
      {/* Botão Flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative"
          size="icon"
        >
          <Filter className="h-6 w-6" />
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Modal de Filtros */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Filtros</h2>
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {activeFiltersCount} ativo{activeFiltersCount > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Busca */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Buscar Veículo</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Digite o modelo, marca..."
                      className="pl-10"
                      value={filters.searchQuery}
                      onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                    />
                  </div>
                </div>

                {/* Marca */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Marca</label>
                  <Select
                    value={filters.selectedBrand}
                    onValueChange={(value) => handleFilterChange("selectedBrand", value === "none" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a marca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <span className="text-muted-foreground italic">Sem filtro</span>
                      </SelectItem>
                      <SelectItem value="honda">Honda</SelectItem>
                      <SelectItem value="toyota">Toyota</SelectItem>
                      <SelectItem value="volkswagen">Volkswagen</SelectItem>
                      <SelectItem value="hyundai">Hyundai</SelectItem>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="audi">Audi</SelectItem>
                      <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                      <SelectItem value="nissan">Nissan</SelectItem>
                      <SelectItem value="ford">Ford</SelectItem>
                      <SelectItem value="chevrolet">Chevrolet</SelectItem>
                      <SelectItem value="jeep">Jeep</SelectItem>
                      <SelectItem value="fiat">Fiat</SelectItem>
                      <SelectItem value="renault">Renault</SelectItem>
                      <SelectItem value="peugeot">Peugeot</SelectItem>
                      <SelectItem value="citroen">Citroën</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ano */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Ano</label>
                  <Select
                    value={filters.selectedYear}
                    onValueChange={(value) => handleFilterChange("selectedYear", value === "none" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <span className="text-muted-foreground italic">Sem filtro</span>
                      </SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="2019">2019</SelectItem>
                      <SelectItem value="2018">2018</SelectItem>
                      <SelectItem value="2017">2017</SelectItem>
                      <SelectItem value="2016">2016</SelectItem>
                      <SelectItem value="2015">2015</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Preço */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Faixa de Preço</label>
                  <Select
                    value={filters.selectedPrice}
                    onValueChange={(value) => handleFilterChange("selectedPrice", value === "none" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a faixa de preço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <span className="text-muted-foreground italic">Sem filtro</span>
                      </SelectItem>
                      <SelectItem value="0-30000">Até R$ 30.000</SelectItem>
                      <SelectItem value="30000-50000">R$ 30.000 - R$ 50.000</SelectItem>
                      <SelectItem value="50000-80000">R$ 50.000 - R$ 80.000</SelectItem>
                      <SelectItem value="80000-120000">R$ 80.000 - R$ 120.000</SelectItem>
                      <SelectItem value="120000-200000">R$ 120.000 - R$ 200.000</SelectItem>
                      <SelectItem value="200000-300000">R$ 200.000 - R$ 300.000</SelectItem>
                      <SelectItem value="300000+">Acima de R$ 300.000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Combustível */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Combustível</label>
                  <Select
                    value={filters.selectedFuel || ""}
                    onValueChange={(value) =>
                      handleFilterChange("selectedFuel" as keyof FilterState, value === "none" ? "" : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o combustível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <span className="text-muted-foreground italic">Sem filtro</span>
                      </SelectItem>
                      <SelectItem value="flex">Flex (Etanol/Gasolina)</SelectItem>
                      <SelectItem value="gasolina">Gasolina</SelectItem>
                      <SelectItem value="etanol">Etanol</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                      <SelectItem value="eletrico">Elétrico</SelectItem>
                      <SelectItem value="gnv">GNV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Câmbio */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Câmbio</label>
                  <Select
                    value={filters.selectedTransmission || ""}
                    onValueChange={(value) =>
                      handleFilterChange("selectedTransmission" as keyof FilterState, value === "none" ? "" : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o câmbio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <span className="text-muted-foreground italic">Sem filtro</span>
                      </SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatico">Automático</SelectItem>
                      <SelectItem value="cvt">CVT</SelectItem>
                      <SelectItem value="automatizado">Automatizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Cor */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Cor</label>
                  <Select
                    value={filters.selectedColor || ""}
                    onValueChange={(value) =>
                      handleFilterChange("selectedColor" as keyof FilterState, value === "none" ? "" : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <span className="text-muted-foreground italic">Sem filtro</span>
                      </SelectItem>
                      <SelectItem value="branco">Branco</SelectItem>
                      <SelectItem value="preto">Preto</SelectItem>
                      <SelectItem value="prata">Prata</SelectItem>
                      <SelectItem value="cinza">Cinza</SelectItem>
                      <SelectItem value="vermelho">Vermelho</SelectItem>
                      <SelectItem value="azul">Azul</SelectItem>
                      <SelectItem value="verde">Verde</SelectItem>
                      <SelectItem value="amarelo">Amarelo</SelectItem>
                      <SelectItem value="laranja">Laranja</SelectItem>
                      <SelectItem value="marrom">Marrom</SelectItem>
                      <SelectItem value="bege">Bege</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={clearFilters} className="flex-1" disabled={activeFiltersCount === 0}>
                  Limpar Todos os Filtros
                </Button>
                <Button onClick={() => setIsOpen(false)} className="flex-1">
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
