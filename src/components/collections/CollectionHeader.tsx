"use client"
import { useAppState } from "@/store/useAppStore"
import DropdownSearch from "../dashboard/Searchbar"
import { Button } from "../global/Button"
import { Plus } from "lucide-react"
import { H1, Paragraph } from "../global/Text"
import collectionImage from "@/assets/svgs/Collection-pana.svg"
import Image from "next/image"

const CollectionHeader = ({
  name,
  collectionId,
}: {
  name: string
  collectionId: string
}) => {
  const { updateModal } = useAppState()

  return (
    <div className="space-y-4 p-4">
      <div className="bg-primary relative flex justify-between overflow-hidden rounded-xl p-4 lg:h-40">
        <div className="space-y-4 lg:w-1/2">
          <H1 className="font-semibold text-white capitalize md:font-bold">
            {name}
          </H1>
          <Paragraph className="text-grey-5 max-w-lg lg:text-lg">
            Manage your links below. Add, edit, or remove them anytime.
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
  )
}

export default CollectionHeader
