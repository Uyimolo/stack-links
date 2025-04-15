"use client"

import { auth } from "@/config/firebase"
import { useLinks } from "@/hooks/useLinkHooks"
import { Button } from "../global/Button"
import { Plus } from "lucide-react"
import { useAppState } from "@/store/useAppStateStore"
import { useSingleCollection } from "@/hooks/useCollectionHooks"
import LinkCard from "../links/LinkCard"
import { H2, Paragraph } from "../global/Text"
import DropdownSearch from "../dashboard/Searchbar"
import Empty from "../global/Empty"
import CollectionMockup from "./CollectionMockup"
import Loading from "../global/Loading"
import { LinkType } from "@/types/types"
import { useEffect, useState } from "react"
// import { useLinkStore } from "@/store/useLinkStore"

const Collection = ({ collectionId }: { collectionId: string }) => {
  const userId = auth.currentUser?.uid || ""
  const { links, loading } = useLinks(userId, collectionId)
  const { updateModal } = useAppState()
  const { collection } = useSingleCollection(userId, collectionId)

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
    <div className="items-start gap-6 px-4 pt-4 md:p-0 xl:flex">
      <div className="w-full space-y-6 rounded-xl bg-white p-4 md:rounded-none xl:max-w-2xl">
        <div className="w-full space-y-1">
          <H2 className="capitalize">{collection?.name}</H2>
          <Paragraph>
            Manage your links below. Add, edit, or remove them anytime.
          </Paragraph>
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-x-4 gap-y-4 md:flex-row">
          <DropdownSearch />

          <Button
            variant="outline"
            onClick={openAddLinkModal}
            className="ml-auto w-fit whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </div>

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
      </div>

      <div className="sticky top-4 hidden w-full max-w-sm xl:block">
        <CollectionMockup />
      </div>
    </div>
  )
}

export default Collection
