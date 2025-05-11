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
import { useState } from "react";
import { Paragraph } from "../global/Text";

const schema = z.object({
  url: z.string().url("Please enter a valid URL"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters")
    .max(500, "Description must be at most 500 characters")
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

  const [showMetaDataInputs, setShowMetaDataInputs] = useState(false);
  const [autoFill, setAutoFill] = useState(true);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [manualEdit, setManualEdit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const validateURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAutoFillMetadata = async () => {
    const url = watch("url");

    if (!url) {
      toast.error("Please enter a URL first");
      return;
    }

    if (!validateURL(url)) {
      toast.error("Invalid URL format");
      return;
    }

    if (!autoFill || manualEdit) {
      return;
    }

    try {
      setMetadataLoading(true);

      const response = await fetch("/api/generate-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch metadata");
      }

      const { title, description } = await response.json();

      setValue("title", title || "");
      setValue("description", description || "");
      setShowMetaDataInputs(true);
      setAutoFill(false);
    } catch (error) {
      console.error(error);
      toast.error("Metadata scraping failed. Please enter manually.");
      setShowMetaDataInputs(true);
      setAutoFill(false);
    } finally {
      setMetadataLoading(false);
    }
  };

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
    }

    const params = {
      linkId,
      collectionId,
      userId,
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
          onBlur={handleAutoFillMetadata}
        />

        {showMetaDataInputs ? (
          <div className="space-y-4">
            <Input
              register={register}
              label="Title"
              name="title"
              placeholder="Link title"
              error={errors.title?.message}
              onChange={() => setManualEdit(true)}
            />

            <Input
              type="textarea"
              register={register}
              name="description"
              placeholder="Optional description"
              error={errors.description?.message}
              label="Description"
              onChange={() => setManualEdit(true)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {metadataLoading ? (
              <Paragraph className="text-center text-gray-500">
                Fetching metadata...
              </Paragraph>
            ) : (
              <>
                <Paragraph>
                  Metadata (Title and Description) will be auto generated from
                  URL
                </Paragraph>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setShowMetaDataInputs(true);
                    setAutoFill(false);
                  }}
                >
                  Cancel auto metadata generation
                </Button>
              </>
            )}
          </div>
        )}

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
            />
          )}
        />

        <Button
          type="submit"
          loading={loading || metadataLoading}
          disabled={metadataLoading}
          className="bg-primary w-full text-white"
        >
          {metadataLoading ? "Scraping metadata..." : "Add Link"}
        </Button>
      </form>
    </div>
  );
};

export default AddLinkModal;
