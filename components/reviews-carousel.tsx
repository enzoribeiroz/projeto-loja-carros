"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Review {
  id: number
  name: string
  avatar: string
  date: string
  rating: number
  comment: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Maria Silva",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "15/12/2023",
    rating: 5,
    comment:
      "Excelente atendimento! Comprei meu primeiro carro na AutoMax e foi uma experiência incrível. A equipe foi muito atenciosa e me ajudou a encontrar exatamente o que eu precisava.",
  },
  {
    id: 2,
    name: "João Santos",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "08/12/2023",
    rating: 5,
    comment:
      "Já é a segunda vez que compro na AutoMax. Transparência total, preços justos e pós-venda excepcional. Recomendo de olhos fechados!",
  },
  {
    id: 3,
    name: "Ana Costa",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "02/12/2023",
    rating: 4,
    comment:
      "Ótima experiência de compra. O carro estava exatamente como descrito e o processo de financiamento foi muito rápido. Equipe muito profissional.",
  },
  {
    id: 4,
    name: "Carlos Oliveira",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "28/11/2023",
    rating: 5,
    comment:
      "Atendimento diferenciado! Me senti muito seguro durante todo o processo. A AutoMax realmente se preocupa com a satisfação do cliente.",
  },
  {
    id: 5,
    name: "Fernanda Lima",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "22/11/2023",
    rating: 5,
    comment:
      "Comprei um seminovo e estou muito satisfeita. Carro em perfeito estado, documentação em dia e ainda ganhei garantia estendida. Parabéns pelo trabalho!",
  },
  {
    id: 6,
    name: "Roberto Mendes",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "18/11/2023",
    rating: 4,
    comment:
      "Bom atendimento e variedade de veículos. O consultor foi muito paciente e me mostrou várias opções até encontrarmos a ideal. Recomendo!",
  },
  {
    id: 7,
    name: "Juliana Ferreira",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "12/11/2023",
    rating: 5,
    comment:
      "Experiência fantástica! Desde o primeiro contato até a entrega do veículo, tudo foi perfeito. A AutoMax superou minhas expectativas.",
  },
  {
    id: 8,
    name: "Pedro Almeida",
    avatar: "/placeholder.svg?height=60&width=60",
    date: "05/11/2023",
    rating: 5,
    comment:
      "Profissionalismo e qualidade em primeiro lugar. Comprei meu carro dos sonhos na AutoMax e não poderia estar mais feliz com a escolha.",
  },
]

export default function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length)
    }, 4000) // Move a cada 4 segundos

    return () => clearInterval(interval)
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">O que nossos clientes dizem</h2>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / 3)}%)`,
              width: `${(reviews.length * 100) / 3}%`,
            }}
          >
            {reviews.map((review) => (
              <div key={review.id} className="w-1/3 px-3 flex-shrink-0">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{review.name}</h4>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">{renderStars(review.rating)}</div>

                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center mt-8 space-x-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
