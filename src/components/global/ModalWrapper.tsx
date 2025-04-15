"use client"

import { useEffect } from "react"
import { useAppState } from "@/store/useAppStateStore"
import AddCollectionModal from "../collections/AddCollectionModal"
import UpdateCollectionModal from "../collections/UpdateCollectionModal"
import DeleteCollectionModal from "../collections/DeleteCollectionModal"
import AddLinkModal from "../links/AddLinkModal"
import { ScrollArea } from "../ui/scroll-area"
import DeleteLinkModal from "../links/DeleteLinkModal"

type ModalPropsMap = {
  "add collection": React.ComponentProps<typeof AddCollectionModal>
  "update collection": React.ComponentProps<typeof UpdateCollectionModal>
  "delete collection": React.ComponentProps<typeof DeleteCollectionModal>
  "add link": React.ComponentProps<typeof AddLinkModal>
  "delete link": React.ComponentProps<typeof DeleteLinkModal>

}

const MODAL_COMPONENTS: {
  [K in keyof ModalPropsMap]: React.FC<ModalPropsMap[K]>
} = {
  "add collection": AddCollectionModal,
  "update collection": UpdateCollectionModal,
  "delete collection": DeleteCollectionModal,
  "add link": AddLinkModal,
  "delete link": DeleteLinkModal,
}

function ModalWrapper() {
  const { modalState, closeModal } = useAppState()
  const { status, modalType, modalProps } = modalState

  useEffect(() => {
    document.body.style.overflow = status === "open" ? "hidden" : "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [status])

  if (status === "close" || !modalType) return null

  const ModalComponent = MODAL_COMPONENTS[modalType as keyof typeof MODAL_COMPONENTS]
  if (!ModalComponent) return null

  return (
    <div
      className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-black/40 px-4"
      onClick={closeModal}
    >
      <ScrollArea
        className="max-h-[90vh] rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalComponent
          {...{
            ...(modalProps ?? {}),
            collection: modalProps?.collection || {},
            collectionId: modalProps?.collectionId,
            link: modalProps?.link,
          }}
        />
      </ScrollArea>
    </div>
  )
}

export default ModalWrapper
