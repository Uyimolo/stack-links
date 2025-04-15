import { UseFormRegister } from "react-hook-form"
import Input from "../global/Input"
import { Edit3 } from "lucide-react"
import TooltipComponent from "../global/TooltipComponent"
import { Paragraph } from "../global/Text"

type EditableFieldProps = {
  field: "title" | "url" | "description"
  value: string | undefined
  isEditing: boolean
  error?: string
  onEdit: () => void
  onBlur: () => void
  register: UseFormRegister<{
    title: string
    url: string
    description?: string | undefined
  }>
  placeholder?: string
  type?: "text" | "textarea"
}

const EditableField = ({
  field,
  value,
  isEditing,
  error,
  onEdit,
  onBlur,
  register,
  placeholder,
  type = "text",
}: EditableFieldProps) => {
  if (isEditing) {
    return (
      <Input
        // label={field}
        name={field}
        type={type}
        register={register}
        error={error}
        className={`text-text-secondary ${type === "textarea" ? "h-10" : "h-6"} w-full border-none bg-transparent p-0 text-sm outline-none focus:outline-none`}
        autoFocus
        onBlur={onBlur}
        placeholder={placeholder}
        rows={type === "textarea" ? 2 : undefined}
        resize={false}
      />
    )
  }

  return (
    <div className="flex w-full items-center gap-1 border-black">
      {field === "title" ? (
        <Paragraph
          className={`${type === "textarea" ? "line-clamp-2 h-10" : "line-clamp-1 h-6"} text-sm capitalize`}
          // variant="primary"
        >
          {value || "No value"}
        </Paragraph>
      ) : (
        <TooltipComponent
          content={value || "No value"}
          className="w-fit place-content-start border border-transparent text-left hover:bg-transparent"
          trigger={
            <Paragraph
              className={`${type === "textarea" ? "line-clamp-2 h-10" : "line-clamp-1 h-6"} text-sm`}
            >
              {value ||
                `${field === "description" ? "No description" : "No value"}`}
            </Paragraph>
          }
        />
      )}
      <Edit3
        onClick={onEdit}
        className="text-muted-foreground w-4 min-w-4 cursor-pointer"
      />
    </div>
  )
}

export default EditableField
