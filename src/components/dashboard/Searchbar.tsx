import { useState, useRef, useEffect, ChangeEvent } from "react"
import { SearchIcon, Loader2, X } from "lucide-react"
import { useSearch } from "@/hooks/useSearch"
import { auth } from "@/config/firebase"
import { cn } from "@/lib/cn"

export default function DropdownSearch() {
  const userId = auth.currentUser?.uid || ""
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  // const [selectedIndex, setselectedIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  // const dropdownRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLUListElement | null>(null)
  const listItemRefs = useRef<(HTMLLIElement | null)[]>([]) as React.RefObject<
    (HTMLLIElement | null)[]
  >

  // Use the search hook to get links and collections
  const { links, collections, searching } = useSearch(
    userId,
    query
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const clearSearch = () => {
    setQuery("")
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    // Show dropdown when we have results and query is not empty
    if (query.trim() && (links.length > 0 || collections.length > 0)) {
      setIsOpen(true)
    } else if (!query.trim()) {
      setIsOpen(false)
    }
  }, [query, links, collections])

  useEffect(() => {
    // Scroll the highlighted item into view
    if (selectedIndex !== null && listRef.current) {
      const item = listRef.current.children[selectedIndex] as HTMLElement
      if (item) {
        item.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }
    }
  }, [selectedIndex])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim()) {
      // Open dropdown when typing
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  // Handle keyboard navigation
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    // const options = query === "" ? recentSearches : filteredClients || []
    const options = allItems

    if (options.length === 0) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setSelectedIndex((prev) => {
        const newIndex = prev < options.length - 1 ? prev + 1 : 0
        listItemRefs.current[newIndex]?.scrollIntoView({ block: "nearest" })
        return newIndex
      })
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setSelectedIndex((prev) => {
        const newIndex = prev > 0 ? prev - 1 : options.length - 1
        listItemRefs.current[newIndex]?.scrollIntoView({ block: "nearest" })
        return newIndex
      })
    } else if (event.key === "Enter" && selectedIndex !== -1) {
      setQuery(options[selectedIndex].name)
      setIsOpen(false)
    } else if (event.key === "Escape") {
      clearSearch()
    }
  }

  // const handleResultClick = (
  //   type: "link" | "collection",
  //   id: string,
  //   url?: string
  // ) => {
  //   if (type === "link" && url) {
  //     window.open(url, "_blank")
  //   } else if (type === "collection") {
  //     window.location.href = `/collections/${id}`
  //   }
  //   setIsOpen(false)
  // }

  const allItems: {
    type: "link" | "collection"
    id: string
    name: string
    url?: string
    description?: string
  }[] = [
    ...collections.map((collection) => ({
      type: "collection" as const,
      id: collection.id,
      name: collection.name,
      url: undefined,
      description: collection.description,
    })),
    ...links.map((link) => ({
      type: "link" as const,
      id: link.id,
      name: link.title,
      url: link.url,
      description: link.description,
    })),
  ]


  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="border-border-medium h-12 w-full rounded-lg border px-4 text-sm focus:ring-0 focus:ring-transparent"
          aria-haspopup="listbox"
        />
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          {searching ? (
            <Loader2 className="text-text-secondary h-5 w-5 animate-spin" />
          ) : !query ? (
            <SearchIcon className="text-text-secondary h-5 w-5" />
          ) : (
            <X className="text-text-secondary h-5 w-5" onClick={clearSearch} />
          )}
        </div>
      </div>

      {isOpen && (
        <ul
          ref={dropdownRef}
          id="dropdown-list"
          role="listbox"
          className={cn(
            "absolute z-10 mt-2 flex max-h-[260px] w-full flex-col overflow-auto rounded-md bg-white lg:overflow-hidden",
            allItems.length ? "border-border-medium border" : ""
          )}
        >
          {query !== "" &&
            allItems.map((item, index) => (
              <li
                key={item.id}
                className={`hover:bg-bg-light-grey border-b-border-light flex cursor-pointer items-stretch gap-2 border-b p-2 ${
                  selectedIndex === index
                    ? "lg:bg-bg-light-grey"
                    : "bg-transparent"
                }`}
                ref={(el) => {
                  listItemRefs.current[index] = el
                }}
              >
                <div className="flex flex-col space-y-1 p-2">
                  <span className="text-sm font-semibold">{item.name}</span>
                  <span className="line-clamp-1 text-xs text-gray-500">
                    {item.url || ""}
                  </span>
                  <span className="line-clamp-2 text-xs text-gray-500">
                    {item.description || ""}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
