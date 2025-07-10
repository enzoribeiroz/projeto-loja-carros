export default function PartnerLogos() {
  const partners = [
    { name: "Honda", logo: "/logos/honda.png" },
    { name: "Toyota", logo: "/logos/toyota.png" },
    { name: "Volkswagen", logo: "/logos/volkswagen.png" },
    { name: "BMW", logo: "/logos/bmw.png" },
    { name: "Mercedes-Benz", logo: "/logos/mercedes.png" },
    { name: "Audi", logo: "/logos/audi.png" },
    { name: "Hyundai", logo: "/logos/hyundai.png" },
    { name: "Nissan", logo: "/logos/nissan.png" },
    { name: "Ford", logo: "/logos/ford.png" },
    { name: "Chevrolet", logo: "/logos/chevrolet.png" },
    { name: "Jeep", logo: "/logos/jeep.png" },
    { name: "Fiat", logo: "/logos/fiat.png" },
    { name: "Renault", logo: "/logos/renault.png" },
    { name: "Peugeot", logo: "/logos/peugeot.png" },
    { name: "Citroën", logo: "/logos/citroen.png" },
  ]

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Nossas Marcas Parceiras</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trabalhamos com as principais montadoras do mercado para oferecer a você a melhor seleção de veículos
          </p>
        </div>

        {/* Grid de Logos */}
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 w-full h-20"
            >
              <img
                src={partner.logo || "/placeholder.svg"}
                alt={`Logo ${partner.name}`}
                className="max-h-12 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* Texto adicional */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            <strong>Mais de 15 marcas parceiras</strong> garantindo variedade e qualidade em nosso estoque
          </p>
        </div>
      </div>
    </section>
  )
}
