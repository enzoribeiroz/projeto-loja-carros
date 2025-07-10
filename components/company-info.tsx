import { Calendar, Award, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function CompanyInfo() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Tempo no Mercado */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Calendar className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold">Nossa Trajetória</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Há mais de <strong>25 anos</strong> no mercado automotivo, a AutoMax iniciou suas atividades em 1998 como
              uma pequena concessionária familiar. Ao longo dessas duas décadas e meia, crescemos e nos consolidamos
              como uma das principais referências em vendas de veículos novos e seminovos na região, sempre mantendo
              nossos valores de transparência, qualidade e atendimento personalizado.
            </p>
          </div>

          {/* Como Atuamos */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold">Como Atuamos no Mercado</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Nossa atuação no mercado é baseada em três pilares fundamentais: <strong>inovação</strong>,
              <strong>qualidade</strong> e <strong>relacionamento</strong>. Trabalhamos com as principais montadoras do
              país, oferecendo uma ampla gama de veículos que atendem desde o primeiro carro até os modelos mais
              luxuosos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <p className="text-muted-foreground">Veículos em Estoque</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15</div>
                  <p className="text-muted-foreground">Marcas Parceiras</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">10.000+</div>
                  <p className="text-muted-foreground">Clientes Satisfeitos</p>
                </CardContent>
              </Card>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Além da venda, oferecemos serviços completos de pós-venda, incluindo manutenção, peças originais, seguros
              e financiamento facilitado. Nossa equipe técnica é constantemente treinada para oferecer o melhor suporte
              aos nossos clientes.
            </p>
          </div>

          {/* Por que Escolher */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Award className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold">Por que Escolher a AutoMax?</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-lg text-muted-foreground">
                  <strong>Experiência Comprovada:</strong> 25 anos de mercado nos deram o conhecimento necessário para
                  entender exatamente o que nossos clientes precisam.
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-lg text-muted-foreground">
                  <strong>Transparência Total:</strong> Todos os nossos veículos passam por inspeção rigorosa e
                  fornecemos relatórios completos sobre o histórico e condições.
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-lg text-muted-foreground">
                  <strong>Atendimento Personalizado:</strong> Cada cliente é único, por isso oferecemos consultoria
                  especializada para encontrar o veículo ideal para seu perfil e necessidades.
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-lg text-muted-foreground">
                  <strong>Garantia e Suporte:</strong> Oferecemos garantia estendida e suporte pós-venda completo,
                  garantindo sua tranquilidade após a compra.
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-lg text-muted-foreground">
                  <strong>Preços Competitivos:</strong> Trabalhamos com margens justas e oferecemos as melhores
                  condições de financiamento do mercado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
