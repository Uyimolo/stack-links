"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppState } from "@/store/useAppStore";
import { Button } from "../global/Button";
import { X } from "lucide-react";
import { FileInput, Input } from "@/components/global/Input";
import { auth } from "@/config/firebase";
import { useLinkActions } from "@/hooks/useLinkHooks";
import { toast } from "sonner";
import { useCloudinaryUpload } from "@/hooks/useCloudinary";

const schema = z.object({
  url: z.string().url("Please enter a valid URL"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z
    .string()
    .max(100, "Description should be lesser than 101 character(s)")
    .optional(),
  tags: z.string().optional(),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) => file.type.startsWith("image/"),
      "Only image files allowed",
    )
    .optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  collectionId: string;
}

const AddLinkModal = ({ collectionId }: Props) => {
  const userId = auth.currentUser?.uid || "";
  const { upload, loading: uploading, error } = useCloudinaryUpload();
  const { updateModal } = useAppState();
  const { addLink, loading } = useLinkActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    const formattedTags = data.tags
      ? data.tags.split(",").map((tag) => tag.trim())
      : [];

    let imageUrl = "";
    const linkId = crypto.randomUUID();

    if (data.image) {
      const publicId = `links/${userId}-${linkId}`;
      const result = await upload(data.image, publicId);

      if (!result || error) {
        toast.error("Image upload failed");
        return;
      }

      imageUrl = result;
      console.log(imageUrl);
    }

    const params = {
      linkId,
      collectionId,
      userId: auth.currentUser?.uid || "",
      url: data.url,
      title: data.title,
      description: data.description || "",
      tags: formattedTags,
      imageUrl,
    };

    try {
      await addLink(params);
      toast.success("Link added successfully!");
      updateModal({ status: "close", modalType: null });
    } catch (error) {
      console.error("Error adding link:", error);
      toast.error("Error adding link");
      updateModal({ status: "close", modalType: null });
    }
  };

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
        <Input
          register={register}
          label="URL"
          name="url"
          placeholder="https://example.com"
          error={errors.url?.message}
        />

        <Input
          register={register}
          label="Title"
          name="title"
          placeholder="Link title"
          error={errors.title?.message}
        />

        <Input
          type="textarea"
          register={register}
          name="description"
          placeholder="Optional description"
          error={errors.description?.message}
          label="Description"
        />

        <Input
          label="Tags"
          type="text"
          register={register}
          name="tags"
          placeholder="Enter tags (comma separated)"
          error={errors.tags?.message}
        />

        <Controller
          control={control}
          name="image"
          render={({ field, fieldState }) => (
            <FileInput
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              loading={uploading}
              // imageUrl={""}
            />
          )}
        />

        <Button
          type="submit"
          loading={loading}
          className="bg-primary w-full text-white"
        >
          Add Link
        </Button>
      </form>
    </div>
  );
};

export default AddLinkModal;
