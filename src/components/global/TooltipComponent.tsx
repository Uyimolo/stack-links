import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

interface TooltipComponentProps {
  trigger: React.ReactNode;
  content: string;
  className?: string;
}

const TooltipComponent = ({
  trigger,
  content,
  className,
}: TooltipComponentProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "grid h-6 px-1 place-content-center rounded hover:bg-[#f1f1f1]",
            className,
          )}
        >
          {trigger}
        </TooltipTrigger>
        <TooltipContent className="max-w-sm w-full">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;
