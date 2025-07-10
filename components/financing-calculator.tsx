"use client"

import { useState, useEffect } from "react"
import { Calculator, DollarSign, Calendar, Percent, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface FinancingResult {
  monthlyPayment: number
  totalAmount: number
  totalInterest: number
  downPaymentAmount: number
}

interface FinancingCalculatorProps {
  selectedVehiclePrice?: string
}

export default function FinancingCalculator({ selectedVehiclePrice }: FinancingCalculatorProps) {
  const [vehiclePrice, setVehiclePrice] = useState("")
  const [downPayment, setDownPayment] = useState("20")
  const [loanTerm, setLoanTerm] = useState("60")
  const [interestRate, setInterestRate] = useState("1.2")
  const [result, setResult] = useState<FinancingResult | null>(null)

  const handlePriceChange = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/[^\d]/g, "")

    // Formata como moeda
    if (numbers) {
      const numericValue = Number.parseInt(numbers)
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericValue)
      setVehiclePrice(formatted)
    } else {
      setVehiclePrice("")
    }
  }

  // Atualizar o preço quando um veículo for selecionado
  useEffect(() => {
    if (selectedVehiclePrice) {
      // Formatar o preço recebido
      const numericPrice = Number.parseFloat(String(selectedVehiclePrice).replace(/[^\d]/g, ""))
      if (numericPrice > 0) {
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(numericPrice)
        setVehiclePrice(formatted)
        // Limpar resultado anterior para forçar novo cálculo
        setResult(null)
      }
    }
  }, [selectedVehiclePrice])

  const calculateFinancing = () => {
    const price = Number.parseFloat(vehiclePrice.replace(/[^\d]/g, ""))
    const downPercent = Number.parseFloat(downPayment) / 100
    const termMonths = Number.parseInt(loanTerm)
    const monthlyRate = Number.parseFloat(interestRate) / 100

    if (!price || price <= 0) return

    const downPaymentAmount = price * downPercent
    const loanAmount = price - downPaymentAmount

    // Cálculo usando fórmula de juros compostos
    const monthlyPayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) / (Math.pow(1 + monthlyRate, termMonths) - 1)
    const totalAmount = monthlyPayment * termMonths + downPaymentAmount
    const totalInterest = totalAmount - price

    setResult({
      monthlyPayment,
      totalAmount,
      totalInterest,
      downPaymentAmount,
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Calculadora de Financiamento</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Preencha os dados abaixo e descubra as condições do seu financiamento
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário de Cálculo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <span>Dados do Financiamento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Valor do Veículo */}
                <div className="space-y-2">
                  <Label htmlFor="vehicle-price" className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>Valor do Veículo</span>
                  </Label>
                  <Input
                    id="vehicle-price"
                    placeholder="R$ 0"
                    value={vehiclePrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className={selectedVehiclePrice ? "border-blue-500 bg-blue-50" : ""}
                  />
                  {selectedVehiclePrice && (
                    <p className="text-sm text-blue-600 font-medium">✓ Veículo selecionado automaticamente</p>
                  )}
                </div>

                {/* Entrada */}
                <div className="space-y-2">
                  <Label htmlFor="down-payment" className="flex items-center space-x-2">
                    <Percent className="h-4 w-4 text-primary" />
                    <span>Entrada (%)</span>
                  </Label>
                  <Select value={downPayment} onValueChange={setDownPayment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0% - Sem entrada</SelectItem>
                      <SelectItem value="10">10% - Entrada mínima</SelectItem>
                      <SelectItem value="20">20% - Recomendado</SelectItem>
                      <SelectItem value="30">30% - Boa entrada</SelectItem>
                      <SelectItem value="40">40% - Entrada alta</SelectItem>
                      <SelectItem value="50">50% - Metade à vista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Prazo */}
                <div className="space-y-2">
                  <Label htmlFor="loan-term" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Prazo (meses)</span>
                  </Label>
                  <Select value={loanTerm} onValueChange={setLoanTerm}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 meses</SelectItem>
                      <SelectItem value="24">24 meses</SelectItem>
                      <SelectItem value="36">36 meses</SelectItem>
                      <SelectItem value="48">48 meses</SelectItem>
                      <SelectItem value="60">60 meses</SelectItem>
                      <SelectItem value="72">72 meses</SelectItem>
                      <SelectItem value="84">84 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Taxa de Juros */}
                <div className="space-y-2">
                  <Label htmlFor="interest-rate" className="flex items-center space-x-2">
                    <Percent className="h-4 w-4 text-primary" />
                    <span>Taxa de Juros (% ao mês)</span>
                  </Label>
                  <Select value={interestRate} onValueChange={setInterestRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.8">0,8% - Excelente score</SelectItem>
                      <SelectItem value="1.0">1,0% - Bom score</SelectItem>
                      <SelectItem value="1.2">1,2% - Score regular</SelectItem>
                      <SelectItem value="1.5">1,5% - Score baixo</SelectItem>
                      <SelectItem value="1.8">1,8% - Score muito baixo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateFinancing} className="w-full" size="lg">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calcular Financiamento
                </Button>
              </CardContent>
            </Card>

            {/* Resultado do Cálculo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Resultado da Simulação</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Parcela Mensal */}
                    <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-2">Parcela Mensal</p>
                      <p className="text-3xl font-bold text-primary">{formatCurrency(result.monthlyPayment)}</p>
                    </div>

                    <Separator />

                    {/* Detalhes */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Valor da Entrada:</span>
                        <span className="font-semibold">{formatCurrency(result.downPaymentAmount)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Valor Financiado:</span>
                        <span className="font-semibold">
                          {formatCurrency(
                            Number.parseFloat(vehiclePrice.replace(/[^\d]/g, "")) - result.downPaymentAmount,
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total de Juros:</span>
                        <span className="font-semibold text-orange-600">{formatCurrency(result.totalInterest)}</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center text-lg">
                        <span className="font-semibold">Valor Total:</span>
                        <span className="font-bold text-primary">{formatCurrency(result.totalAmount)}</span>
                      </div>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Informações Importantes:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Simulação sujeita à aprovação de crédito</li>
                        <li>• Taxas podem variar conforme análise</li>
                        <li>• Documentação necessária para aprovação</li>
                        <li>• Consulte condições especiais disponíveis</li>
                      </ul>
                    </div>

                    <Button className="w-full" variant="outline" size="lg">
                      Solicitar Aprovação
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Preencha os dados ao lado e clique em "Calcular Financiamento" para ver o resultado
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Vantagens do Financiamento AutoMax */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Vantagens do Financiamento AutoMax
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Percent className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Taxas Competitivas</h4>
                  <p className="text-sm text-muted-foreground">
                    As melhores taxas do mercado com condições especiais para nossos clientes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Aprovação Rápida</h4>
                  <p className="text-sm text-muted-foreground">
                    Análise de crédito em até 24 horas com documentação simplificada
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Entrada Flexível</h4>
                  <p className="text-sm text-muted-foreground">
                    Desde 0% de entrada até condições especiais para quem pode pagar mais
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
