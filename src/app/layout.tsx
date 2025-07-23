import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/layout/Sidebar"

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
        <div className="flex h-screen bg-black">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-black">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
