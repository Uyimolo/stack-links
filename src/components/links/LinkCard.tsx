import { GripVertical } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLinkActions } from "@/hooks/useLinkHooks";
import { LinkType } from "@/types/types";
import EditableField from "./EditableField";
import LinkActions from "./LinkActions";
import { toast } from "sonner";
import VisibilityToggle from "./VisibilityToggle";
import LinkCardExtension from "./LinkCardExtension";

const schema = z.object({
  url: z.string().url("Please enter a valid URL"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const LinkCard = ({ link }: { link: LinkType }) => {
  const { id, title, url, description } = link;
  const { editLink } = useLinkActions();
  const [editField, setEditField] = useState<keyof FormData | null>(null);

  const {
    register,
    watch,
    formState: { errors },
    trigger, // Add trigger to validate specific fields
  } = useForm<FormData>({
    mode: "onBlur",
    resolver: zodResolver(schema),
    defaultValues: { title, url, description },
  });

  const handleSave = async (field: keyof FormData) => {
    const isValid = await trigger(field);

    if (!isValid) {
      if (errors[field]?.message) {
        toast.error(errors[field]?.message as string);
      }
      return;
    }

    const values = watch();

    const update: Partial<FormData> & { linkId: string } = { linkId: id };

    if (field === "title" && values.title !== title)
      update.title = values.title;
    if (field === "url" && values.url !== url) update.url = values.url;
    if (field === "description" && values.description !== description)
      update.description = values.description;

    if (Object.keys(update).length > 1) {
      await editLink(update);
      toast.success("Saved successfully");
    }

    setEditField(null);
  };

  const values = watch();

  return (
    <div className="hover:bg-grey-6/30 border-grey-7 bg-white overflow-hidden rounded-xl border shadow transition duration-300">
      <div className="group flex w-full  items-stretch gap-3 p-2 transition duration-300">
        {/* header */}
        <div className="grid min-h-full">
          <div
            className="h-4 bg-cover aspect-square mt-2"
            style={{ backgroundImage: `url(${link.favicon})` }}
          ></div>

          <GripVertical className="text-muted-foreground mb-4 w-4 cursor-grab" />
        </div>

        <div className="w-full space-y-3 pl-2 border-l">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-4">
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

              <VisibilityToggle link={link} />
            </div>

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
              placeholder="Link description"
              type="textarea"
            />
          </div>

          <div className="w-full">
            <LinkActions link={link} />
          </div>
        </div>
      </div>
      <LinkCardExtension link={link} />
    </div>
  );
};

export default LinkCard;
