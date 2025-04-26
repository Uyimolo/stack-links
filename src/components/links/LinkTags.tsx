import React, { useState } from "react";
import { Paragraph } from "../global/Text";
import { Button } from "../global/Button";
import { Loader2, Minus, Plus } from "lucide-react";
import { useLinkActions } from "@/hooks/useLinkHooks";
import { LinkType } from "@/types/types";
import { toast } from "sonner";

const MAX_TAG_LENGTH = 30;
const MAX_TAGS = 10;

const LinkTags = ({ link }: { link: LinkType }) => {
  const { id, tags = [] } = link;
  const { editLink, loading } = useLinkActions();
  const [showInput, setShowInput] = useState(false);
  const [newTag, setNewTag] = useState("");

  const updateTags = async (newTags: string[]) => {
    try {
      await editLink({ linkId: id, tags: newTags });
      setShowInput(false);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setShowInput(false);
    }
  };

  const removeTag = async (clickedTag: string) => {
    const updated = tags.filter((tag) => tag !== clickedTag);
    await updateTags(updated);
  };

  const addTag = async () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_TAG_LENGTH) {
      toast.error("Tag too long");
      return;
    }
    if (tags.includes(trimmed)) {
      toast.error("Duplicate tag");
      return;
    }
    if (tags.length >= MAX_TAGS) {
      toast.error("Too many tags");
      return;
    }

    const updated = [...tags, trimmed];
    setShowInput(false);
    await updateTags(updated);
    setNewTag("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTag();
    if (e.key === "Escape") {
      setShowInput(false);
      setNewTag("");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="bg-grey-4 group relative rounded-lg px-2 py-1"
        >
          <Paragraph className="text-xs">{tag}</Paragraph>
          <div
            onClick={() => removeTag(tag)}
            className="hover:bg-red bg-primary absolute -top-1.5 -right-1 grid aspect-square h-4 w-4 cursor-pointer place-content-center rounded-full"
          >
            {<Minus className="w-3 text-white" />}
          </div>
        </div>
      ))}

      {loading && (
        <div className="bg-grey-4 flex items-center gap-2 rounded-lg px-2 py-1 text-xs">
          {" "}
          <Loader2 className="w-3 animate-spin" /> {newTag}
        </div>
      )}

      {showInput ? (
        <input
          autoFocus
          className="h-fit w-24 px-2 py-1 text-xs"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onBlur={addTag}
          onKeyDown={handleKeyDown}
          placeholder="New tag"
        />
      ) : (
        <Button
          onClick={() => setShowInput(true)}
          variant="secondary"
          className="font-montserrat h-fit px-2 py-0.5 text-xs font-normal"
        >
          <Plus className="w-3" /> Add tag
        </Button>
      )}
    </div>
  );
};

export default LinkTags;
