import empty from "@/assets/svgs/Empty-amico.svg";
import Image from "next/image";
import { Paragraph } from "./Text";
import { Button } from "./Button";
import { Plus } from "lucide-react";

const Empty = ({
  text,
  buttonText,
  buttonOnClick,
}: {
  text: string;
  buttonText: string;
  buttonOnClick: () => void;
}) => {
  return (
    <div className="space-y-4">
      <Image
        src={empty}
        alt="Empty resource"
        className="mx-auto w-full max-w-[280px] md:w-2/5 md:max-w-sm"
        priority
      />
      <Paragraph className="text-center text-base">{text}</Paragraph>
      <Button onClick={buttonOnClick} className="mx-auto w-full max-w-xs">
        <Plus />
        {buttonText}
      </Button>
    </div>
  );
};

export default Empty;
