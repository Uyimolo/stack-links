"use client"
import CollectionsHeader from "./CollectionsHeader"
import { useCollections } from "@/hooks/useCollectionHooks"
import { auth } from "@/config/firebase"
import CollectionCard from "./CollectionCard"
import Empty from "../global/Empty"
import { useAppState } from "@/store/useAppStateStore"
import Loading from "../global/Loading"
import { H1 } from "../global/Text"

const Collections = () => {
  const { collections } = useCollections(auth.currentUser?.uid || "")
  const { updateModal } = useAppState()
  return (
    <div className="min-h-[83vh] bg-white p-4">
      {/* collections header */}
      <CollectionsHeader />

      <div className="pt-6">
        {collections === undefined ? (
          <Loading className="h-[50vh]" loadingText="Getting your links" />
        ) : collections.length ? (
          <div className="flex flex-wrap gap-3">
            {collections?.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <div className="w-full">
            <Empty
              text={`You don't have any collections yet.`}
              buttonOnClick={() =>
                updateModal({ status: "open", modalType: "add collection" })
              }
              buttonText="Create your first collection"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Collections
