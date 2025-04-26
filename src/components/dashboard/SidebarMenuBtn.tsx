"use client";
import { cn } from "@/lib/cn";
import { useAppState } from "@/store/useAppStore";
import { PanelLeft } from "lucide-react";
import React from "react";

const SidebarMenuBtn = ({ mode = "closed" }: { mode?: "open" | "closed" }) => {
  const { toggleSidebar } = useAppState();

  return (
    <button
      className={cn("cursor-pointer", mode === "open" ? "" : "")}
      onClick={toggleSidebar}
    >
      <PanelLeft className={cn("text-grey-1", mode === "open" && "hidden")} />
    </button>
  );
};

export default SidebarMenuBtn;
