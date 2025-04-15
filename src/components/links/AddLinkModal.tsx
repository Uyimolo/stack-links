"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAppState } from "@/store/useAppStateStore"
import { Button } from "../global/Button"
import { X } from "lucide-react"
import Input from "../global/Input"
import { auth } from "@/config/firebase"
import { useLinkActions } from "@/hooks/useLinkHooks"
import { toast } from "sonner"

const schema = z.object({
  url: z.string().url("Please enter a valid URL"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().max(100, 'Description should be lesser than 101 character(s)').optional(),
  tags: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  collectionId: string
}

const AddLinkModal = ({ collectionId }: Props) => {
  // const userId = auth.currentUser?.uid || ""
  const { updateModal } = useAppState()
  const { addLink, loading } = useLinkActions()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  const onSubmit = async (data: FormData) => {
    const formattedTags = data.tags
      ? data.tags.split(",").map((tag) => tag.trim())
      : []

    const params = {
      collectionId,
      userId: auth.currentUser?.uid || "",
      url: data.url,
      title: data.title,
      description: data.description || "",
      tags: formattedTags,
    }

    try {
      await addLink(params)
      toast.success("Link added successfully!")
      updateModal({ status: "close", modalType: null })
    } catch (error) {
      console.error("Error adding link:", error)
      toast.error("Error adding link")
      updateModal({ status: "close", modalType: null })
    }
  }

  return (
    <div className="w-[calc(100vw-48px)] max-w-sm rounded-lg bg-white p-6 shadow-lg md:max-w-md">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-primary text-lg font-semibold">Add Link</h2>
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
            label="URL"
            name="url"
            placeholder="https://example.com"
            error={errors.url?.message}
          />
        </div>

        <div>
          <Input
            register={register}
            label="Title"
            name="title"
            placeholder="Link title"
            error={errors.title?.message}
          />
        </div>

        <div>
          <Input
            type="textarea"
            register={register}
            name="description"
            placeholder="Optional description"
            error={errors.description?.message}
          />
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

        <Button
          type="submit"
          loading={loading}
          className="bg-primary w-full text-white"
        >
          Add Link
        </Button>
      </form>
    </div>
  )
}

export default AddLinkModal
