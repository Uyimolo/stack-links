"use client";

import { useLinkStore } from "@/store/useLinkStore";
import { CollectionType } from "@/types/types";
import { useEffect, useState } from "react";

// For fetching collections
export const useCollections = (userId: string) => {
  const { collections, fetchCollections, loading, error } = useLinkStore();

  useEffect(() => {
    if (userId) {
      fetchCollections(userId);
    }
  }, [userId, fetchCollections]);

  return { collections, loading, error };
};

// For performing actions
export const useCollectionActions = () => {
  const { addCollection, editCollection, removeCollection, loading, error } =
    useLinkStore();

  return {
    addCollection,
    editCollection,
    removeCollection,
    loading,
    error,
  };
};

export const useSingleCollection = (userId: string, collectionId: string) => {
  const { fetchCollectionById } = useLinkStore();
  const [collection, setCollection] = useState<CollectionType | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const getCollectionById = async () => {
      setLoading(true);
      try {
        const collection = await fetchCollectionById(collectionId);
        setCollection(collection);
      } catch (error) {
        setCollection(null);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
      setLoading(false);
    };

    getCollectionById();
  }, [userId, collectionId]);

  return { collection, loading, error };
};
