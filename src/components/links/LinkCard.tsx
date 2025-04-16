import { GripVertical } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLinkActions } from "@/hooks/useLinkHooks"
import { LinkType } from "@/types/types"
import EditableField from "./EditableField"
import LinkActions from "./LinkActions"
import Tags from "../global/Tags"
import { toast } from "sonner"
import Image from "next/image"
import placeholder from "@/assets/svgs/My-password-pana.svg"

const schema = z.object({
  url: z.string().url("Please enter a valid URL"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const LinkCard = ({ link }: { link: LinkType }) => {
  const { id, title, url, description, tags = [] } = link
  const { editLink } = useLinkActions()
  const [editField, setEditField] = useState<keyof FormData | null>(null)

  const {
    register,
    watch,
    formState: { errors },
    trigger, // Add trigger to validate specific fields
  } = useForm<FormData>({
    mode: "onBlur",
    resolver: zodResolver(schema),
    defaultValues: { title, url, description },
  })

  const handleSave = async (field: keyof FormData) => {
    // First validate the field
    const isValid = await trigger(field)

    if (!isValid) {
      // Show toast error if validation fails
      if (errors[field]?.message) {
        toast.error(errors[field]?.message as string)
      }
      return
    }

    const values = watch()

    const update: Partial<FormData> & { linkId: string } = { linkId: id }

    if (field === "title" && values.title !== title) update.title = values.title
    if (field === "url" && values.url !== url) update.url = values.url
    if (field === "description" && values.description !== description)
      update.description = values.description

    if (Object.keys(update).length > 1) {
      await editLink(update)
      toast.success("Saved successfully")
    }

    setEditField(null)
  }

  const values = watch()

  return (
    <div className="hover:border-primary group border-grey-3 w-full space-y-3 overflow-hidden rounded-xl border bg-white transition duration-300 group-hover:text-white">
      {/* header */}

      <div className="flex justify-between overflow-auto px-4 pt-4">
        <GripVertical className="text-muted-foreground w-4 cursor-grab p-0" />
        <div className="w-fit max-w-4/5">
          <Tags tags={tags} />
        </div>
      </div>

      {/* editable fields */}

      <div className="flex items-start gap-4 px-4">
        {/* link image */}
        <div className="bg-grey-3 aspect-square w-[20%] rounded-xl">
          <Image src={placeholder} alt="link image" />
        </div>
        <div className="border-grey borde bg-whit h-fit w-[80%] space-y-1 rounded-xl">
          <EditableField
            field="title"
            value={values.title}
            isEditing={editField === "title"}
            error={errors.title?.message}
            onEdit={() => setEditField("title")}
            onBlur={() => handleSave("title")}
            register={register}
            placeholder="link title"
          />

          <EditableField
            field="url"
            value={values.url}
            isEditing={editField === "url"}
            error={errors.url?.message}
            onEdit={() => setEditField("url")}
            onBlur={() => handleSave("url")}
            register={register}
            placeholder="link URL"
          />

          <EditableField
            field="description"
            value={values.description}
            isEditing={editField === "description"}
            error={errors.description?.message}
            onEdit={() => setEditField("description")}
            onBlur={() => handleSave("description")}
            register={register}
            placeholder="link description"
            type="textarea"
          />
        </div>
      </div>

      {/* footer */}
      <div className="px-4 bg-grey-4 pt-2 pb-3">
        <LinkActions link={link} />
      </div>
    </div>
  )
}

export default LinkCard
