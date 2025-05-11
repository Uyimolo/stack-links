import { Trash, Share2, ImageIcon, BarChart2Icon, Tags } from "lucide-react";
import TooltipComponent from "../global/TooltipComponent";
import { LinkType } from "@/types/types";
import { useAppState } from "@/store/useAppStore";

const LinkActions = ({ link }: { link: LinkType }) => {
  const { id } = link;
  const { updateLinkCardExtension } = useAppState();

  return (
    <div className="flex flex-wrap justify-between bg-grey-  px-2 gap-6 border rounded-xl">
      <div className="flex items-center gap-6">
        <TooltipComponent
          content="Tags"
          className="justify-self-end"
          trigger={
            <Tags
              className="text-muted-foreground w-4 cursor-pointer"
              onClick={() => {
                updateLinkCardExtension("view tags", id);
              }}
            />
          }
        />

        <TooltipComponent
          content="Share link"
          trigger={
            <Share2
              onClick={() => {
                updateLinkCardExtension("share link", id);
              }}
              className="text-muted-foreground w-4 cursor-pointer"
            />
          }
        />
        <TooltipComponent
          content="Upload image"
          trigger={
            <ImageIcon
              className="text-muted-foreground w-4 cursor-pointer"
              onClick={() => {
                updateLinkCardExtension("upload link image", id);
              }}
            />
          }
        />
        <TooltipComponent
          content="Clicks"
          trigger={
            <BarChart2Icon className="text-muted-foreground w-4 cursor-pointer" />
          }
        />
      </div>

      <TooltipComponent
        content="Delete link"
        trigger={
          <Trash
            onClick={() => {
              updateLinkCardExtension("delete link", id);
            }}
            className="text-muted-foreground w-4 cursor-pointer"
          />
        }
      />
    </div>
  );
};

export default LinkActions;
