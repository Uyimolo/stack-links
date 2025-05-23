import { db } from "@/config/firebase";
import { CollectionType, LinkType } from "@/types/types";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  setDoc,
  orderBy,
  limit,
  writeBatch,
  FirestoreError,
} from "firebase/firestore";

// ==============================
// COLLECTION FUNCTIONS
// ==============================

/**
 * Fetch all collections for a specific user
 */
export const getCollections = async (
  userId: string,
): Promise<CollectionType[]> => {
  const collectionsRef = collection(db, "allCollections");
  const q = query(collectionsRef, where("ownerId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate().toISOString(),
  })) as CollectionType[];
};

/**
 * Get a single collection by ID
 */
export const getCollectionById = async (
  collectionId: string,
): Promise<CollectionType | null> => {
  try {
    const docRef = doc(db, "allCollections", collectionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();

    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate().toISOString(),
    } as CollectionType;
  } catch (error) {
    console.error("Error fetching collection:", error);
    throw error;
  }
};

/**
 * Create a new collection
 */
export const createCollection = async ({
  userId,
  name,
  description,
  visibility,
  tags = [],
  imageUrl,
  collectionId,
  createdAt = Timestamp.now(),
}: {
  userId: string;
  name: string;
  description: string;
  visibility: "public" | "private" | "unlisted";
  tags?: string[];
  imageUrl: string;
  collectionId: string;
  createdAt?: Timestamp;
}) => {
  const collectionsRef = doc(db, "allCollections", collectionId);

  await setDoc(collectionsRef, {
    id: collectionId,
    ownerId: userId,
    name,
    description,
    visibility,
    tags,
    imageUrl,
    createdAt,
  });

  return collectionsRef;
};

/**
 * Update a collection
 */
export const updateCollection = async ({
  collectionId,
  name,
  description,
  visibility,
  tags,
  imageUrl,
}: {
  collectionId: string;
  name: string;
  description: string;
  visibility: "public" | "private" | "unlisted";
  tags: string[];
  imageUrl?: string;
}) => {
  const updates: Partial<CollectionType> = {};
  if (name) updates.name = name;
  if (description) updates.description = description;
  if (visibility) updates.visibility = visibility;
  if (tags) updates.tags = tags;
  if (imageUrl) updates.imageUrl = imageUrl;

  const docRef = doc(db, "allCollections", collectionId);
  await updateDoc(docRef, updates);
};

/**
 * Delete a collection
 */
export const deleteCollection = async (collectionId: string) => {
  const docRef = doc(db, "allCollections", collectionId);
  await deleteDoc(docRef);
};

// ==============================
// LINK FUNCTIONS
// ==============================

/**
 * Fetch all links a user has
 */

export const getAllLinks = async (userId: string): Promise<LinkType[]> => {
  const allLinksRef = collection(db, "allLinks");
  const q = query(allLinksRef, where("ownerId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate().toISOString(),
  })) as LinkType[];
};

/**
 * Fetch all links within a collection
 */

export const getLinksInCollection = async ({
  userId,
  collectionId,
}: {
  userId: string;
  collectionId: string;
}): Promise<LinkType[]> => {
  try {
    const linksRef = collection(db, "allLinks");
    const q = query(
      linksRef,
      where("ownerId", "==", userId),
      where("collectionId", "==", collectionId),
      orderBy("order", "asc"),
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
    })) as LinkType[];
  } catch (error) {
    console.error("Firestore query error:", error);
    throw error;
  }
};

/*
 * Get links (unauthenticated) not used yet
 */

export const getLinks = async (collectionId: string): Promise<LinkType[]> => {
  const linksRef = collection(db, "allLinks");
  const q = query(
    linksRef,
    where("collectionId", "==", collectionId),
    orderBy("order"),
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate().toISOString(),
  })) as LinkType[];
};

/**
 * Get a single link by ID
 */
export const getLinkById = async (linkId: string): Promise<LinkType | null> => {
  const docRef = doc(db, "allLinks", linkId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt.toDate().toISOString(),
  } as LinkType;
};

export const getNextLinkOrder = async (
  collectionId: string,
): Promise<number> => {
  try {
    const linksRef = collection(db, "allLinks");
    const q = query(
      linksRef,
      where("collectionId", "==", collectionId),
      orderBy("order", "desc"),
      limit(1),
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const last = snapshot.docs[0];
      const lastOrder = last.data().order;
      console.log(lastOrder);
      return typeof lastOrder === "number" ? lastOrder + 1 : 0;
    }

    return 0;
  } catch (err) {
    if ((err as FirestoreError).code === "permission-denied") {
      console.warn(
        "Permission denied while reading latest link order:",
        (err as FirestoreError).message,
      );
    } else {
      console.error("Failed to fetch link order:", err);
    }

    // Fallback if no access or unexpected error
    return 0;
  }
};

export const createLink = async ({
  userId,
  collectionId,
  linkId,
  title,
  url,
  description = "",
  imageUrl = "",
  visibility = "public",
  tags = [],
  pinned = false,
  favicon,
  createdAt = Timestamp.now(),
}: {
  userId: string;
  collectionId: string;
  linkId: string;
  title: string;
  url: string;
  description?: string;
  imageUrl?: string;
  visibility?: "public" | "private" | "unlisted";
  tags?: string[];
  pinned?: boolean;
  favicon?: string;
  createdAt?: Timestamp;
}) => {
  if (!userId || !collectionId || !linkId || !title || !url) {
    throw new Error("Required fields are missing or invalid.");
  }

  const collectionRef = doc(db, "allCollections", collectionId);
  const collectionDoc = await getDoc(collectionRef);

  if (!collectionDoc.exists()) {
    throw new Error("Collection does not exist");
  }

  const collectionData = collectionDoc.data();

  if (
    collectionData?.visibility === "private" &&
    collectionData?.ownerId !== userId
  ) {
    throw new Error(
      "You cannot add a link to a private collection you do not own",
    );
  }

  const linkRef = doc(db, "allLinks", linkId);
  const existingLinkDoc = await getDoc(linkRef);

  if (existingLinkDoc.exists()) {
    throw new Error("A link with this ID already exists");
  }

  const newOrder = await getNextLinkOrder(collectionId);
  console.log(newOrder);

  const newLink = {
    id: linkId,
    ownerId: userId,
    collectionId,
    title,
    url,
    description,
    imageUrl,
    visibility,
    tags,
    pinned,
    createdAt,
    favicon,
    order: newOrder,
  };

  await setDoc(linkRef, newLink);

  console.log(newLink);

  return linkRef;
};

/**
 * Update a link
 */
export const updateLink = async ({
  linkId,
  title,
  url,
  description,
  imageUrl,
  visibility,
  pinned,
  tags,
}: {
  linkId: string;
  title?: string;
  url?: string;
  description?: string;
  imageUrl?: string;
  visibility?: "public" | "private" | "unlisted";
  pinned?: boolean;
  tags?: string[];
}) => {
  const docRef = doc(db, "allLinks", linkId);
  const updates: Partial<LinkType> = {};

  if (title) updates.title = title;
  if (url) updates.url = url;
  if (description) updates.description = description;
  if (imageUrl) updates.imageUrl = imageUrl;
  if (visibility) updates.visibility = visibility;
  if (typeof pinned === "boolean") updates.pinned = pinned;
  if (tags) updates.tags = tags;

  await updateDoc(docRef, updates);
};

/**
 * Delete a link
 */
export const deleteLink = async (linkId: string) => {
  const docRef = doc(db, "allLinks", linkId);
  await deleteDoc(docRef);
};

/**
 * Reorder links
 */
export const reorderLinks = async (newOrder: LinkType[]) => {
  const batch = writeBatch(db);
  newOrder.forEach((link, index) => {
    const ref = doc(db, "allLinks", link.id);
    batch.update(ref, { order: index });
  });

  await batch.commit();
};

// ==============================
// SEARCH FUNCTIONS
// ==============================

/**
 * Search for collections by name
 */
export const searchCollections = async ({
  userId,
  searchTerm,
}: {
  userId: string;
  searchTerm: string;
}) => {
  const collections = await getCollections(userId);
  return collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};

/**
 * Search for links within a collection by title or URL
 */
export const searchLinks = async ({
  userId,
  collectionId,
  searchTerm,
}: {
  userId: string;
  collectionId: string;
  searchTerm: string;
}) => {
  const links = await getLinksInCollection({ userId, collectionId });
  return links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};
