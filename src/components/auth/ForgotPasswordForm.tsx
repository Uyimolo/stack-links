"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/global/Input"
import { Button } from "../global/Button"
import Link from "next/link"
import { LogoSmall } from "../global/Logo"
import { sendPasswordResetEmail } from "firebase/auth"
import { useState } from "react"
import { auth } from "@/config/firebase"
import { FirebaseError } from "firebase/app"
import { useFirebaseAuthError } from "@/hooks/useAuthHooks"

const schema = z.object({
  email: z.string().email("Invalid email address"),
})

type FormValues = z.infer<typeof schema>

const ForgotPasswordForm = () => {
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
    try {
      await sendPasswordResetEmail(auth, data.email)
      setMessage("Password reset link sent. Check your inbox.")
    } catch (error) {
      console.error(error)
      handleFirebaseAuthError(error as FirebaseError)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-[400px] space-y-6 rounded-2xl bg-white"
    >
      <LogoSmall />
      <div>
        <h1 className="text-text-primary text-2xl font-medium">
          Reset Password
        </h1>
        <p className="text-text-secondary text-sm">
          {`Enter your email, and we'll send you a reset link.`}
        </p>
      </div>

      {message && <p className="text-sm text-green-500">{message}</p>}

      <div className="space-y-4">
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          register={register}
          error={errors.email?.message}
        />
      </div>

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={!isValid || isSubmitting}
        className="w-full"
      >
        Send Reset Link
      </Button>

      <p className="text-sm">
        Remembered your password?{" "}
        <Link href="/login" className="text-primary">
          Log in
        </Link>
      </p>
    </form>
  )
}

export default ForgotPasswordForm
