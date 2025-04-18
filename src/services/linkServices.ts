import {  db } from "@/config/firebase"
import { CollectionType, LinkType } from "@/types/types"
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore"

// ==============================
// COLLECTION FUNCTIONS
// ==============================

/**
 * Fetch all collections for a specific user
 */
export const getCollections = async (
  userId: string
): Promise<CollectionType[]> => {
  const collectionsRef = collection(db, "allCollections")
  const q = query(collectionsRef, where("ownerId", "==", userId))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate().toISOString(),
  })) as CollectionType[]
}

/**
 * Get a single collection by ID
 */
export const getCollectionById = async (
  collectionId: string
): Promise<CollectionType | null> => {
  try {
    const docRef = doc(db, "allCollections", collectionId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    const data = docSnap.data()

    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate().toISOString(),
    } as CollectionType
  } catch (error) {
    console.error("Error fetching collection:", error)
    throw error
  }
}

/**
 * Create a new collection
 */
export const createCollection = async ({
  userId,
  name,
  description,
  visibility,
  tags = [],
}: {
  userId: string
  name: string
  description: string
  visibility: "public" | "private" | "unlisted"
  tags?: string[]
}) => {
  const collectionsRef = collection(db, "allCollections")
  const newDoc = await addDoc(collectionsRef, {
    ownerId: userId,
    name,
    description,
    visibility,
    tags,
    createdAt: Timestamp.now(),
  })
  return newDoc.id
}

/**
 * Update a collection
 */
export const updateCollection = async ({
  collectionId,
  name,
  description,
  visibility,
  tags,
}: {
  collectionId: string
  name: string
  description: string
  visibility: "public" | "private" | "unlisted"
  tags: string[]
}) => {
  const docRef = doc(db, "allCollections", collectionId)
  await updateDoc(docRef, { name, description, visibility, tags })
}

/**
 * Delete a collection
 */
export const deleteCollection = async (collectionId: string) => {
  const docRef = doc(db, "allCollections", collectionId)
  await deleteDoc(docRef)
}

// ==============================
// LINK FUNCTIONS
// ==============================

/**
 * Fetch all links a user has
 */

export const getAllLinks = async (userId:string): Promise<LinkType[]> => {
  const allLinksRef = collection(db, "allLinks")
  const q = query(allLinksRef, where("ownerId", "==", userId))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate().toISOString(),
  })) as LinkType[]
}

/**
 * Fetch all links within a collection
 */
export const getLinksInCollection = async ({
  userId,
  collectionId,
}: {
  userId: string
  collectionId: string
}): Promise<LinkType[]> => {
  const linksRef = collection(db, "allLinks")
  const q = query(
    linksRef,
    where("ownerId", "==", userId),
    where("collectionId", "==", collectionId)
  )
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate().toISOString(),
  })) as LinkType[]
}

/**
 * Get a single link by ID
 */
export const getLinkById = async (linkId: string): Promise<LinkType | null> => {
  const docRef = doc(db, "allLinks", linkId)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return null
  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt.toDate().toISOString(),
  } as LinkType
}

/**
 * Create a new link inside a collection
 */
export const createLink = async ({
  userId,
  collectionId,
  title,
  url,
  description = "",
  imageUrl = "",
  visibility = "public",
  tags = [],
  pinned = false,
}: {
  userId: string
  collectionId: string
  title: string
  url: string
  description?: string
  imageUrl?: string
  visibility?: "public" | "private" | "unlisted"
  tags?: string[]
  pinned?: boolean
}) => {
  // Input validation
  if (!userId || !collectionId || !title || !url) {
    throw new Error("Required fields are missing or invalid.")
  }

  // Fetch the collection to check its visibility
  const collectionRef = doc(db, "allCollections", collectionId)
  const collectionDoc = await getDoc(collectionRef)

  if (!collectionDoc.exists()) {
    console.error("Error: Collection not found or not accessible")
    throw new Error("Collection does not exist")
  }

  const collectionData = collectionDoc.data()

  // If collection is private, check if the user is the owner
  if (
    collectionData?.visibility === "private" &&
    collectionData?.ownerId !== userId
  ) {
    throw new Error(
      "You cannot add a link to a private collection you do not own"
    )
  }

  // Proceed to create the link
  const linksRef = collection(db, "allLinks")
  try {
    const newDoc = await addDoc(linksRef, {
      ownerId: userId,
      collectionId,
      title,
      url,
      description,
      imageUrl,
      visibility,
      tags,
      pinned,
      createdAt: Timestamp.now(),
    })
    return newDoc.id
  } catch (error) {
    console.error("Error creating link:", error)
    throw new Error("Failed to create link")
  }
}

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
}: {
  linkId: string
  title?: string
  url?: string
  description?: string
  imageUrl?: string
  visibility?: "public" | "private" | "unlisted"
  pinned?: boolean
}) => {
  const docRef = doc(db, "allLinks", linkId)
  const updates: Partial<LinkType> = {}

  if (title) updates.title = title
  if (url) updates.url = url
  if (description) updates.description = description
  if (imageUrl) updates.imageUrl = imageUrl
  if (visibility) updates.visibility = visibility
  if (typeof pinned === "boolean") updates.pinned = pinned

  await updateDoc(docRef, updates)
}

/**
 * Delete a link
 */
export const deleteLink = async (linkId: string) => {
  const docRef = doc(db, "allLinks", linkId)
  await deleteDoc(docRef)
}

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
  userId: string
  searchTerm: string
}) => {
  const collections = await getCollections(userId)
  return collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
}

/**
 * Search for links within a collection by title or URL
 */
export const searchLinks = async ({
  userId,
  collectionId,
  searchTerm,
}: {
  userId: string
  collectionId: string
  searchTerm: string
}) => {
  const links = await getLinksInCollection({ userId, collectionId })
  return links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase())
  )
}
