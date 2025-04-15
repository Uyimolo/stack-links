import { Trash, Share2, ImageIcon, BarChart2Icon } from "lucide-react"
import TooltipComponent from "../global/TooltipComponent"
import { LinkType } from "@/types/types"
import { useAppState } from "@/store/useAppStateStore"
import VisibilityToggle from "./VisibilityToggle"

const LinkActions = ({ link }: { link: LinkType }) => {
  const { updateModal } = useAppState()

  return (
    <div className="flex gap-3 pt-1 justify-between">
      <div className="flex gap-6">
        <TooltipComponent
          content="Delete link"
          trigger={
            <Trash
              onClick={() =>
                updateModal({
                  status: "open",
                  modalType: "delete link",
                  modalProps: { link },
                })
              }
              className="text-muted-foreground w-4 cursor-pointer"
            />
          }
        />
        <TooltipComponent
          content="Share link"
          trigger={
            <Share2 className="text-muted-foreground w-4 cursor-pointer" />
          }
        />
        <TooltipComponent
          content="Upload image"
          trigger={
            <ImageIcon className="text-muted-foreground w-4 cursor-pointer" />
          }
        />
        <TooltipComponent
          content="10 Clicks"
          trigger={
            <BarChart2Icon className="text-muted-foreground w-4 cursor-pointer" />
          }
        />
      </div>

      <VisibilityToggle link={link} />
    </div>
  )
}

export default LinkActions
