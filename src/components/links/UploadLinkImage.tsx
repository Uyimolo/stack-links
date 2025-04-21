import { LinkType } from "@/types/types"
import { FileInput } from "../global/Input"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useCloudinaryUpload } from "@/hooks/useCloudinary"
import { auth } from "@/config/firebase"
import { toast } from "sonner"
import { useLinkActions } from "@/hooks/useLinkHooks"

const schema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) => file.type.startsWith("image/"),
      "Only image files allowed"
    ),
})

type FormData = z.infer<typeof schema>

const UploadLinkImage = ({ link }: { link: LinkType }) => {
  const { loading: uploading, upload, error } = useCloudinaryUpload()
  const { editLink } = useLinkActions()
  const uid = auth.currentUser?.uid || ""

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  const image = watch("image")

  useEffect(() => {
    const updateLinkImage = async () => {
      let imageUrl = ""

      if (!image) return

      const publicId = `links/${uid}-${link.id}`
      const result = await upload(image, publicId)

      if (!result || error) {
        toast.error("Image upload failed")
        return
      }
      imageUrl = result
      console.log(imageUrl)

      const params = {
        linkId: link.id,
        title: link.title,
        description: link.description,
        url: link.url,
        visibility: link.visibility,
        pinned: link.pinned,
        imageUrl,
      }

      try {
        await editLink(params)
        toast.success("Link image updated successfully")
      } catch (error) {
        console.error("Firestore error", error)
        toast.error("Failed to update link image")
      }
    }

    updateLinkImage()
  }, [image])

  return (
    <div className="p-4">
      <Controller
        control={control}
        name="image"
        render={({ field, fieldState }) => (
          <FileInput
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
            loading={uploading}
            imageUrl={link.imageUrl}
          />
        )}
      />
    </div>
  )
}

export default UploadLinkImage
