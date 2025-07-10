// Funções de formatação para o sistema

/**
 * Formata um valor numérico como moeda brasileira (R$)
 */
export function formatCurrency(value: string | number): string {
  if (!value) return ""
  
  // Remove tudo que não é número
  const numbers = String(value).replace(/[^\d]/g, "")
  
  if (!numbers) return ""
  
  const numericValue = parseInt(numbers)
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue)
}

/**
 * Remove formatação de moeda e retorna apenas números
 */
export function unformatCurrency(value: string | number | null | undefined): string {
  if (!value) return ""
  
  // Converte para string e remove tudo que não é número
  return String(value).replace(/[^\d]/g, "")
}

/**
 * Formata quilometragem com separadores de milhares e "km"
 */
export function formatMileage(value: string | number): string {
  if (!value) return ""
  
  // Remove tudo que não é número
  const numbers = String(value).replace(/[^\d]/g, "")
  
  if (!numbers) return ""
  
  const numericValue = parseInt(numbers)
  
  return new Intl.NumberFormat("pt-BR").format(numericValue) + " km"
}

/**
 * Remove formatação de quilometragem e retorna apenas números
 */
export function unformatMileage(value: string): string {
  return value.replace(/[^\d]/g, "")
}

/**
 * Formata consumo de combustível (km/l)
 */
export function formatFuelConsumption(value: string | number): string {
  if (!value) return ""
  
  // Remove tudo que não é número ou ponto decimal
  const numbers = String(value).replace(/[^\d.,]/g, "").replace(",", ".")
  
  if (!numbers) return ""
  
  const numericValue = parseFloat(numbers)
  
  if (isNaN(numericValue)) return ""
  
  return numericValue.toFixed(1).replace(".", ",") + " km/l"
}

/**
 * Remove formatação de consumo e retorna apenas números
 */
export function unformatFuelConsumption(value: string): string {
  return value.replace(/[^\d.,]/g, "").replace(",", ".")
}

/**
 * Formata entrada de moeda em tempo real
 */
export function handleCurrencyInput(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/[^\d]/g, "")
  
  if (!numbers) return ""
  
  const numericValue = parseInt(numbers)
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue)
}

/**
 * Formata entrada de quilometragem em tempo real
 */
export function handleMileageInput(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/[^\d]/g, "")
  
  if (!numbers) return ""
  
  const numericValue = parseInt(numbers)
  
  return new Intl.NumberFormat("pt-BR").format(numericValue) + " km"
}

/**
 * Formata entrada de consumo em tempo real
 */
export function handleFuelConsumptionInput(value: string): string {
  // Remove tudo que não é número ou vírgula
  const cleanValue = value.replace(/[^\d,]/g, "")
  
  if (!cleanValue) return ""
  
  // Garante que só há uma vírgula
  const parts = cleanValue.split(",")
  if (parts.length > 2) {
    return parts[0] + "," + parts.slice(1).join("")
  }
  
  return cleanValue + " km/l"
}

/**
 * Formata um valor numérico como moeda brasileira (R$) - versão simples
 * Usada principalmente para exibição de preços
 */
export function formatPrice(value: string | number): string {
  if (!value) return ""
  
  // Remove tudo que não é número
  const numbers = String(value).replace(/[^\d]/g, "")
  
  if (!numbers) return ""
  
  const numericValue = parseInt(numbers)
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue)
}
