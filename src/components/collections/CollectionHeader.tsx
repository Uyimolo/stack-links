"use client";
import { useAppState } from "@/store/useAppStore";
import DropdownSearch from "../dashboard/Searchbar";
import { Button } from "../global/Button";
import { Plus } from "lucide-react";
import { H1, Paragraph } from "../global/Text";
import collectionImage from "@/assets/svgs/Collection-pana.svg";

const CollectionHeader = ({
  name,
  collectionId,
  imageUrl,
}: {
  name: string;
  collectionId: string;
  imageUrl?: string;
}) => {
  const { updateModal } = useAppState();

  return (
    <div className=" space-y-4 p-4 ">
      <div className="relative flex w-full overflow-hidden bg-primary h-40  justify-between  rounded-xl">
        <div className="space-y-4 p-4">
          <H1 className="font-semibold text-white capitalize md:font-bold">
            {name}
          </H1>
          <Paragraph className="max-w-sm text-white xl:text-lg">
            Manage your links below. Add, edit, or remove them anytime.
          </Paragraph>
        </div>

        <div className="w-1/2 p-2">
          <div
            className=" h-full bg-contain bg-right w-full rounded-lg bg-no-repeat"
            style={{
              backgroundImage: `url(${imageUrl ? imageUrl : collectionImage.src})`,
            }}
          ></div>
        </div>
      </div>

      <div className="flex w-full flex-row gap-1 lg:gap-4">
        <DropdownSearch />
        <Button
          variant="outline"
          onClick={() =>
            updateModal({
              status: "open",
              modalType: "add link",
              modalProps: { collectionId },
            })
          }
          className="mr-0 ml-auto w-fit px-4 whitespace-nowrap"
        >
          <Plus />
          <span className="hidden lg:block"> Add Link</span>
        </Button>
      </div>
    </div>
  );
};

export default CollectionHeader;
