import { CollectionType } from "@/types/types"
import Link from "next/link"
import Tags from "../global/Tags"
import CollectionCardActions from "./CollectionCardActions"
import VisibilityBadge from "../global/VisibilityBadge"
import { H4, Paragraph } from "../global/Text"

const CollectionCard = ({ collection }: { collection: CollectionType }) => {
  const { id, name, description, visibility, imageUrl, tags = [] } = collection

  return (
    <Link
      href={`/collections/${id}`}
      className="group border-grey hover:border-grey-3 relative flex h-[210px] w-full flex-col justify-between rounded-lg border bg-cover px-4 py-3 transition-all duration-300 hover:shadow-sm lg:w-[calc(50%-8px)] xl:w-[calc(33%-8px)]"
    >
      <div className="space-y-3 gap-3 flex">
        <div
          className="aspect-square h-20 rounded-sm border bg-white bg-cover"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <div className="space-y-3">
          {/* name and actions */}
          <div className="flex w-full items-center justify-between gap-4">
            <H4 className="font-semibold capitalize">{name}</H4>
            <CollectionCardActions collection={collection} />
          </div>

          {description && (
            <Paragraph className="text-text-secondary line-clamp-3 h-16 font-light">
              {description}
            </Paragraph>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex h-fit flex-col gap-3">
        {/* Visibility Badge */}
        <VisibilityBadge visibility={visibility} />

        <Tags tags={tags} />
      </div>
    </Link>
  )
}

export default CollectionCard
