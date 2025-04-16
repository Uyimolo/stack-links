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

/**
 * Enhanced fuzzy matching algorithm with character proximity consideration
 * Returns both if it matched and a quality score for the match
 */
const improvedFuzzyMatch = (
  text: string | undefined,
  query: string
): { matched: boolean; score: number } => {
  if (!text) return { matched: false, score: 0 }

  text = text.toLowerCase()
  query = query.toLowerCase()

  if (query.length === 0) return { matched: true, score: 1 }
  if (query.length > text.length) return { matched: false, score: 0 }

  // Exact match is best case
  if (text === query) return { matched: true, score: 1 }

  // Direct substring match is next best
  if (text.includes(query)) {
    // Prioritize matches at the beginning of the text
    const position = text.indexOf(query)
    const positionPenalty = position / text.length
    return { matched: true, score: 0.9 - positionPenalty * 0.1 }
  }

  // Fuzzy match with character proximity scoring
  let textIndex = 0
  let queryIndex = 0
  let lastMatchDistance = 0
  let totalMatchDistance = 0
  let matchCount = 0

  while (textIndex < text.length && queryIndex < query.length) {
    if (text[textIndex] === query[queryIndex]) {
      // If this isn't the first match, calculate distance since last match
      if (matchCount > 0) {
        totalMatchDistance += lastMatchDistance
      }
      lastMatchDistance = 0
      matchCount++
      queryIndex++
    } else {
      lastMatchDistance++
    }
    textIndex++
  }

  const matched = queryIndex === query.length
  if (!matched) return { matched: false, score: 0 }

  // Calculate score based on:
  // 1. How many characters needed to be traversed (proximity)
  // 2. The ratio of query length to text length
  const proximityScore =
    matchCount > 1
      ? 1 - Math.min(totalMatchDistance / (text.length * 2), 0.9)
      : 0.1

  const lengthRatio = query.length / text.length

  // Combine scores with weights
  const score = proximityScore * 0.7 + lengthRatio * 0.3

  return { matched, score: Math.min(score, 0.8) } // Cap at 0.8 to keep below substring matches
}

/**
 * Detects if a match happens at word boundaries
 * Word boundaries are spaces, punctuation, or string boundaries
 */
const isWordBoundaryMatch = (text: string, term: string): boolean => {
  const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // Escape regex special chars
  const wordBoundaryRegex = new RegExp(
    `(^|[\\s.,;:!?-])${escapedTerm}($|[\\s.,;:!?-])`,
    "i"
  )
  return wordBoundaryRegex.test(text)
}

/**
 * Improved relevance scoring with weighted fields and advanced scoring techniques
 */
const improvedRelevanceScore = (
  item: unknown,
  searchTerm: string,
  fields: Array<{ field: string; weight: number }>
): number => {
  let totalScore = 0
  const normalizedSearchTerm = searchTerm.toLowerCase().trim()
  const searchTerms = normalizedSearchTerm
    .split(/\s+/)
    .filter((term) => term.length > 0)

  // If no search terms (empty string or just spaces), return no match
  if (searchTerms.length === 0) return 0

  fields.forEach(({ field, weight }) => {
    // @ts-expect-error using unknown here intentionally
    const value = item[field]
    if (!value) return

    // Handle different value types
    if (typeof value === "string") {
      const normalizedValue = value.toLowerCase()
      let fieldScore = 0

      // Score each search term
      const termScores = searchTerms.map((term) => {
        let termScore = 0

        // Exact field match
        if (normalizedValue === term) {
          return 100
        }

        // Word boundary match
        if (isWordBoundaryMatch(normalizedValue, term)) {
          termScore = Math.max(termScore, 80)
        }

        // Contains match
        if (normalizedValue.includes(term)) {
          // Prioritize matches at the beginning
          const position = normalizedValue.indexOf(term)
          const positionFactor = 1 - (position / normalizedValue.length) * 0.3
          termScore = Math.max(termScore, 50 * positionFactor)
        }

        // Fuzzy match if we haven't found a good match yet
        if (termScore < 30) {
          const fuzzyResult = improvedFuzzyMatch(normalizedValue, term)
          if (fuzzyResult.matched) {
            termScore = Math.max(termScore, 30 * fuzzyResult.score)
          }
        }

        return termScore
      })

      // Calculate average score across all terms
      if (termScores.length > 0) {
        // Base score is the average
        fieldScore =
          termScores.reduce((sum, score) => sum + score, 0) / termScores.length

        // Bonus for matching all terms with good scores
        const allTermsMatchWell = termScores.every((score) => score > 20)
        if (allTermsMatchWell) {
          fieldScore *= 1.2
        }
      }

      totalScore += fieldScore * weight
    }
    // Handle array fields like tags
    else if (Array.isArray(value)) {
      const tagScores = value.map((tag: string) => {
        if (typeof tag !== "string") return 0

        const normalizedTag = tag.toLowerCase()
        let tagScore = 0

        // Process each search term against this tag
        for (const term of searchTerms) {
          // Exact tag match
          if (normalizedTag === term) {
            tagScore = Math.max(tagScore, 100)
            continue
          }

          // Tag contains search term
          if (normalizedTag.includes(term)) {
            tagScore = Math.max(tagScore, 70)
            continue
          }

          // Search term contains tag (partial tag match)
          if (term.includes(normalizedTag)) {
            tagScore = Math.max(tagScore, 50)
            continue
          }

          // Fuzzy tag match
          const fuzzyResult = improvedFuzzyMatch(normalizedTag, term)
          if (fuzzyResult.matched) {
            tagScore = Math.max(tagScore, 40 * fuzzyResult.score)
          }
        }

        return tagScore
      })

      // Use the highest tag score
      const bestTagScore = Math.max(0, ...tagScores)
      totalScore += bestTagScore * weight
    }
  })

  return totalScore
}

/**
 * Main search hook that combines all functionality
 */
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

      // Fields with weights - adjust these based on what's most important
      const linkFields = [
        { field: "title", weight: 1.0 }, // Title matches are most important
        { field: "description", weight: 0.8 }, // Description slightly less important
        { field: "url", weight: 0.7 }, // URL matches are still valuable
        { field: "tags", weight: 0.9 }, // Tags are highly relevant but not as much as title
      ]

      const collectionFields = [
        { field: "name", weight: 1.0 }, // Collection name is most important
        { field: "description", weight: 0.8 }, // Description is important
        { field: "tags", weight: 0.9 }, // Tags are highly relevant
      ]

      // Score and sort links
      const scoredLinks = allLinks
        .map((link) => ({
          link,
          score: improvedRelevanceScore(link, normalizedSearchTerm, linkFields),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)

      // Score and sort collections
      const scoredCollections = (collections ?? [])
        .map((collection) => ({
          collection,
          score: improvedRelevanceScore(
            collection,
            normalizedSearchTerm,
            collectionFields
          ),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)

      setSearchResults({
        links: scoredLinks.map((item) => item.link),
        collections: scoredCollections.map((item) => item.collection),
      })

      setSearching(false)
    }, 300) // Reduced debounce for better responsiveness

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
