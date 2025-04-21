import { useState } from "react"

export const useCloudinaryUpload = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (
    file: File,
    publicId?: string
  ): Promise<string | null> => {
    if (!file) return null

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "stack-links")

      // Optional: use public_id for deterministic overwrite
      if (publicId) {
        formData.append("public_id", publicId)
      }

      const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      )

      const data = await response.json()

      if (!response.ok) throw new Error(data?.error?.message || "Upload failed")

      return data.secure_url
    } catch (err) {
      const message = (err as Error).message
      console.error("Cloudinary upload error:", message)
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { upload, loading, error }
}
