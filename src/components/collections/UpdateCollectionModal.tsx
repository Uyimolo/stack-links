"use client"
import { CollectionType } from "@/types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Input from "../global/Input"
import { Button } from "../global/Button"
import { useAppState } from "@/store/useAppStateStore"
import { X } from "lucide-react"
import { useCollectionActions } from "@/hooks/useCollectionHooks"

const schema = z.object({
  name: z
    .string()
    .min(3, "Collection name must be at least 3 characters")
    .optional(),
  description: z.string().optional(),
  visibility: z.enum(["public", "private", "unlisted"]).optional(),
  tags: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const UpdateCollectionModal = ({
  collection,
}: {
  collection: CollectionType
}) => {
  const { updateModal } = useAppState()
  const [error, setError] = useState<string | null>(null)
  const { editCollection } = useCollectionActions()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: collection.name,
      description: collection.description,
      visibility: collection.visibility,
      tags: collection.tags?.join(","),
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  const onSubmit = async (data: FormData) => {
    setError(null)

    try {
      const formattedTags = data.tags
        ? data.tags.split(",").map((tag) => tag.trim())
        : []
      await editCollection({
        collectionId: collection.id,
        name: data.name ?? "",
        description: data.description ?? "",
        visibility: data.visibility ?? "public",
        tags: formattedTags,
      })
      updateModal({ status: "close", modalType: null }) // Close modal on success
    } catch (err) {
      setError("Failed to update collection. Please try again.")
      console.error("Error updating collection:", err)
    }
  }

  return (
    <div className="w-[calc(100vw-48px)] max-w-sm rounded-lg bg-white p-6 shadow-lg md:max-w-md">
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-primary text-lg font-semibold">
          Update Collection
        </h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => updateModal({ status: "close", modalType: null })}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <Input
          register={register}
          label="Collection Name"
          name="name"
          placeholder="Enter collection name"
          error={errors.name?.message}
        />

        <Input
          type="textarea"
          register={register}
          name="description"
          placeholder="Enter collection description"
          error={errors.description?.message}
        />

        <div>
          <label className="text-sm font-medium text-gray-700">
            Visibility
          </label>
          <Select
            value={watch("visibility")}
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

        <Input
          type="text"
          register={register}
          name="tags"
          placeholder="Enter tags (comma separated)"
          error={errors.tags?.message}
        />

        <Button type="submit" className="bg-primary w-full text-white">
          Update Collection
        </Button>
      </form>
    </div>
  )
}

export default UpdateCollectionModal
