"use client"

import { auth } from "@/config/firebase"
import { useLinks } from "@/hooks/useLinkHooks"
import { useAppState } from "@/store/useAppStateStore"
import { useSingleCollection } from "@/hooks/useCollectionHooks"
import LinkCard from "../links/LinkCard"
import Empty from "../global/Empty"
import CollectionMockup from "./CollectionMockup"
import Loading from "../global/Loading"
import { LinkType } from "@/types/types"
import { useEffect, useState } from "react"
import CollectionHeader from "./CollectionHeader"
// import { useLinkStore } from "@/store/useLinkStore"

const Collection = ({ collectionId }: { collectionId: string }) => {
  const userId = auth.currentUser?.uid || ""
  const { links, loading } = useLinks(userId, collectionId)
  const { updateModal } = useAppState()
  const { collection } = useSingleCollection(userId, collectionId)
  const name = collection?.name || "Collection Loading..."

  // Track if we've completed the first load
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  const openAddLinkModal = () => {
    updateModal({
      status: "open",
      modalType: "add link",
      modalProps: { collectionId },
    })
  }

  useEffect(() => {
    // When loading finishes and we haven't marked first load as complete, do so
    if (!loading && !hasLoadedOnce) {
      setHasLoadedOnce(true)
    }
  }, [loading, hasLoadedOnce])

  return (
    <>
      <CollectionHeader name={name} />
      <div className="items-start gap-6 p-4 xl:flex">
        <div className="space-y-4">
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

        <div className="hidden w-full max-w-sm xl:sticky xl:top-4 xl:block">
          <CollectionMockup />
        </div>
      </div>
    </>
  )
}

export default Collection
