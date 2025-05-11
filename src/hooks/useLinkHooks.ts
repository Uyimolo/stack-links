import { useAllLinkStore } from "@/store/useAllLinksStore";
import { useLinkStore } from "@/store/useLinkStore";
import { LinkType } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// For fetching links (used in collection page or list views)
export const useLinks = (userId: string, collectionId: string) => {
  const { links, fetchLinks, loading, error } = useLinkStore();

  useEffect(() => {
    const fetchLinksInCollection = async () => {
      try {
        if (userId && collectionId) {
          fetchLinks({ userId, collectionId });
        }
      } catch (error) {
        console.log("Error fetching links", (error as Error).message);
        toast.error("Error fetching links, please try again");
      }
    };

    fetchLinksInCollection();
  }, [userId, collectionId, fetchLinks]);

  return { links, loading, error };
};

export const useAllLinks = (userId: string) => {
  const { fetchAllLinks, allLinks, loading, error } = useAllLinkStore();

  useEffect(() => {
    const fetchAllUserLinks = async () => {
      try {
        await fetchAllLinks(userId);
      } catch (error) {
        console.log("Error fetching all links", (error as Error).message);
        toast.error("Error fetching all links, please try again");
      }
    };

    fetchAllUserLinks();
  }, [userId, fetchAllLinks]);

  return { loading, error, allLinks };
};

// For actions only (used in modals or isolated ops)
export const useLinkActions = () => {
  const { addLink, editLink, removeLink, loading, error, orderLinks } =
    useLinkStore();
  return { addLink, editLink, removeLink, loading, error, orderLinks };
};

export const useToggleLinkVisibility = (link: LinkType) => {
  const [loading, setLoading] = useState(false);
  const { id, visibility } = link;
  const { editLink } = useLinkStore();

  const toggleVisibility = async () => {
    if (!loading) {
      try {
        setLoading(true);
        if (visibility === "public") {
          await editLink({ linkId: id, visibility: "private" });
        } else {
          await editLink({ linkId: id, visibility: "public" });
        }
        setLoading(false);
      } catch (error) {
        console.log((error as Error).message);
        toast.error("Error updating link visibility");
        setLoading(false);
      }
    } else {
      return;
    }
  };

  return { loading, visibility, toggleVisibility };
};
