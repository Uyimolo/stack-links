import { Timestamp } from "firebase/firestore";

export type CollectionType = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  visibility: "public" | "private" | "unlisted";
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  imageUrl?: string;
};

export type LinkType = {
  id: string;
  collectionId: string;
  ownerId: string;
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  visibility: "public" | "private" | "unlisted";
  pinned?: boolean;
};

export type ModalType =
  | "add collection"
  | "update collection"
  | "delete collection"
  | "add link"
  | "delete link"
  | "view mockup"
  | null;

export type ModalState = {
  status: "open" | "close";
  modalType: ModalType;
  modalProps?: {
    collection?: CollectionType;
    collectionId?: string;
    link?: LinkType;
  };
};

export type ExtentedComponentVariant =
  | "delete link"
  | "share link"
  | "upload link image"
  | "view tags"
  | null;

export type LinkCardExtensionState = {
  extendedComponentVariant: ExtentedComponentVariant;
  linkId: string | null;
};

export type User = {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  photoUrl?: string;
  bio?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  plan?: "free" | "pro" | "admin";
  isAdmin?: boolean;
  preferences?: {
    theme: "light" | "dark" | "system";
    layout: "grid" | "list";
  };
};
