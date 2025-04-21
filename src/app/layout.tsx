import type { Metadata } from "next"
import { Nunito, Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import AuthProvider from "@/components/auth/AuthProvider"
import ModalWrapper from "@/components/global/ModalWrapper"

export const metadata: Metadata = {
  title: "Stack Links",
  description: "A simple link management tool",
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"], // Add desired weights
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-white font-montserrat min-h-screen w-full ${nunito.variable} ${inter.variable} ${montserrat.variable} `}
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-right" />
        <ModalWrapper />
      </body>
    </html>
  )
}
