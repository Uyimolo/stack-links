import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useShare } from "@/hooks/useShare";
import { stopPropagation } from "@/lib/utils";
import { useAppState } from "@/store/useAppStore";
import { CollectionType } from "@/types/types";

import { Ellipsis, Trash, Edit, Link2, Share2Icon } from "lucide-react";
import Link from "next/link";

const CollectionCardActions = ({
  collection,
}: {
  collection: CollectionType;
}) => {
  const { name, id } = collection;

  const { updateModal } = useAppState();
  const { shareContent } = useShare();

  const handleEditClick = () => {
    updateModal({
      status: "open",
      modalType: "update collection",
      modalProps: { collection },
    });
  };

  // useEffect(() => {
  //   console.log(collection)
  // }, [collection])
  const handleDeleteClick = () => {
    updateModal({
      status: "open",
      modalType: "delete collection",
      modalProps: { collection },
    });
  };

  const handleShareClick = () => {
    shareContent(
      `Check out this collection: ${name.toLocaleUpperCase()}`,
      collection.description ||
        `Here's a collection I think you'll find useful.`,
      `/collections/${id}`,
    );
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
          aria-label="Collection options"
        >
          <Ellipsis className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={(e) => {
            stopPropagation(e);
            handleEditClick();
          }}
          className="group text-text-secondary hover:bg-bg-light flex items-center gap-2"
        >
          <Edit className="group-hover:text-text-accent h-4 w-4" />
          <span className="group-hover:text-text-accent text-sm">Edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            stopPropagation(e);
            handleDeleteClick();
          }}
          className="group text-text-secondary flex items-center gap-2 hover:bg-red-100"
        >
          <Trash className="h-4 w-4 group-hover:text-red-500" />
          <span className="text-sm group-hover:text-red-500">Delete</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            stopPropagation(e);
            handleShareClick();
          }}
          className="group text-text-secondary hover:bg-bg-light flex items-center gap-2"
        >
          <Share2Icon className="group-hover:text-text-accent h-4 w-4" />
          <span className="group-hover:text-text-accent text-sm">Share</span>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={`/collections/${collection.id}`}
            className="group text-text-secondary hover:bg-bg-light flex items-center gap-2"
          >
            <Link2 className="group-hover:text-text-accent h-4 w-4" />
            <span className="group-hover:text-text-accent text-sm">
              View Links
            </span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CollectionCardActions;
