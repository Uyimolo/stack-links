"use client"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../global/Input"
import { Button } from "../global/Button"
import Link from "next/link"
import { LogoSmall } from "../global/Logo"
import { useFirebaseAuthError } from "@/hooks/useAuthHooks"
import { toast } from "sonner"
import { useAuthStore } from "@/store/useAuthStore"
import { FirebaseError } from "firebase/app"

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(
      /[@$!%*?&#|]/,
      "Password must include at least one special character (@$!%*?&)"
    ),
})

type FormValues = z.infer<typeof schema>

const LoginForm = () => {
  const { handleFirebaseAuthError } = useFirebaseAuthError()

  const { loginUser } = useAuthStore()
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
      await loginUser(data.email, data.password)
      toast.success("Login successful")
    } catch (error) {
      console.error(error)
      // Fix: Don't call hooks in event handlers
      // Instead, import the function and call it
      handleFirebaseAuthError(error as FirebaseError)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-[400px] space-y-6 rounded-2xl bg-white p-6 2xl:mr-0"
    >
      <LogoSmall />
      <div>
        <h1 className="text-text-primary text-2xl font-medium">Welcome Back</h1>
        <p className="text-text-secondary text-sm">Sign in to continue</p>
      </div>
      <div className="space-y-4">
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          register={register}
          error={errors.email?.message}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          register={register}
          error={errors.password?.message}
        />
      </div>
      <Button
        type="submit"
        loading={isSubmitting}
        disabled={!isValid || isSubmitting}
      >
        Log in
      </Button>
      <div className="flex flex-wrap justify-between gap-x-6 gap-y-2">
        <p className="text-sm">
          {`an account Don't have?`}
          <Link href="/signup" className="text-primary">
            Sign up
          </Link>
        </p>
        <Link className="text-primary text-sm" href="/forgot-password">
          Forgot password?
        </Link>
      </div>
    </form>
  )
}

export default LoginForm
