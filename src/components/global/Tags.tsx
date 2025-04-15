import React, { useState } from "react"

const Tags = ({ tags }: { tags: string[] }) => {
  const [showAllTags, setShowAllTags] = useState(false)

  const visibleTags = showAllTags ? tags : tags?.slice(0, 2)

  return (
    <div>
      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex w-full items-center gap-1.5 overflow-auto">
          {visibleTags?.map((tag, index) => (
            <span
              key={index}
              className="bg-white border text-text-secondary rounded-full px-2.5 py-0.5 text-xs font-medium text-nowrap transition-colors hover:bg-gray-200"
            >
              {tag.trim()}
            </span>
          ))}
          {tags.length > 3 && !showAllTags && (
            <button
              onClick={() => setShowAllTags(true)}
              className="text-text-muted text-xs text-nowrap"
            >
              See More
            </button>
          )}
          {showAllTags && (
            <button
              onClick={() => setShowAllTags(false)}
              className="text-text-muted text-xs text-nowrap"
            >
              See Less
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Tags
