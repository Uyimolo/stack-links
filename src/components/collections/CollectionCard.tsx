import { CollectionType } from "@/types/types";
import Link from "next/link";
import Tags from "../global/Tags";
import CollectionCardActions from "./CollectionCardActions";
import VisibilityBadge from "../global/VisibilityBadge";
import { H4, Paragraph } from "../global/Text";

const CollectionCard = ({ collection }: { collection: CollectionType }) => {
  const { id, name, description, visibility, imageUrl, tags = [] } = collection;

  return (
    <div className="group border-grey hover:border-grey-3 group flex w-full flex-col overflow-hidden rounded-xl borde bg-cover transition-all duration-300 hover:scale-102 hover:shadow-xl ">
      {/* content */}
      <Link href={`/collections/${id}`} className=" p-2">
        {/* image */}
        <div
          className="bg-grey-4 aspect-square bg-cover bg-cente h-40 w-full rounded-xl bg-cove bg-no-repeat p-2"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="ml-auto w-fit">
            <VisibilityBadge visibility={visibility} />
          </div>
        </div>
        {/* name and actions */}
        <div className="flex px-2 w-full items-center justify-between gap-4">
          <H4 className="line-clamp-1 leading-none font-semibold capitalize">
            {name}
          </H4>
          <CollectionCardActions collection={collection} />
        </div>

        <Paragraph className="text-text-secondary px-2 line-clamp-3 h-10 borde font-light">
          {description?.trim() ||
            "This collection doesn't have a description yet. Click the actions dropdown icon to add one!"}
        </Paragraph>
      </Link>
      <div className="p-2">
        <Tags tags={tags} />
      </div>
    </div>
  );
};

export default CollectionCard;
