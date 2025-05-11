"use client";

import { auth } from "@/config/firebase";
import { useLinkActions, useLinks } from "@/hooks/useLinkHooks";
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
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../global/SortableItem";
import { useEffect, useState } from "react";

const Collection = ({ collectionId }: { collectionId: string }) => {
  const userId = auth.currentUser?.uid || "";
  const { links } = useLinks(userId, collectionId);
  const { orderLinks } = useLinkActions();
  const { updateModal } = useAppState();
  const { collection } = useSingleCollection(collectionId);
  const name = collection?.name || "Collection Loading...";

  const [orderedLinks, setOrderedLinks] = useState<LinkType[]>([]);

  useEffect(() => {
    if (links?.length) setOrderedLinks(links);
  }, [links]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // delay drag until 5px movement
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // ms
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !orderedLinks) return;

    const oldIndex = orderedLinks.findIndex((l) => l.id === active.id);
    const newIndex = orderedLinks.findIndex((l) => l.id === over.id);
    const newOrder = arrayMove(orderedLinks, oldIndex, newIndex);

    // Update local state immediately
    setOrderedLinks(newOrder);

    try {
      await orderLinks(newOrder);
      console.log("Order successfully updated in firestore");
    } catch {
      console.log("Order not updated in firestore");
    }

    // try {
    //   // Then persist to Firestore
    //   const batch = writeBatch(db);
    //   newOrder.forEach((link, index) => {
    //     const ref = doc(db, 'allLinks', link.id);
    //     batch.update(ref, { order: index });
    //   });

    //   await batch.commit();
    //   console.log('Order successfully updated in Firestore');
    // } catch (error) {
    //   console.error('Failed to update order in Firestore:', error);
    //   // Optionally revert the local state if the Firestore update fails
    //   setOrderedLinks(links || []);
    // }
  };

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

        <div className="items-start gap-6 p-4 xl:flex ">
          <div className="w-full">
            {links === undefined ? (
              <Loading className="h-[50vh]" loadingText="Getting your links" />
            ) : links.length === 0 ? (
              <Empty
                text="No links in this collection yet."
                buttonOnClick={openAddLinkModal}
                buttonText="Add your first link"
              />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedLinks.map((link) => link.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {orderedLinks.map((link) => (
                      <SortableItem key={link.id} id={link.id}>
                        <LinkCard link={link} />
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      <div className="top-4 hidden w-full max-w-sm xl:block">
        <div className="fixed flex h-screen w-full max-w-sm items-center border-l justify-center">
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
