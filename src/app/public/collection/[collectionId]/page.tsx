import Collection from "@/components/public/Collection";

const PublicCollectionPage = async ({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) => {
  const { collectionId } = await params;

  return (
    <div>
      <Collection collectionId={collectionId} />
    </div>
  );
};

export default PublicCollectionPage;
