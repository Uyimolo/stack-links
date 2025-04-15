import { useState } from "react"
import { FieldValues, Path, UseFormRegister } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/cn"

interface InputProps<T extends FieldValues> {
  className?: string // Optional className for custom styling
  name: Path<T> // Ensures name matches form fields
  label?: string
  type?: string
  placeholder?: string
  register: UseFormRegister<T>
  error?: string
  rows?: number // Optional rows for textarea
  resize?: boolean // Optional prop to control textarea resizing
  autoFocus?: boolean // Optional prop to control autofocus
  onBlur?: () => void // Optional onBlur event handler
}

const Input = <T extends FieldValues>({
  className,
  name,
  label,
  type = "text",
  placeholder,
  register,
  error,
  rows = 3, // Default rows for textarea
  resize = false, // Default to false for textarea resizing
  autoFocus = false, // Default to false for autofocus
  onBlur,
}: InputProps<T>) => {
  const [showPassWord, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassWord)
  }

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-text-primary text-sm">
          {label}
        </label>
      )}

      {/* Password Input */}
      {name === "password" || name === "confirmPassword" ? (
        <div className="relative">
          <input
            {...register(name)}
            type={showPassWord ? "text" : type}
            id={name}
            placeholder={placeholder}
            className={cn(
              "border-border-light text-text-secondary w-full rounded-lg border px-3 py-3 text-sm",
              className
            )}
            autoFocus={autoFocus}
            onBlur={onBlur}
          />
          <div
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassWord ? (
              <EyeOff className="w-5" />
            ) : (
              <Eye className="w-5" />
            )}
          </div>
        </div>
      ) : type === "textarea" ? (
        // Textarea Input
        <textarea
          {...register(name)}
          id={name}
          placeholder={placeholder}
          rows={rows}
          // className="border-border-light text-text-secondary w-full rounded-lg border px-3 py-3 text-sm"
          //   style={resize ? { resize: "both" } : { resize: "none" }}
          className={cn(
            "border-border-light text-text-secondary w-full rounded-lg border px-3 py-3 text-sm",
            className,
            resize ? "resize-y" : "resize-none"
          )}
          autoFocus={autoFocus}
          onBlur={onBlur}
        />
      ) : (
        // Default Input
        <input
          {...register(name)}
          type={type}
          id={name}
          placeholder={placeholder}
          // className="border-border-light text-text-secondary w-full rounded-lg border px-3 py-3 text-sm"
          className={cn(
            "border-border-light text-text-secondary w-full rounded-lg border px-3 py-3 text-sm",
            className
          )}
          autoFocus={autoFocus}
          onBlur={onBlur}
        />
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export default Input
