import React from "react";

const VisibilityBadge = ({ visibility }: { visibility: string }) => {
  return (
    <div className="flex">
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          visibility === "public"
            ? "bg-green-100 text-green-800"
            : visibility === "private"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
        }`}
      >
        {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
      </span>
    </div>
  );
};

export default VisibilityBadge;
