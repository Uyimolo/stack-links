import { auth } from "@/config/firebase";
import { useLinks } from "@/hooks/useLinkHooks";
import React from "react";
import { Paragraph } from "../global/Text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { MoreVertical } from "lucide-react";
import Loading from "../global/Loading";
import { ScrollArea } from "../ui/scroll-area";

const CollectionMockup = ({ collectionId }: { collectionId: string }) => {
  const userId = auth.currentUser?.uid || "";
  const { links } = useLinks(userId, collectionId);

  return (
    <div className="border-grey-2 mx-auto overflow-hidden flex aspect-[9/18] h-[90vh] max-h-[650px] justify-between flex-col space-y-4 rounded-3xl border-4 bg-[#111111] p-2 pb-0 xl:h-[75vh]">
      <div className="space-y-4">
        <div className="bg-grey-1 mx-auto h-3 w-3 rounded-full"></div>

        <div className="mx-auto aspect-square w-20 rounded-full border"></div>

        <Paragraph className="truncate text-center text-xs text-white">
          {"@" + auth.currentUser?.email || "Email loading..."}
        </Paragraph>
      </div>

      <ScrollArea className="h-full max-h-[40vh]">
        <div className=" space-y-2">
          {links === undefined && <Loading className="h-40" />}

          {links
            ?.filter((link) => link.visibility !== "private")
            .map((link, index) => (
              <div
                key={index}
                className="flex items-center gap-1 overflow-hidden rounded-full bg-white p-1"
              >
                <div
                  className="bg-grey-3 aspect-square w-12 rounded-full border bg-cover"
                  style={{ backgroundImage: `url(${link.imageUrl})` }}
                ></div>

                <Paragraph className="w-full text-center text-[11px] line-clamp-1 capitalize">
                  {link.title}
                </Paragraph>

                <DropdownMenu>
                  <DropdownMenuTrigger className="w-10">
                    <MoreVertical className="text-grey-1 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent></DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CollectionMockup;
