import { useState } from "react"
import { FieldValues, Path, UseFormRegister } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"

interface InputProps<T extends FieldValues> {
  name: Path<T> // Ensures name matches form fields
  label?: string
  type?: string
  placeholder?: string
  register: UseFormRegister<T>
  error?: string
}

const Input = <T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  register,
  error,
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
      {name === "password" || name === "confirmPassword" ? (
        <div className="relative">
          <input
            {...register(name)}
            type={showPassWord ? "text" : type}
            id={name}
            placeholder={placeholder}
            className={`border-border-light text-text-secondary w-full rounded-lg border px-3 py-3 text-sm`}
          />

          <div
            className="absolute top-1/2 right-3 -translate-y-1/2"
            onClick={togglePasswordVisibility}
          >
            {!showPassWord ? (
              <Eye className="w-5 cursor-pointer stroke-1" />
            ) : (
              <EyeOff className="w-5 cursor-pointer stroke-1" />
            )}
          </div>
        </div>
      ) : (
        <input
          {...register(name)}
          type={type}
          id={name}
          placeholder={placeholder}
          className={`border-border-light text-text-secondary rounded-lg border px-3 py-3 text-sm`}
        />
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export default Input
