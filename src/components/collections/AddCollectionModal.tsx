"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAppState } from "@/store/useAppStore"
import { Button } from "../global/Button"
import { X } from "lucide-react"
import { FileInput, Input } from "@/components/global/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCollectionActions } from "@/hooks/useCollectionHooks"
import { auth } from "@/config/firebase"
import { toast } from "sonner"
import { useCloudinaryUpload } from "@/hooks/useCloudinary"

const schema = z.object({
  name: z.string().min(3, "Collection name must be at least 3 characters"),
  description: z.string().optional(),
  visibility: z.enum(["public", "private", "unlisted"], {
    errorMap: () => ({ message: "Please select a visibility" }),
  }),
  tags: z.string().optional(),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) => file.type.startsWith("image/"),
      "Only image files allowed"
    ),
})

type FormData = z.infer<typeof schema>

const AddCollectionModal = () => {
  const { addCollection, loading } = useCollectionActions()
  const { updateModal } = useAppState()
  const { loading: uploading, upload, error } = useCloudinaryUpload()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  const onSubmit = async (data: FormData) => {
    const formattedTags = data.tags
      ? data.tags.split(",").map((tag) => tag.trim())
      : []

    const uid = auth.currentUser?.uid
    if (!uid) {
      toast.error("Not authenticated")
      return
    }

    // Generate collectionId early
    const collectionId = crypto.randomUUID()

    let imageUrl = ""

    if (data.image) {
      const publicId = `collections/${uid}-${collectionId}`
      const result = await upload(data.image, publicId)

      if (!result || error) {
        toast.error("Image upload failed")
        return
      }

      imageUrl = result
      console.log(imageUrl)
    }

    const params = {
      collectionId,
      userId: uid,
      name: data.name,
      description: data.description || "",
      visibility: data.visibility,
      tags: formattedTags,
      imageUrl,
    }

    try {
      await addCollection(params)
      toast.success("Collection created")
    } catch (err) {
      console.error("Firestore error:", err)
      toast.error("Failed to create collection")
    }
  }

  // Watch the visibility to manually update it
  const visibility = watch("visibility")

  return (
    <div className="w-[calc(100vw-48px)] max-w-sm rounded-lg bg-white p-6 shadow-lg md:max-w-md">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-primary text-lg font-semibold">Add Collection</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => updateModal({ status: "close", modalType: null })}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <Input
            register={register}
            label="Collection Name"
            name="name"
            placeholder="Enter collection name"
            error={errors.name?.message}
          />
        </div>

        <div>
          <Input
            type="textarea"
            register={register}
            name="description"
            placeholder="Enter collection description"
            error={errors.description?.message}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Visibility
          </label>
          <Select
            value={visibility}
            onValueChange={(value) =>
              setValue("visibility", value as "public" | "private" | "unlisted")
            }
          >
            <SelectTrigger className="w-full rounded-lg border p-3 py-5 text-sm">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="unlisted">Unlisted</SelectItem>
            </SelectContent>
          </Select>
          {errors.visibility && (
            <p className="text-sm text-red-500">{errors.visibility.message}</p>
          )}
        </div>

        <div>
          <Input
            type="text"
            register={register}
            name="tags"
            placeholder="Enter tags (comma separated)"
            error={errors.tags?.message}
          />
        </div>

        <Controller
          control={control}
          name="image"
          render={({ field, fieldState }) => (
            <FileInput
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              loading={uploading}
              // imageUrl={}
            />
          )}
        />

        <Button
          type="submit"
          loading={loading}
          className="bg-primary w-full text-white"
        >
          Add Collection
        </Button>
      </form>
    </div>
  )
}

export default AddCollectionModal
