"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll para o topo sempre que a rota mudar
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Scroll instantâneo para mudanças de página
    })
  }, [pathname])

  return null
}
