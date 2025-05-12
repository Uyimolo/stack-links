import { create } from "zustand";
import { CollectionType, LinkType } from "@/types/types";
import { useAllLinkStore } from "@/store/useAllLinksStore";

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
  reorderLinks,
} from "@/services/linkServices";

interface LinkStoreState {
  collections: CollectionType[] | undefined;
  links: LinkType[] | undefined;
  loading: boolean;
  error: string | null;

  fetchCollections: (userId: string) => Promise<void>;
  fetchCollectionById: (collectionId: string) => Promise<CollectionType | null>;
  addCollection: (params: {
    userId: string;
    name: string;
    description: string;
    visibility: "public" | "private" | "unlisted";
    tags?: string[];
    imageUrl?: string;
    collectionId: string;
  }) => Promise<void>;
  editCollection: (params: {
    collectionId: string;
    name: string;
    description: string;
    visibility: "public" | "private" | "unlisted";
    tags: string[];
    imageUrl?: string;
  }) => Promise<void>;
  removeCollection: (collectionId: string) => Promise<void>;

  fetchLinks: (params: {
    userId: string;
    collectionId: string;
  }) => Promise<void>;
  addLink: (params: {
    linkId: string;
    userId: string;
    collectionId: string;
    title: string;
    url: string;
    description?: string;
    imageUrl?: string | undefined;
    visibility?: "public" | "private" | "unlisted";
    tags?: string[];
    pinned?: boolean;
    favicon?: string;
  }) => Promise<void>;
  editLink: (params: {
    linkId: string;
    title?: string;
    url?: string;
    description?: string;
    imageUrl?: string;
    visibility?: "public" | "private" | "unlisted";
    pinned?: boolean;
    tags?: string[];
  }) => Promise<void>;
  removeLink: (linkId: string) => Promise<void>;
  orderLinks: (newOrder: LinkType[]) => Promise<void>;
  searchForCollections: (params: {
    userId: string;
    searchTerm: string;
  }) => Promise<void>;
  searchForLinks: (params: {
    userId: string;
    collectionId: string;
    searchTerm: string;
  }) => Promise<void>;
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
    set({ loading: true, error: null });
    try {
      const collections = await getCollections(userId);
      set({ collections });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch collection",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchCollectionById: async (collectionId) => {
    set({ loading: true, error: null });
    try {
      return await getCollectionById(collectionId);
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch collection",
      });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  addCollection: async ({
    userId,
    name,
    description,
    visibility,
    tags = [],
    imageUrl = "",
    collectionId,
  }) => {
    set({ loading: true, error: null });
    try {
      await createCollection({
        collectionId,
        userId,
        name,
        description,
        visibility,
        tags,
        imageUrl,
      });
      await useLinkStore.getState().fetchCollections(userId); // Refresh list
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch collection",
      });
    } finally {
      set({ loading: false });
    }
  },

  editCollection: async ({
    collectionId,
    name,
    description,
    visibility,
    tags,
    imageUrl,
  }) => {
    set({ loading: true, error: null });
    try {
      await updateCollection({
        collectionId,
        name,
        description,
        visibility,
        tags,
        imageUrl,
      });
      set((state) => ({
        collections: (state.collections ?? []).map((col) =>
          col.id === collectionId
            ? { ...col, name, description, visibility, tags, imageUrl }
            : col,
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update collection",
      });
    } finally {
      set({ loading: false });
    }
  },

  removeCollection: async (collectionId) => {
    set({ loading: true, error: null });
    try {
      await deleteCollection(collectionId);
      set((state) => ({
        collections: (state.collections ?? []).filter(
          (col) => col.id !== collectionId,
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete collection",
      });
    } finally {
      set({ loading: false });
    }
  },

  // ==============================
  // LINK METHODS
  // ==============================

  fetchLinks: async ({ userId, collectionId }) => {
    set({ loading: true, error: null });
    try {
      const links = await getLinksInCollection({ userId, collectionId });
      set({ links });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch links",
      });
    } finally {
      set({ loading: false });
    }
  },

  addLink: async ({
    linkId,
    userId,
    collectionId,
    title,
    url,
    description = "",
    imageUrl = "",
    visibility = "public",
    tags = [],
    pinned = false,
    favicon,
  }) => {
    set({ loading: true, error: null });
    try {
      const newLink = {
        linkId,
        userId,
        collectionId,
        title,
        url,
        description,
        imageUrl,
        visibility,
        tags,
        pinned,
        favicon,
      };
      await createLink(newLink);
      await useLinkStore.getState().fetchLinks({ userId, collectionId });
      // ✅ Add to allLinks store
      const id = newLink.linkId;
      const { addLink } = useAllLinkStore.getState();
      addLink({
        id,
        collectionId,
        title,
        url,
        description,
        imageUrl,
        visibility,
        tags,
        pinned,
        ownerId: userId, // Add ownerId from userId
        createdAt: new Date().toISOString(), // Add createdAt with current timestamp
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create link",
      });
    } finally {
      set({ loading: false });
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
    tags,
  }) => {
    set({ loading: true, error: null });
    try {
      await updateLink({
        linkId,
        title,
        url,
        description,
        imageUrl,
        visibility,
        pinned,
        tags,
      });

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
                tags: tags ?? link.tags,
              }
            : link,
        ),
      }));

      // ✅ Update in allLinks store
      const { allLinks, updateLink: updateAllLink } =
        useAllLinkStore.getState();
      const linkToUpdate = allLinks.find((link) => link.id === linkId);
      if (linkToUpdate) {
        updateAllLink({
          ...linkToUpdate,
          title: title ?? linkToUpdate.title,
          url: url ?? linkToUpdate.url,
          description: description ?? linkToUpdate.description,
          imageUrl: imageUrl ?? linkToUpdate.imageUrl,
          visibility: visibility ?? linkToUpdate.visibility,
          pinned: pinned ?? linkToUpdate.pinned,
          tags: tags ?? linkToUpdate.tags,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update link",
      });
    } finally {
      set({ loading: false });
    }
  },

  removeLink: async (linkId) => {
    set({ loading: true, error: null });
    try {
      await deleteLink(linkId);
      set((state) => ({
        links: (state.links ?? []).filter((link) => link.id !== linkId),
      }));
      // ✅ Remove from allLinks store
      const { allLinks, removeLink: removeAllLink } =
        useAllLinkStore.getState();
      const linkToRemove = allLinks.find((link) => link.id === linkId);
      if (linkToRemove) {
        removeAllLink(linkToRemove);
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete link",
      });
    } finally {
      set({ loading: false });
    }
  },
  orderLinks: async (newOrder) => {
    set({ loading: true, error: null });
    try {
      await reorderLinks(newOrder);
      set({ links: newOrder });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to reorder links",
      });
    } finally {
      set({ loading: false });
    }
  },

  // ==============================
  // SEARCH METHODS
  // ==============================

  searchForCollections: async ({ userId, searchTerm }) => {
    set({ loading: true, error: null });
    try {
      const filteredCollections = await searchCollections({
        userId,
        searchTerm,
      });
      set({ collections: filteredCollections });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to search collections",
      });
    } finally {
      set({ loading: false });
    }
  },

  searchForLinks: async ({ userId, collectionId, searchTerm }) => {
    set({ loading: true, error: null });
    try {
      const filteredLinks = await searchLinks({
        userId,
        collectionId,
        searchTerm,
      });
      set({ links: filteredLinks });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to search links",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
