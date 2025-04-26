import { useState } from "react";

export const useCloudinaryUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (
    file: File,
    publicId: string,
  ): Promise<string | null> => {
    if (!file) return null;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Get signature from backend
      const signRes = await fetch("/api/sign-cloudinary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      });

      const { timestamp, signature, apiKey, cloudName } = await signRes.json();

      // Step 2: Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("public_id", publicId);
      formData.append("overwrite", "true");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await uploadRes.json();

      if (!uploadRes.ok)
        throw new Error(data?.error?.message || "Upload failed");

      return data.secure_url;
    } catch (err) {
      const message = (err as Error).message;
      console.error("Cloudinary upload error:", message);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading, error };
};
