export type CollectionType = {
  id: string // Unique identifier
  ownerId: string // User who owns the collection
  name: string // Name of the collection
  description?: string // Optional description
  visibility: "public" | "private" | "unlisted" // Collection visibility
  tags?: string[] // Optional tags
  createdAt: string // ISO timestamp
  updatedAt?: string // Optional last updated timestamp
}

export type LinkType = {
  id: string // Unique identifier
  collectionId: string // Collection the link belongs to
  ownerId: string // User who added the link
  url: string // The actual link
  title: string // Title of the link
  description?: string // Optional description of the link
  imageUrl?: string // Optional image URL (preview or favicon)
  createdAt: string // ISO timestamp
  updatedAt?: string // Optional last updated timestamp
  tags?: string[] // Optional tags for the link
  visibility: "public" | "private" | "unlisted" // Link visibility
  pinned?: boolean // Whether the link is pinned in the collection
}

export type ModalType =
  | "add collection"
  | "update collection"
  | "delete collection"
  | "add link"
  | "delete link"
  | null

export type ModalState = {
  status: "open" | "close"
  modalType: ModalType
  modalProps?: Record<string, unknown>
}
