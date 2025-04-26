"use client";

import { auth } from "@/config/firebase";
import { useLinks } from "@/hooks/useLinkHooks";
import { useAppState } from "@/store/useAppStore";
import { useSingleCollection } from "@/hooks/useCollectionHooks";
import LinkCard from "../links/LinkCard";
import Empty from "../global/Empty";
import CollectionMockup from "./CollectionMockup";
import Loading from "../global/Loading";
import { LinkType } from "@/types/types";
import CollectionHeader from "./CollectionHeader";
import { Eye } from "lucide-react";
// import { useLinkStore } from "@/store/useLinkStore"

const Collection = ({ collectionId }: { collectionId: string }) => {
  const userId = auth.currentUser?.uid || "";
  const { links } = useLinks(userId, collectionId);
  const { updateModal } = useAppState();
  const { collection } = useSingleCollection(userId, collectionId);
  const name = collection?.name || "Collection Loading...";

  const openAddLinkModal = () => {
    updateModal({
      status: "open",
      modalType: "add link",
      modalProps: { collectionId },
    });
  };

  return (
    <div className="flex items-start">
      <div className="w-full">
        <CollectionHeader
          name={name}
          collectionId={collectionId}
          imageUrl={collection?.imageUrl}
        />

        <div className="items-start gap-6 p-4 xl:flex">
          <div className="w-full space-y-4">
            {links === undefined ? (
              <Loading className="h-[50vh]" loadingText="Getting your links" />
            ) : links.length === 0 ? (
              <Empty
                text="No links in this collection yet."
                buttonOnClick={openAddLinkModal}
                buttonText="Add your first link"
              />
            ) : (
              links.map((link: LinkType) => (
                <LinkCard key={link.id} link={link} />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="top-4 hidden w-full max-w-sm xl:block">
        <div className="fixed flex h-screen w-full max-w-sm items-center justify-center">
          <div className="">
            <CollectionMockup collectionId={collectionId} />
          </div>
        </div>
      </div>

      <div
        className="fixed xl:hidden right-2 bottom-10 grid aspect-square h-12 place-content-center rounded-full border bg-[#333333] p-2"
        onClick={() =>
          updateModal({
            status: "open",
            modalType: "view mockup",
            modalProps: { collectionId },
          })
        }
      >
        <button className="text-xs text-white">
          <Eye />
        </button>
      </div>
    </div>
  );
};

export default Collection;
