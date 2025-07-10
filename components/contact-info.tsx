import { Phone, Mail, Instagram, MapPin, Clock, QrCode, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function ContactInfo() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-black">Nossos Canais de Atendimento</h2>
            <p className="text-lg text-muted-foreground">
              Escolha a forma mais conveniente para entrar em contato conosco
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informações de Contato */}
            <div className="space-y-6">
              {/* Telefone */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Telefone</h3>
                      <p className="text-sm text-muted-foreground">Atendimento 24 horas</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-lg">(11) 9999-9999</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-lg">(11) 3333-3333</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Segunda a Domingo - 24h</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <QrCode className="h-8 w-8 text-gray-400" />
                      </div>
                      <span className="text-xs text-muted-foreground">QR Code</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* WhatsApp */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">WhatsApp</h3>
                      <p className="text-sm text-muted-foreground">Resposta imediata</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-lg">(11) 99999-9999</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Segunda a Sábado - 8h às 18h</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tire suas dúvidas, agende test drives e receba ofertas exclusivas
                      </p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <QrCode className="h-8 w-8 text-gray-400" />
                      </div>
                      <span className="text-xs text-muted-foreground">QR Code</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Abrir WhatsApp
                  </Button>
                </CardContent>
              </Card>

              {/* Instagram */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <Instagram className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Instagram</h3>
                      <p className="text-sm text-muted-foreground">Siga-nos para novidades</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Instagram className="h-4 w-4 text-pink-600" />
                        <span className="font-semibold text-lg">@automax_oficial</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Veja nossos veículos, promoções e novidades em primeira mão
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>• 15.2k seguidores</span>
                        <span>• Posts diários</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <QrCode className="h-8 w-8 text-gray-400" />
                      </div>
                      <span className="text-xs text-muted-foreground">QR Code</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <Button className="w-full bg-pink-600 hover:bg-pink-700">
                    <Instagram className="h-4 w-4 mr-2" />
                    Seguir no Instagram
                  </Button>
                </CardContent>
              </Card>

              {/* Email */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">E-mail</h3>
                      <p className="text-sm text-muted-foreground">Para contatos formais</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold">contato@automax.com.br</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold">vendas@automax.com.br</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Resposta em até 2 horas úteis</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Envie suas dúvidas, sugestões ou solicite orçamentos detalhados
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar E-mail
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Endereço</h3>
                      <p className="text-sm text-muted-foreground">Venha nos visitar</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-red-600 mt-1" />
                        <div>
                          <p className="font-semibold">Av. Paulista, 1234</p>
                          <p className="text-muted-foreground">Bela Vista, São Paulo - SP</p>
                          <p className="text-muted-foreground">CEP: 01310-100</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Segunda a Sábado - 8h às 18h</span>
                      </div>
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <MapPin className="h-4 w-4 mr-2" />
                      Ver no Google Maps
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mapa */}
            <div className="lg:sticky lg:top-8">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <span>Nossa Localização</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="w-full h-[600px] lg:h-[800px] rounded-b-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975750816406!2d-46.65654368502207!3d-23.561414984691267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201234%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1spt-BR!2sbr!4v1647875432123!5m2!1spt-BR!2sbr"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Localização AutoMax"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-16">
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-black">Horários de Funcionamento</h3>
                  <p className="text-muted-foreground">Estamos sempre prontos para atendê-lo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">Showroom</h4>
                    <p className="text-sm text-muted-foreground">Segunda a Sábado</p>
                    <p className="text-sm font-medium">8h às 18h</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Telefone</h4>
                    <p className="text-sm text-muted-foreground">Todos os dias</p>
                    <p className="text-sm font-medium">24 horas</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">WhatsApp</h4>
                    <p className="text-sm text-muted-foreground">Segunda a Sábado</p>
                    <p className="text-sm font-medium">8h às 18h</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-2">E-mail</h4>
                    <p className="text-sm text-muted-foreground">Resposta rápida</p>
                    <p className="text-sm font-medium">2h úteis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
