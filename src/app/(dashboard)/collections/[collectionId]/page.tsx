import Collection from "@/components/collections/Collection"

interface LinksPageProps {
  params: { collectionId: string }
}

const LinksPage = async ({ params }: LinksPageProps) => {
  const { collectionId } = await params
  return <Collection collectionId={collectionId} />
}

export default LinksPage
