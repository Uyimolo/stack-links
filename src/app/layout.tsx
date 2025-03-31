import type { Metadata } from "next"
import { Nunito, Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import AuthProvider from "@/components/auth/AuthProvider"

export const metadata: Metadata = {
  title: "Stack Links",
  description: "A simple link management tool",
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
        className={`bg-bg-light font-nunito ${nunito.variable} ${inter.variable} `}
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
