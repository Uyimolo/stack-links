import { LinkType } from "@/types/types";
import { Paragraph } from "../global/Text";
import { Button } from "../global/Button";
import { useLinkActions } from "@/hooks/useLinkHooks";

const DeleteLink = ({ link }: { link: LinkType }) => {
  const { removeLink } = useLinkActions();

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="space-y-2">
        <Paragraph className="text-text-primary text-sm">
          Are you sure you want to{" "}
          <span className=" font-semibold">delete</span> this link? This action
          cannot be undone.
        </Paragraph>
        <Paragraph className="text-text-secondary text-sm">
          If you just want to remove the link from view without deleting it
          permanently, you can archive it instead.
        </Paragraph>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <Button className="w-full" onClick={() => removeLink(link.id)}>
          Permanently Delete
        </Button>
        <Button className="w-full" variant="secondary">
          Archive Instead
        </Button>
      </div>
    </div>
  );
};

export default DeleteLink;
