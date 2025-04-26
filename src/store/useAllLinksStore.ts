import { create } from "zustand";
import { getAllLinks } from "@/services/linkServices";
import { LinkType } from "@/types/types";

// ===========================================================================
// firebase spark plan doesnt allow for proper search or intergration with indexing extentions like algolia, so this implementation fetches all links on mount and provides methods to update the list of all links when crud operations are made else where in the app to keep the data fresh
// ===========================================================================
// This data will be used to perform client side searching to mimic a full blown search experience without having to subscribe to higher plans.

//Note: to be changed once i can afford better plans

interface AllLinksStoreState {
  allLinks: LinkType[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;

  fetchAllLinks: (userId: string) => Promise<void>;
  addLink: (link: LinkType) => void;
  removeLink: (link: LinkType) => void;
  updateLink: (link: LinkType) => void;
  clearAllLinks: () => void;
}

export const useAllLinkStore = create<AllLinksStoreState>((set, get) => ({
  allLinks: [],
  loading: false,
  error: null,
  hasFetched: false,

  // Fetch all links for the user once
  fetchAllLinks: async (userId: string) => {
    const { hasFetched } = get();
    if (hasFetched) return;

    set({ loading: true, error: null });
    try {
      const allLinks = await getAllLinks(userId);
      set({ allLinks, hasFetched: true });
    } catch (error) {
      set({
        error: (error as Error).message || "Failed to fetch links",
      });
    } finally {
      set({ loading: false });
    }
  },

  addLink: (link: LinkType) =>
    set((state) => ({ allLinks: [...state.allLinks, link] })),

  removeLink: (linkToRemove: LinkType) =>
    set((state) => ({
      allLinks: state.allLinks.filter((link) => link.id !== linkToRemove.id),
    })),

  updateLink: (updatedLink: LinkType) =>
    set((state) => ({
      allLinks: state.allLinks.map((link) =>
        link.id === updatedLink.id ? updatedLink : link,
      ),
    })),

  // Clear all links (on logout)
  clearAllLinks: () =>
    set({ allLinks: [], hasFetched: false, loading: false, error: null }),
}));
