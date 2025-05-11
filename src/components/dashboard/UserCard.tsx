import React from "react";
import { Paragraph } from "../global/Text";
import { useAppState } from "@/store/useAppStore";
import { cn } from "@/lib/cn";

const UserCard = () => {
  const { showSidebar } = useAppState();
  return (
    <div
      className={cn(
        "border-grey-3 flex h-16 items-center gap-2 overflow-hidden rounded-lg borde bg-white",
        showSidebar ? "mx-4 p-2" : "mx-4 border-none bg-transparent p-0",
      )}
    >
      {/* profile image */}
      <div
        className={cn(
          "bg-grey-5 aspect-square h-full rounded-full",
          showSidebar ? "" : "md:w-full h-auto",
        )}
      ></div>

      {/* user details */}
      <div className={cn("w-[70%]", !showSidebar && "hidden")}>
        <Paragraph className="truncate text-xs">John Doe</Paragraph>
        <Paragraph className="truncate text-[11px]">
          Software Engineer
        </Paragraph>
      </div>
    </div>
  );
};

export default UserCard;
