import { LinkType } from "@/types/types"
import DeleteLink from "./DeleteLink"
import { Paragraph } from "../global/Text"
import { X } from "lucide-react"
import TooltipComponent from "../global/TooltipComponent"
import { useAppState } from "@/store/useAppStore"
import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import UploadLinkImage from "./UploadLinkImage"
import LinkTags from "./LinkTags"

const LinkCardExtension = ({ link }: { link: LinkType }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    linkCardExtensionState: { extendedComponentVariant, linkId },
    updateLinkCardExtension,
    closeLinkCardExtension,
  } = useAppState()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeLinkCardExtension()
      }
    }

    if (extendedComponentVariant) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [extendedComponentVariant, closeLinkCardExtension])

  const Header = () => (
    <div className="bg-grey-3 relative p-2">
      <Paragraph className="text-text-primary text-center font-semibold capitalize">
        {extendedComponentVariant}
      </Paragraph>
      <TooltipComponent
        trigger={<X onClick={closeLinkCardExtension} />}
        content="Close"
        className="absolute top-1/2 right-4 -translate-y-1/2"
      />
    </div>
  )

  const renderExtendedComponent = () => {
    switch (extendedComponentVariant) {
      case "delete link":
        return (
          <>
            <Header />
            <DeleteLink link={link} />
          </>
        )
      case "share link":
        return (
          <>
            <Header />
          </>
        )
      case "upload link image":
        return (
          <>
            <Header />
            <UploadLinkImage link={link} />
          </>
        )
      case "view tags":
        return (
          <>
            <Header />
            <LinkTags link={link} />
          </>
        )
      default:
        return null
    }
  }

  const shouldRender = extendedComponentVariant !== null && link.id === linkId

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          key={`${extendedComponentVariant}-${link.id}`}
          ref={containerRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {renderExtendedComponent()}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LinkCardExtension
