import Collection from "@/components/collections/Collection"

interface PageProps {
  params: {
    collectionId: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

const LinksPage = ({ params }: PageProps) => {
  const { collectionId } = params
  return <Collection collectionId={collectionId} />
}

export default LinksPage
