import { useCollections } from "./useCollectionHooks"
import { useAllLinks } from "./useLinkHooks"
import { useEffect, useState } from "react"
import { LinkType, CollectionType } from "@/types/types"

type SearchResults = {
  links: LinkType[]
  collections: CollectionType[]
  loading: boolean
  error: string | null
  searching: boolean
}

// Fuzzy match logic
const fuzzyMatch = (text: string | undefined, query: string): boolean => {
  if (!text) return false

  text = text.toLowerCase()
  query = query.toLowerCase()

  let textIndex = 0
  let queryIndex = 0

  while (textIndex < text.length && queryIndex < query.length) {
    if (text[textIndex] === query[queryIndex]) {
      queryIndex++
    }
    textIndex++
  }

  return queryIndex === query.length
}

// Relevance scoring
const getRelevanceScore = (
  item: unknown,
  searchTerm: string,
  fields: string[]
): number => {
  let score = 0
  const normalizedSearchTerm = searchTerm.toLowerCase()

  fields.forEach((field) => {
    // @ts-expect-error using unknown here intentionally
    const value = item[field]
    if (!value) return

    const normalizedValue = typeof value === "string" ? value.toLowerCase() : ""

    if (normalizedValue === normalizedSearchTerm) {
      score += 100
    } else if (
      typeof value === "string" &&
      normalizedValue.includes(normalizedSearchTerm)
    ) {
      score += 50
    } else if (
      typeof value === "string" &&
      fuzzyMatch(normalizedValue, normalizedSearchTerm)
    ) {
      let matchCount = 0
      let valueIndex = 0
      for (const char of normalizedSearchTerm) {
        const foundIndex = normalizedValue.indexOf(char, valueIndex)
        if (foundIndex !== -1) {
          valueIndex = foundIndex + 1
          matchCount++
        }
      }
      score += 20 * (matchCount / normalizedSearchTerm.length)
    }

    if (field === "tags" && Array.isArray(value)) {
      const hasMatchingTag = value.some((tag: string) => {
        const normalizedTag = tag.toLowerCase()
        return (
          normalizedTag.includes(normalizedSearchTerm) ||
          fuzzyMatch(normalizedTag, normalizedSearchTerm)
        )
      })
      if (hasMatchingTag) {
        score += 30
      }
    }
  })

  return score
}

// Main search hook
export const useSearch = (
  userId: string,
  searchTerm: string
): SearchResults => {
  const [searching, setSearching] = useState(false)

  const {
    allLinks,
    loading: allLinksLoading,
    error: allLinksError,
  } = useAllLinks(userId)

  const {
    collections,
    loading: allCollectionsLoading,
    error: allCollectionsError,
  } = useCollections(userId)

  const [searchResults, setSearchResults] = useState<{
    links: LinkType[]
    collections: CollectionType[]
  }>({
    links: [],
    collections: [],
  })

  useEffect(() => {
    setSearching(true)

    const timeoutId = setTimeout(() => {
      if (!searchTerm.trim()) {
        setSearchResults({ links: [], collections: [] })
        setSearching(false)
        return
      }

      const normalizedSearchTerm = searchTerm.toLowerCase().trim()

      const scoredLinks = allLinks
        .map((link) => ({
          link,
          score: getRelevanceScore(link, normalizedSearchTerm, [
            "title",
            "url",
            "description",
            "tags",
          ]),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)

      const scoredCollections = (collections ?? [])
        .map((collection) => ({
          collection,
          score: getRelevanceScore(collection, normalizedSearchTerm, [
            "name",
            "description",
            "tags",
          ]),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)

      setSearchResults({
        links: scoredLinks.map((item) => item.link),
        collections: scoredCollections.map((item) => item.collection),
      })

      setSearching(false)
    }, 500) // debounce duration

    return () => clearTimeout(timeoutId)
  }, [searchTerm, allLinks, collections])

  const loading = allLinksLoading || allCollectionsLoading
  const error = allLinksError || allCollectionsError

  return {
    links: searchResults.links,
    collections: searchResults.collections,
    loading,
    error,
    searching,
  }
}
