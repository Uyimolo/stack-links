import { cn } from "@/lib/cn";
import React from "react";

const Loading = ({
  loadingText = "",
  className = "",
}: {
  loadingText?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex w-full h-screen items-center justify-center",
        className,
      )}
    >
      <div className="text-center">
        <div className="border-primary/50 mx-auto mb-4 h-20 w-20 animate-spin rounded-full border-10 border-t-transparent lg:h-32 lg:w-32"></div>

        <p className="text-text-muted text-base">{loadingText}</p>
      </div>
    </div>
  );
};

export default Loading;
