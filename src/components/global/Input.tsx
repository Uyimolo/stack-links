"use client"
import { useCallback, useState, useEffect } from "react"
import { FieldValues, Path, UseFormRegister } from "react-hook-form"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/cn"
import { ImageUploadSVG } from "./SVGS"
import { useDropzone } from "react-dropzone"

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

export const Input = <T extends FieldValues>({
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
              "border-grey-3 text-text-secondary w-full rounded-lg border px-3 py-3 text-sm",
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
            "border-grey-3 text-text-secondary w-full rounded-lg border px-3 py-3 text-sm",
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
            "border-grey-3 text-text-secondary w-full rounded-lg border px-3 py-3 text-sm",
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

interface FileInputProps {
  value: File | undefined
  onChange: (file: File | null) => void
  error?: string
  loading?: boolean
  imageUrl?: string
}

export const FileInput = ({
  value,
  onChange,
  error,
  loading,
  imageUrl = "",
}: FileInputProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      if (!file.type.startsWith("image/")) return
      if (file.size > 5 * 1024 * 1024) return

      onChange(file)
    },
    [onChange]
  )

  useEffect(() => {
    if (!value) return

    const objectUrl = URL.createObjectURL(value)
    setPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [value])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "relative mx-auto grid aspect-square h-40 place-content-center rounded-3xl border-2 border-dashed transition",
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 bg-white"
        )}
        style={{
          backgroundImage: previewUrl
            ? `url(${previewUrl})`
            : `url(${imageUrl})`,
          backgroundSize: "cover",
        }}
      >
        <input {...getInputProps()} />
        {/* {!previewUrl && (
          <ImageUploadSVG className="pointer-events-none mx-auto fill-blue-400" />
        )} */}

        {loading ? (
          <Loader2 />
        ) : !previewUrl ? (
          <ImageUploadSVG className="pointer-events-none mx-auto fill-blue-400" />
        ) : (
          <></>
        )}
        <p
          className={`pointer-events-none p-1 text-center text-sm ${!previewUrl ? "text-text-secondary" : "w-[90%] bg-black/40 text-white"} mx-auto rounded`}
        >
          {isDragActive
            ? "Drop the file..."
            : "Click or drag to upload an image"}
        </p>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
