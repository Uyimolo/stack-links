"use client";
import { useAppState } from "@/store/useAppStore";
import DropdownSearch from "../dashboard/Searchbar";
import { Button } from "../global/Button";
import { Plus } from "lucide-react";
import { H1, Paragraph } from "../global/Text";
import collectionImage from "@/assets/svgs/Collection-pana.svg";
import Image from "next/image";

const CollectionsHeader = () => {
  const { updateModal } = useAppState();

  return (
    <div className="space-y-4">
      <div className="bg-primary relative flex justify-between overflow-hidden rounded-xl p-4 lg:h-40">
        <div className="space-y-4 lg:w-1/2">
          <H1 className="font-semibold text-white md:font-bold">
            {" "}
            Your Collections
          </H1>
          <Paragraph className="text-grey-5 max-w-lg lg:text-base">
            Manage your collections below. Add, edit, or remove links — then
            share them with the world.
          </Paragraph>
        </div>

        <Image
          className="-top-4 max-w-[100px] lg:absolute lg:right-4 lg:max-w-xs"
          src={collectionImage}
          alt="lady arranging picture frames collection"
        />
      </div>

      <div className="flex w-full flex-row gap-1 lg:gap-4">
        <DropdownSearch />
        <Button
          // variant="outline"
          onClick={() =>
            updateModal({ status: "open", modalType: "add collection" })
          }
          className="mr-0 ml-auto w-fit px-4 whitespace-nowrap"
        >
          <Plus />
          <span className="hidden lg:block"> Add Collection</span>
        </Button>
      </div>
    </div>
  );
};

export default CollectionsHeader;
