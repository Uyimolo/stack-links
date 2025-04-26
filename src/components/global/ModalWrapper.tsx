"use client";

import { useEffect } from "react";
import { useAppState } from "@/store/useAppStore";
import AddCollectionModal from "../collections/AddCollectionModal";
import UpdateCollectionModal from "../collections/UpdateCollectionModal";
import DeleteCollectionModal from "../collections/DeleteCollectionModal";
import AddLinkModal from "../links/AddLinkModal";
import DeleteLinkModal from "../links/DeleteLinkModal";
import { ScrollArea } from "../ui/scroll-area";
import CollectionMockupModal from "../collections/CollectionMockupModal";

function ModalWrapper() {
  const { modalState, closeModal } = useAppState();
  const { status, modalType, modalProps } = modalState;

  useEffect(() => {
    document.body.style.overflow = status === "open" ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [status]);

  if (status === "close" || !modalType) return null;

  const renderModal = () => {
    switch (modalType) {
      case "add collection":
        return <AddCollectionModal />;
      case "update collection":
        if (!modalProps?.collection) return null;
        return <UpdateCollectionModal collection={modalProps.collection} />;
      case "delete collection":
        if (!modalProps?.collectionId) return null;
        return <DeleteCollectionModal collection={modalProps.collection} />;
      case "add link":
        if (!modalProps?.collectionId) return null;
        return <AddLinkModal collectionId={modalProps.collectionId} />;
      case "delete link":
        if (!modalProps?.link) return null;
        return <DeleteLinkModal link={modalProps.link} />;
      case "view mockup":
        if (!modalProps?.collectionId) return null;
        return <CollectionMockupModal collectionId={modalProps.collectionId} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-black/60 px-4"
      onClick={closeModal}
    >
      <ScrollArea
        className="h-full max-h-[90vh] rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {renderModal()}
      </ScrollArea>
    </div>
  );
}

export default ModalWrapper;
