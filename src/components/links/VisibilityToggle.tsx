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
        "group flex h-5 w-9 cursor-pointer items-center rounded-full px-1 transition duration-300 ease-linear",
        visibility === "public" ? "bg-text-success" : "bg-black/20"
      )}
    >
      <div
        className={cn(
          "grid h-3.5 w-3.5 place-content-center overflow-hidden rounded-full bg-white p-1 transition duration-300 ease-linear",
          visibility === "private" ? "translate-x-0" : "translate-x-full"
        )}
      >
        {loading && <Loader2 className="text-text-primary w-3 animate-spin" />}
      </div>
    </div>
  )
}

export default VisibilityToggle
