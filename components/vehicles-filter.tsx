"use client"

import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface VehiclesFilterProps {
  onFiltersChange?: (filters: FilterState) => void
  initialFilters?: FilterState
}

export interface FilterState {
  searchQuery: string
  selectedBrand: string
  selectedYear: string
  selectedPrice: string
  selectedFuel?: string
  selectedTransmission?: string
  selectedColor?: string
}

export default function VehiclesFilter({ onFiltersChange, initialFilters }: VehiclesFilterProps) {
  const [searchQuery, setSearchQuery] = useState(initialFilters?.searchQuery || "")
  const [selectedBrand, setSelectedBrand] = useState(initialFilters?.selectedBrand || "")
  const [selectedYear, setSelectedYear] = useState(initialFilters?.selectedYear || "")
  const [selectedPrice, setSelectedPrice] = useState(initialFilters?.selectedPrice || "")

  // Atualizar estado quando initialFilters mudar
  useEffect(() => {
    if (initialFilters) {
      setSearchQuery(initialFilters.searchQuery || "")
      setSelectedBrand(initialFilters.selectedBrand || "")
      setSelectedYear(initialFilters.selectedYear || "")
      setSelectedPrice(initialFilters.selectedPrice || "")
    }
  }, [initialFilters])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = {
      searchQuery: key === "searchQuery" ? value : searchQuery,
      selectedBrand: key === "selectedBrand" ? value : selectedBrand,
      selectedYear: key === "selectedYear" ? value : selectedYear,
      selectedPrice: key === "selectedPrice" ? value : selectedPrice,
    }

    if (key === "searchQuery") setSearchQuery(value)
    if (key === "selectedBrand") setSelectedBrand(value)
    if (key === "selectedYear") setSelectedYear(value)
    if (key === "selectedPrice") setSelectedPrice(value)

    onFiltersChange?.(newFilters)
  }

  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Filtrar Veículos</h2>
              {searchQuery && (
                <div className="ml-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Buscando por: "{searchQuery}"
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar veículo..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                />
              </div>

              {/* Marca */}
              <Select
                value={selectedBrand}
                onValueChange={(value) => handleFilterChange("selectedBrand", value === "none" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-muted-foreground italic">Nenhuma</span>
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

              {/* Ano */}
              <Select
                value={selectedYear}
                onValueChange={(value) => handleFilterChange("selectedYear", value === "none" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-muted-foreground italic">Nenhum</span>
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

              {/* Preço */}
              <Select
                value={selectedPrice}
                onValueChange={(value) => handleFilterChange("selectedPrice", value === "none" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Faixa de Preço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-muted-foreground italic">Nenhuma</span>
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

              {/* Resumo dos Filtros Ativos */}
              {(searchQuery || selectedBrand || selectedYear || selectedPrice) && (
                <div className="flex items-center justify-between col-span-full">
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        <span>Busca: "{searchQuery}"</span>
                        <button
                          onClick={() => handleFilterChange("searchQuery", "")}
                          className="ml-2 hover:bg-primary/20 rounded-full p-1"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {selectedBrand && (
                      <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        <span>Marca: {selectedBrand}</span>
                        <button
                          onClick={() => handleFilterChange("selectedBrand", "")}
                          className="ml-2 hover:bg-primary/20 rounded-full p-1"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {selectedYear && (
                      <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        <span>Ano: {selectedYear}</span>
                        <button
                          onClick={() => handleFilterChange("selectedYear", "")}
                          className="ml-2 hover:bg-primary/20 rounded-full p-1"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {selectedPrice && (
                      <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        <span>
                          Preço:{" "}
                          {selectedPrice === "0-30000"
                            ? "Até R$ 30.000"
                            : selectedPrice === "30000-50000"
                              ? "R$ 30.000 - R$ 50.000"
                              : selectedPrice === "50000-80000"
                                ? "R$ 50.000 - R$ 80.000"
                                : selectedPrice === "80000-120000"
                                  ? "R$ 80.000 - R$ 120.000"
                                  : selectedPrice === "120000-200000"
                                    ? "R$ 120.000 - R$ 200.000"
                                    : selectedPrice === "200000-300000"
                                      ? "R$ 200.000 - R$ 300.000"
                                      : "Acima de R$ 300.000"}
                        </span>
                        <button
                          onClick={() => handleFilterChange("selectedPrice", "")}
                          className="ml-2 hover:bg-primary/20 rounded-full p-1"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedBrand("")
                      setSelectedYear("")
                      setSelectedPrice("")
                      onFiltersChange?.({
                        searchQuery: "",
                        selectedBrand: "",
                        selectedYear: "",
                        selectedPrice: "",
                      })
                    }}
                  >
                    Limpar Todos
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
