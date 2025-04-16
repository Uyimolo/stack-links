import React from "react"
import { Paragraph } from "../global/Text"

const UserCard = () => {
  return (
    <div className="border-border-light bg-white/50 hover:bg-accent mx-6 flex h-16 items-center gap-2 overflow-hidden rounded-lg border p-2">
      {/* profile image */}
      <div className="bg-bg-dark aspect-square h-full rounded-full"></div>

      {/* user details */}
      <div className="w-[70%]">
        <Paragraph className="truncate">John Doe</Paragraph>
        <Paragraph className="truncate">
          Software Engineer
        </Paragraph>
      </div>
    </div>
  )
}

export default UserCard
