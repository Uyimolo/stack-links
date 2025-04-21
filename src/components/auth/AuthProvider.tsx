"use client"
import { useAuthStore } from "@/store/useAuthStore"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/account", "/settings", "/collections"]

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, checkUser } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = checkUser()
    return () => unsubscribe()
  }, [checkUser])

  // Handle auth-based redirects
  useEffect(() => {
    // Don't redirect during loading
    if (loading) return

    // Check if current path is a protected route
    const isProtectedRoute = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )

    // Redirect logic
    if (!user && isProtectedRoute) {
      router.replace("/login")
    }
  }, [user, loading, pathname, router])

  return <>{children}</>
}
