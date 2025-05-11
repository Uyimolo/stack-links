"use client";
import { useCallback, useState, useEffect } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { ImageUploadSVG } from "./SVGS";
import { useDropzone } from "react-dropzone";

interface InputProps<T extends FieldValues> {
  className?: string;
  name: Path<T>;
  label?: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: string;
  rows?: number;
  resize?: boolean;
  autoFocus?: boolean;
  onBlur?: () => void;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export const Input = <T extends FieldValues>({
  className,
  name,
  label,
  type = "text",
  placeholder,
  register,
  error,
  rows = 3,
  resize = false,
  autoFocus = false,
  onBlur,
  onChange,
}: InputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const registerProps = register(name);

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
            {...registerProps}
            type={showPassword ? "text" : type}
            id={name}
            placeholder={placeholder}
            autoFocus={autoFocus}
            onBlur={(e) => {
              registerProps.onBlur(e);
              onBlur?.();
            }}
            onChange={(e) => {
              registerProps.onChange(e);
              onChange?.(e);
            }}
            className={cn(
              "border-grey-3 text-text-secondary w-full rounded-lg border px-3 py-3 text-sm",
              className,
            )}
          />
          <div
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="w-5" />
            ) : (
              <Eye className="w-5" />
            )}
          </div>
        </div>
      ) : type === "textarea" ? (
        <textarea
          {...registerProps}
          id={name}
          placeholder={placeholder}
          rows={rows}
          autoFocus={autoFocus}
          onBlur={(e) => {
            registerProps.onBlur(e);
            onBlur?.();
          }}
          onChange={(e) => {
            registerProps.onChange(e);
            onChange?.(e);
          }}
          className={cn(
            "border-grey-3 text-text-secondary w-full rounded-lg border px-3 py-3 text-sm",
            className,
            resize ? "resize-y" : "resize-none",
          )}
        />
      ) : (
        <input
          {...registerProps}
          type={type}
          id={name}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onBlur={(e) => {
            registerProps.onBlur(e);
            onBlur?.();
          }}
          onChange={(e) => {
            registerProps.onChange(e);
            onChange?.(e);
          }}
          className={cn(
            "border-grey-3 text-text-secondary w-full rounded-lg border px-3 py-3 text-sm",
            className,
          )}
        />
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

interface FileInputProps {
  value: File | undefined;
  onChange: (file: File | null) => void;
  error?: string;
  loading?: boolean;
  imageUrl?: string;
}

export const FileInput = ({
  value,
  onChange,
  error,
  loading,
  imageUrl = "",
}: FileInputProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;

      onChange(file);
    },
    [onChange],
  );

  useEffect(() => {
    if (!value) return;

    const objectUrl = URL.createObjectURL(value);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "relative mx-auto grid aspect-square h-40 place-content-center rounded-3xl border-2 border-dashed transition",
          isDragActive ? "border-primary" : "border-grey-3",
        )}
        style={{
          backgroundImage: previewUrl
            ? `url(${previewUrl})`
            : `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <input {...getInputProps()} />
        {/* {!previewUrl && (
          <ImageUploadSVG className="pointer-events-none mx-auto fill-blue-400" />
        )} */}

        {loading ? (
          <div className="bg-grey-3 w-fit h-fit p-1 mx-auto">
            <Loader2 className="mx-auto text-primary animate-spin" />
          </div>
        ) : !previewUrl ? (
          <ImageUploadSVG className="pointer-events-none mx-auto fill-blue-400" />
        ) : (
          <></>
        )}
        <p
          className={`pointer-events-none p-1 text-center bg-white/60 text-sm rounded mx-2`}
        >
          {isDragActive
            ? "Drop the file..."
            : "Click or drag to upload an image"}
        </p>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
