import { CollectionType } from "@/types/types"
import Link from "next/link"
import Tags from "../global/Tags"
import CollectionCardActions from "./CollectionCardActions"
import VisibilityBadge from "../global/VisibilityBadge"
import { H4, Paragraph } from "../global/Text"

const CollectionCard = ({ collection }: { collection: CollectionType }) => {
  const { id, name, description, visibility, tags = [] } = collection

  return (
    <Link
      href={`/collections/${id}`}
      className="group bg-white relative flex h-[210px] w-full flex-col gap-2 rounded-lg border border-gray-200 px-4 py-3 transition-all duration-300 hover:border-gray-300 hover:shadow-sm md:w-[calc(50%-8px)] lg:w-[calc(50%-8px)] xl:w-[calc(33%-8px)]"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <H4 className="capitalize">{name}</H4>

        <CollectionCardActions collection={collection} />
      </div>

      {description && (
        <Paragraph className="line-clamp-3 h-16" size="sm">
          {description}
        </Paragraph>
      )}

      {/* Footer */}
      <div className="mt-3 flex flex-col gap-3">
        {/* Visibility Badge */}
        <VisibilityBadge visibility={visibility} />

        <Tags tags={tags} />
      </div>
    </Link>
  )
}

export default CollectionCard
