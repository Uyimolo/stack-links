export type CollectionType = {
  id: string
  ownerId: string
  name: string
  description?: string
  visibility: "public" | "private" | "unlisted"
  tags?: string[]
  createdAt: string
  updatedAt?: string
}

export type LinkType = {
  id: string
  collectionId: string
  ownerId: string
  url: string
  title: string
  description?: string
  imageUrl?: string
  createdAt: string
  updatedAt?: string
  tags?: string[]
  visibility: "public" | "private" | "unlisted"
  pinned?: boolean
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
  modalProps?: {
    collection?: CollectionType
    collectionId?: string
    link?: LinkType
  }
}
