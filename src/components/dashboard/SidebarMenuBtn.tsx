"use client"
import { cn } from "@/lib/cn"
import { useAppState } from "@/store/useAppStore"
import { MenuIcon, X } from "lucide-react"
import React from "react"

const SidebarMenuBtn = ({ mode = "closed" }: { mode?: "open" | "closed" }) => {
  const { toggleSidebar, showSidebar } = useAppState()

  return (
    <button
      className={cn("lg:hidden", mode === "open" ? "" : "")}
      onClick={toggleSidebar}
    >
      {showSidebar ? (
        <X
          className={cn("text-text-secondary", mode === "closed" && "hidden")}
        />
      ) : (
        <MenuIcon
          className={cn("text-text-secondary", mode === "open" && "hidden")}
        />
      )}
    </button>
  )
}

export default SidebarMenuBtn
