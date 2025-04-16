import Collection from "@/components/collections/Collection"

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>
}) {
  const { collectionId } = await params

  return <Collection collectionId={collectionId} />
}
