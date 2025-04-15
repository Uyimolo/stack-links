"use client"
import { useAppState } from "@/store/useAppStateStore"
import DropdownSearch from "../dashboard/Searchbar"
import { Button } from "../global/Button"
import { Plus } from "lucide-react"
import { H2, Paragraph } from "../global/Text"

const CollectionsHeader = () => {
  const { updateModal } = useAppState()

  return (
    <div className="space-y-4">
      <div>
        <H2 className="underline-offset-4">Your Collections</H2>
        <Paragraph className="text-base max-w-4xl">
          Manage your collections below. Add, edit, or remove links — then share
          them with the world.
        </Paragraph>
      </div>

      <div className="flex w-full flex-col gap-4 md:flex-row">
        <DropdownSearch />
        <Button
          variant="outline"
          onClick={() =>
            updateModal({ status: "open", modalType: "add collection" })
          }
          className="mr-0 ml-auto w-fit px-4 whitespace-nowrap"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Collection
        </Button>
      </div>
    </div>
  )
}

export default CollectionsHeader
