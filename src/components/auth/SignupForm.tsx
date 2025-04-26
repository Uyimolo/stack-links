"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/global/Input";
import { Button } from "../global/Button";
import Link from "next/link";
import { LogoSmall } from "../global/Logo";
import { useFirebaseAuthError } from "@/hooks/useAuthHooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { FirebaseError } from "firebase/app";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(
      /[@$!%*?&#|]/,
      "Password must include at least one special character (@$!%*?&)",
    ),

  // confirmPassword: z
  //   .string()
  //   .min(8, "Password must be at least 8 characters"),
  // username: z.string().min(3, "Username must be at least 3 characters"),
});
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"], // This ensures the error appears under confirmPassword
//   })

type FormValues = z.infer<typeof schema>;
const SignupForm = () => {
  const router = useRouter(); // Initialize router
  const { registerUser } = useAuthStore();
  const { handleFirebaseAuthError } = useFirebaseAuthError();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const formData: Record<
    keyof FormValues,
    { label: string; type?: string; placeholder?: string }
  > = {
    email: { label: "Email", type: "email", placeholder: "Enter your email" },
    username: {
      label: "Username",
      type: "text",
      placeholder: "Enter your username",
    },
    password: {
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
    },
    // confirmPassword: {
    //   label: "Confirm Password",
    //   type: "password",
    //   placeholder: "Confirm your password",
    // },
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await registerUser(data.email, data.password);
      toast.success("Account created successfully!");
      //redirect to verify email page
      router.push("/verify-email");
    } catch (error) {
      console.error(error);
      handleFirebaseAuthError(error as FirebaseError);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-[400px] space-y-6 rounded-2xl bg-white 2xl:mr-0"
    >
      <LogoSmall />
      <div className="">
        <h1 className="text-text-primary text-2xl font-medium">
          Welcome to Stack Links{" "}
        </h1>
        <p className="text-text-secondary text-sm">
          {" "}
          Please create an account to continue{" "}
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(formData).map(([name, config]) => (
          <Input
            key={name}
            name={name as keyof FormValues}
            label={config.label}
            type={config.type}
            placeholder={config.placeholder}
            register={register}
            error={errors[name as keyof FormValues]?.message}
          />
        ))}
      </div>

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={!isValid || isSubmitting}
        className="w-full"
      >
        Sign up
      </Button>

      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary">
          Log in
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
