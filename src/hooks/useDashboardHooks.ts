import { useCollections } from "./useCollectionHooks";
import { useAllLinks } from "./useLinkHooks";
import { auth } from "@/config/firebase";
import { EyeIcon, FolderIcon, LinkIcon, LockIcon } from "lucide-react";

export const useDashBoardMetrics = () => {
  const userId = auth.currentUser?.uid || "";
  const { collections, loading: collectionsLoading } = useCollections(userId);
  const { allLinks, loading: linksLoading } = useAllLinks(userId);

  const loading = collectionsLoading || linksLoading;

  const totalLinks = allLinks?.length || 0;
  const totalCollections = collections?.length || 0;

  const publicLinks =
    allLinks?.filter((link) => link.visibility === "public").length || 0;
  const privateLinks =
    allLinks?.filter((link) => link.visibility === "private").length || 0;

  const recentLinks = [...(allLinks || [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  const topCollectionsByLinks = collections
    ?.map((collection) => {
      const linksCount =
        allLinks?.filter((link) => link.collectionId === collection.id)
          .length || 0;
      return { ...collection, linksCount };
    })
    .sort((a, b) => b.linksCount - a.linksCount)
    .slice(0, 5);

  const overView = [
    {
      title: "Total Links",
      value: loading
        ? "Loading..."
        : `${totalLinks || "No"} ${totalLinks === 1 ? "link" : "links"}`,
      bgColor: "bg-blue-1",
      icon: LinkIcon,
    },
    {
      title: "Total Collections",
      value: loading
        ? "Loading..."
        : `${totalCollections || "No"} ${
            totalCollections === 1 ? "collection" : "collections"
          }`,
      bgColor: "bg-indigo",
      icon: FolderIcon,
    },
    {
      title: "Public Links",
      value: loading
        ? "Loading..."
        : `${publicLinks || "No public"} ${
            publicLinks === 1 ? "link" : "links"
          }`,
      bgColor: "bg-teal",
      icon: EyeIcon,
    },
    {
      title: "Private Links",
      value: loading
        ? "Loading..."
        : `${privateLinks || "No private"} ${
            privateLinks === 1 ? "link" : "links"
          }`,
      bgColor: "bg-pink",
      icon: LockIcon,
    },
  ];

  return { overView, topCollectionsByLinks, recentLinks, loading };
};
