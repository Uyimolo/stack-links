import { CollectionType } from "@/types/types";
import Link from "next/link";
import Tags from "../global/Tags";
import CollectionCardActions from "./CollectionCardActions";
import VisibilityBadge from "../global/VisibilityBadge";
import collectionImage from "@/assets/svgs/Collection-pana.svg";
import { H4, Paragraph } from "../global/Text";

const CollectionCard = ({ collection }: { collection: CollectionType }) => {
  const { id, name, description, visibility, imageUrl, tags = [] } = collection;

  return (
    <div className="group border-1 border-grey-7 shadow p-1 bg-white hover:border-grey-3 borde  group flex w-full flex-col overflow-hidden rounded-xl borde bg-cover transition-all duration-300 hover:scale-102 hover:shadow-xl ">
      {/* content */}
      <Link href={`/collections/${id}`} className="">
        {/* image */}
        <div
          className="bg-white border aspect-square mb-2 bg-cover bg-cente h-40 w-full rounded-xl bg-cove bg-no-repeat p-2"
          style={{ backgroundImage: `url(${imageUrl || collectionImage.src})` }}
        >
          <div className="ml-auto w-fit">
            <VisibilityBadge visibility={visibility} />
          </div>
        </div>
        {/* name and actions */}
        <div className="flex px-2 w-full items-center justify-between gap-4">
          <H4 className="line-clamp-1 font-semibold capitalize">{name}</H4>
          <CollectionCardActions collection={collection} />
        </div>

        <Paragraph className="text-text-secondary px-2 line-clamp-3 h-10 font-light">
          {description?.trim() ||
            "This collection doesn't have a description yet. Click the actions dropdown icon to add one!"}
        </Paragraph>
      </Link>
      <div className="p-2 mt-1">
        <Tags tags={tags} />
      </div>
    </div>
  );
};

export default CollectionCard;
