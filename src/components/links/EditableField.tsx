import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/global/Input";
import { Edit3 } from "lucide-react";
import TooltipComponent from "../global/TooltipComponent";
import { Paragraph } from "../global/Text";

type EditableFieldProps = {
  field: "title" | "url" | "description";
  value: string | undefined;
  isEditing: boolean;
  error?: string;
  onEdit: () => void;
  onBlur: () => void;
  register: UseFormRegister<{
    title: string;
    url: string;
    description?: string | undefined;
  }>;
  placeholder?: string;
  type?: "text" | "textarea";
};

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
    );
  }

  return (
    <div
      className={`flex border-black ${type === "textarea" ? "h-10" : "h-6 items-center"} w-full gap-1`}
    >
      {field === "title" ? (
        <Paragraph
          className={`${type === "textarea" ? "line-clamp-2" : "line-clamp-1"} w-fit text-text-primary text-sm capitalize`}
          // variant="primary"
        >
          {value || "No value"}
        </Paragraph>
      ) : (
        <TooltipComponent
          content={value || "No value"}
          className="border border-transparent h-fit text-left hover:bg-transparent p-0"
          trigger={
            <Paragraph
              className={`${type === "textarea" ? "line-clamp-2" : "line-clamp-1"} text-sm`}
            >
              {value ||
                `${field === "description" ? "Add description" : "Add link address"}`}
            </Paragraph>
          }
        />
      )}
      <Edit3
        onClick={onEdit}
        className="text-muted-foreground w-4 min-w-4 cursor-pointer"
      />
    </div>
  );
};

export default EditableField;
