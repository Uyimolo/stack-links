import React from "react"
import CollectionMockup from "./CollectionMockup"
import { X } from "lucide-react"
import { useAppState } from "@/store/useAppStore"

const CollectionMockupModal = ({ collectionId }: { collectionId: string }) => {
  const { updateModal } = useAppState()
  return (
    <div className="relative grid h-[90vh] w-screen place-content-center">
      <button
        className="absolute right-4"
        onClick={() => updateModal({ status: "close", modalType: null })}
      >
        <X className="text-white" />
      </button>
      <CollectionMockup collectionId={collectionId} />
    </div>
  )
}

export default CollectionMockupModal
