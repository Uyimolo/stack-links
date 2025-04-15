import { X } from "lucide-react"
import React from "react"
import { Button } from "../global/Button"
import { auth } from "@/config/firebase"
import { useAppState } from "@/store/useAppStateStore"
import { LinkType } from "@/types/types"
import { useLinkActions, useLinks } from "@/hooks/useLinkHooks"

const DeleteLinkModal = ({ link }: { link: LinkType }) => {
  const { id, collectionId, title } = link
  const userId = auth.currentUser?.uid || ""
  const { loading } = useLinks(userId, collectionId)
  const { removeLink } = useLinkActions()
  const { updateModal } = useAppState()

  const handleDelete = async () => {
    try {
      await removeLink(id)
      closeModal()
    } catch (error) {
      console.error(error)
    }
  }

  const closeModal = () => {
    updateModal({ status: "close", modalType: null })
    // Close the modal
  }
  return (
    <div className="w-[calc(100vw-48px)] max-w-sm rounded-lg bg-white p-6 shadow-lg md:max-w-md">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-primary text-lg font-semibold">
          Delete Collection
        </h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={closeModal}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-6">
        <p className="text-text-secondary text-sm">
          Are you sure you want to delete link &quot;
          <span className="font-bold">{title}</span>&quot;? This action cannot
          be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteLinkModal
