// src/app/layout.tsx - RESTAURADO Y FUNCIONANDO
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout"

export const metadata: Metadata = {
  title: "Vento - Sistema de Punto de Venta",
  description: "Sistema de punto de venta para hamburguesería",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
        </AuthProvider>
      </body>
    </html>
  )
}