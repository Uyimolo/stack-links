import { cn } from "@/lib/cn"
import { ButtonHTMLAttributes } from "react"
import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-btn-primary text-white hover:bg-btn-primary-hover",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        outline: "border border-primary text-primary bg-white hover:bg-gray-100",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        ghost: "text-gray-700 hover:bg-gray-100",
      },
      size: {
        sm: "px-3  py-1.5 text-sm",
        md: "px-6 h-12 py-2 text-base",
        lg: "px-10 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export function Button({
  loading,
  className,
  children,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
      {children}
    </button>
  )
}
