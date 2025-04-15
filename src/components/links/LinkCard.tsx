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
    <div className="hover:border-primary group w-full space-y-3 rounded-xl border border-transparent bg-bg-very-light-grey px-3 py-3 transition duration-300 group-hover:text-white">
      {/* header */}

      <div className="flex justify-between overflow-auto">
        <GripVertical className="text-muted-foreground w-4 cursor-grab p-0" />
        <div className="w-fit max-w-4/5">
          <Tags tags={tags} />
        </div>
      </div>

      {/* editable fields */}
      <div className="space-y-1 rounded-xl bg-white p-3">
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

        {/* <Input
              // label="Title"
              name="title"
              placeholder="Link title"
              error={errors.title?.message}
              register={register}
              className="bg-white"
              onBlur={() => handleSave("title")}
            />

            <Input
              // label="Url"
              name="url"
              placeholder="Link Address"
              error={errors.title?.message}
              register={register}
              className="bg-white"
              onBlur={() => handleSave("url")}
            /> */}
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

        {/* <Input
            // label="Url"
            name="description"
            placeholder="Link Description"
            error={errors.description?.message}
            register={register}
            className="bg-white overflow-hidden"
            rows={1}
            type="textarea"
            onBlur={() => handleSave("description")}
          /> */}
      </div>

      {/* footer */}
      <LinkActions link={link} />
    </div>
  )
}

export default LinkCard
