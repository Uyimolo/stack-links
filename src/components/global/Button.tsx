import { cn } from "@/lib/cn"
import { ButtonHTMLAttributes } from "react"
import { Loader2 } from "lucide-react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export function Button({
  loading,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center w-full justify-center gap-2 rounded-lg px-10 py-3 cursor-pointer font-medium transition-all",
        "bg-btn-primary text-white hover:bg-btn-primary-hover hover:shadow-xl",
        "disabled:cursor-not-allowed disabled:bg-btn-primary-disabled",
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
      {children}
    </button>
  )
}
