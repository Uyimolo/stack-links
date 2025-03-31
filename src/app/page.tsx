"use client"
import { Button } from "@/components/global/Button"
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter } from "next/navigation"

export default function Home() {
  const { isVerified, user } = useAuthStore()
  const router = useRouter()

  const handleRedirectUser = () => {
    if (!user) {
      // Redirect to the login page
      router.push("/signup")
      return
    }
    if (isVerified) {
      // Redirect to the dashboard
      router.push("/dashboard")
      return
    } else {
      // Redirect to the email verification page
      router.push("/verify-email")
      return
    }
  }

  const buttonText = !user
    ? "Get Started"
    : isVerified
      ? "Go to Dashboard"
      : "Verify Email"
  return (
    <div className="grid min-h-screen place-content-center">
      <Button onClick={handleRedirectUser} className="w-full max-w-sm">
        {buttonText}
      </Button>
    </div>
  )
}
