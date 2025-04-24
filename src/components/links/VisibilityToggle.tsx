import { useToggleLinkVisibility } from "@/hooks/useLinkHooks"
import { cn } from "@/lib/cn"
import { LinkType } from "@/types/types"
import { Loader2 } from "lucide-react"
import React from "react"

const VisibilityToggle = ({ link }: { link: LinkType }) => {
  const { loading, visibility, toggleVisibility } =
    useToggleLinkVisibility(link)

  return (
    <div
      onClick={toggleVisibility}
      className={cn(
        "group bg-grey-3 flex min-h-4 min-w-8 cursor-pointer items-center rounded-full p-1 transition-colors duration-300",
        visibility === "public" && "bg-green/80"
      )}
    >
      <div
        className={cn(
          "grid min-h-3 min-w-3 transform place-content-center rounded-full bg-white shadow-sm transition-transform duration-300",
          visibility === "public" ? "translate-x-0" : "translate-x-full"
        )}
      >
        {loading && (
          <Loader2 className="text-text-primary w-2 h-2 animate-spin" />
        )}
      </div>
    </div>
  )
}

export default VisibilityToggle
