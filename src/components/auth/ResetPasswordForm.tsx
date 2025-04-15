"use client"

import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../global/Input"
import { Button } from "../global/Button"
import { LogoSmall } from "../global/Logo"
import { confirmPasswordReset } from "firebase/auth"
import { useState } from "react"
import { auth } from "@/config/firebase"
import { useFirebaseAuthError } from "@/hooks/useAuthHooks"
import { FirebaseError } from "firebase/app"

const schema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(
      /[@$!%*?&]/,
      "Password must include at least one special character (@$!%*?&)"
    ),
})

type FormValues = z.infer<typeof schema>

const ResetPasswordForm = () => {
  const searchParams = useSearchParams()
  const oobCode = searchParams.get("oobCode")
  const [message, setMessage] = useState("")
  const { handleFirebaseAuthError } = useFirebaseAuthError()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  const onSubmit = async (data: FormValues) => {
    if (!oobCode) {
      setMessage("Invalid or expired reset link.")
      return
    }

    try {
      await confirmPasswordReset(auth, oobCode, data.password)
      setMessage("Password reset successful! You can now log in.")
    } catch (error) {
      console.error(error)
      handleFirebaseAuthError(error as FirebaseError)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-[400px] space-y-6 rounded-2xl bg-white p-6"
    >
      <LogoSmall />
      <h1 className="text-text-primary text-2xl font-medium">
        Set New Password
      </h1>
      <p className="text-text-secondary text-sm">
        Enter your new password below.
      </p>

      {message && <p className="text-sm text-green-500">{message}</p>}

      <div className="space-y-4">
        <Input
          name="password"
          label="New Password"
          type="password"
          placeholder="Enter new password"
          register={register}
          error={errors.password?.message}
        />
      </div>

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={!isValid || isSubmitting}
      >
        Reset Password
      </Button>
    </form>
  )
}

export default ResetPasswordForm
