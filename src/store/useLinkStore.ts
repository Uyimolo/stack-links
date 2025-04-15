import { create } from "zustand"
import { CollectionType, LinkType } from "@/types/types"
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  getLinksInCollection,
  createLink,
  updateLink,
  deleteLink,
  searchCollections,
  searchLinks,
} from "@/services/linkServices"

interface LinkStoreState {
  collections: CollectionType[] | undefined
  links: LinkType[] | undefined
  loading: boolean
  error: string | null

  fetchCollections: (userId: string) => Promise<void>
  fetchCollectionById: (collectionId: string) => Promise<CollectionType | null>
  addCollection: (params: {
    userId: string
    name: string
    description: string
    visibility: "public" | "private" | "unlisted"
    tags?: string[]
  }) => Promise<void>
  editCollection: (params: {
    collectionId: string
    name: string
    description: string
    visibility: "public" | "private" | "unlisted"
    tags: string[]
  }) => Promise<void>
  removeCollection: (collectionId: string) => Promise<void>

  fetchLinks: (params: {
    userId: string
    collectionId: string
  }) => Promise<void>
  addLink: (params: {
    userId: string
    collectionId: string
    title: string
    url: string
    description?: string
    imageUrl?: string
    visibility?: "public" | "private" | "unlisted"
    tags?: string[]
    pinned?: boolean
  }) => Promise<void>
  editLink: (params: {
    linkId: string
    title?: string
    url?: string
    description?: string
    imageUrl?: string
    visibility?: "public" | "private" | "unlisted"
    pinned?: boolean
  }) => Promise<void>
  removeLink: (linkId: string) => Promise<void>

  searchForCollections: (params: {
    userId: string
    searchTerm: string
  }) => Promise<void>
  searchForLinks: (params: {
    userId: string
    collectionId: string
    searchTerm: string
  }) => Promise<void>
}

export const useLinkStore = create<LinkStoreState>((set) => ({
  collections: undefined,
  links: undefined,
  loading: false,
  error: null,

  // ==============================
  // COLLECTION METHODS
  // ==============================

  fetchCollections: async (userId) => {
    set({ loading: true, error: null })
    try {
      const collections = await getCollections(userId)
      set({ collections })
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch collection",
      })
    } finally {
      set({ loading: false })
    }
  },

  fetchCollectionById: async (collectionId) => {
    set({ loading: true, error: null })
    try {
      return await getCollectionById(collectionId)
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch collection",
      })
      return null
    } finally {
      set({ loading: false })
    }
  },

  addCollection: async ({
    userId,
    name,
    description,
    visibility,
    tags = [],
  }) => {
    set({ loading: true, error: null })
    try {
      await createCollection({ userId, name, description, visibility, tags })
      await useLinkStore.getState().fetchCollections(userId) // Refresh list
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch collection",
      })
    } finally {
      set({ loading: false })
    }
  },

  editCollection: async ({
    collectionId,
    name,
    description,
    visibility,
    tags,
  }) => {
    set({ loading: true, error: null })
    try {
      await updateCollection({
        collectionId,
        name,
        description,
        visibility,
        tags,
      })
      set((state) => ({
        collections: (state.collections ?? []).map((col) =>
          col.id === collectionId
            ? { ...col, name, description, visibility, tags }
            : col
        ),
      }))
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update collection",
      })
    } finally {
      set({ loading: false })
    }
  },

  removeCollection: async (collectionId) => {
    set({ loading: true, error: null })
    try {
      await deleteCollection(collectionId)
      set((state) => ({
        collections: (state.collections ?? []).filter(
          (col) => col.id !== collectionId
        ),
      }))
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete collection",
      })
    } finally {
      set({ loading: false })
    }
  },

  // ==============================
  // LINK METHODS
  // ==============================

  fetchLinks: async ({ userId, collectionId }) => {
    set({ loading: true, error: null })
    try {
      const links = await getLinksInCollection({ userId, collectionId })
      set({ links })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch links",
      })
    } finally {
      set({ loading: false })
    }
  },

  addLink: async ({
    userId,
    collectionId,
    title,
    url,
    description = "",
    imageUrl = "",
    visibility = "public",
    tags = [],
    pinned = false,
  }) => {
    set({ loading: true, error: null })
    try {
      await createLink({
        userId,
        collectionId,
        title,
        url,
        description,
        imageUrl,
        visibility,
        tags,
        pinned,
      })
      await useLinkStore.getState().fetchLinks({ userId, collectionId }) // Refresh list
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create link",
      })
    } finally {
      set({ loading: false })
    }
  },

  editLink: async ({
    linkId,
    title,
    url,
    description,
    imageUrl,
    visibility,
    pinned,
  }) => {
    set({ loading: true, error: null })
    try {
      await updateLink({
        linkId,
        title,
        url,
        description,
        imageUrl,
        visibility,
        pinned,
      })

      set((state) => ({
        links: (state.links ?? []).map((link) =>
          link.id === linkId
            ? {
                ...link,
                title: title ?? link.title,
                url: url ?? link.url,
                description: description ?? link.description,
                imageUrl: imageUrl ?? link.imageUrl,
                visibility: visibility ?? link.visibility,
                pinned: pinned ?? link.pinned,
              }
            : link
        ),
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update link",
      })
    } finally {
      set({ loading: false })
    }
  },

  removeLink: async (linkId) => {
    set({ loading: true, error: null })
    try {
      await deleteLink(linkId)
      set((state) => ({
        links: (state.links ?? []).filter((link) => link.id !== linkId),
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete link",
      })
    } finally {
      set({ loading: false })
    }
  },

  // ==============================
  // SEARCH METHODS
  // ==============================

  searchForCollections: async ({ userId, searchTerm }) => {
    set({ loading: true, error: null })
    try {
      const filteredCollections = await searchCollections({
        userId,
        searchTerm,
      })
      set({ collections: filteredCollections })
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to search collections",
      })
    } finally {
      set({ loading: false })
    }
  },

  searchForLinks: async ({ userId, collectionId, searchTerm }) => {
    set({ loading: true, error: null })
    try {
      const filteredLinks = await searchLinks({
        userId,
        collectionId,
        searchTerm,
      })
      set({ links: filteredLinks })
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to search links",
      })
    } finally {
      set({ loading: false })
    }
  },
}))
