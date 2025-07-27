import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout"

const inter = Inter({ subsets: ["latin"] })

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
    <html lang="es">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
        </AuthProvider>
      </body>
    </html>
  )
}