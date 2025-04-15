"use client"

import { Button } from "../global/Button"
import { LogoSmall } from "../global/Logo"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"

const VerifyEmail = () => {
  const router = useRouter()
  const { verifyUserEmail, isVerified, refreshUserState } = useAuthStore()

  const handleResend = async () => {
    try {
      await verifyUserEmail()
      toast.success("Verification email sent!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to resend email. Please try again later.")
    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshUserState()
      if (isVerified) {
        clearInterval(interval)
        setTimeout(() => router.push("/dashboard"), 2000)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isVerified, refreshUserState, router])

  return (
    <div className="mx-auto w-full max-w-[400px] space-y-6 rounded-2xl bg-white p-6 text-center">
      <LogoSmall />
      <h1 className="text-text-primary text-2xl font-medium">
        Verify Your Email
      </h1>
      <p className="text-text-secondary text-sm">
        {`We've sent a verification email. Please check your inbox and click the
        link.`}
      </p>

      <Button onClick={handleResend}>Resend Email</Button>
    </div>
  )
}

export default VerifyEmail
