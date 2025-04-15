import Collection from "@/components/collections/Collection"

const LinksPage = async ({ params }: { params: { collectionId: string } }) => {
  const { collectionId } = await params
  return <Collection collectionId={collectionId} />
}

export default LinksPage
