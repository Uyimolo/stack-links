import { create } from "zustand"
import type {
  ExtentedComponentVariant,
  LinkCardExtensionState,
  ModalState,
} from "@/types/types" 

interface AppState {
  showSidebar: boolean
  toggleSidebar: () => void
  modalState: ModalState
  updateModal: (newModalState: ModalState) => void
  closeModal: () => void
  linkCardExtensionState: LinkCardExtensionState
  closeLinkCardExtension: () => void
  updateLinkCardExtension: (
    variant: ExtentedComponentVariant,
    id: string | null
  ) => void
}

export const useAppState = create<AppState>((set) => ({
  showSidebar: false,
  toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
  modalState: { status: "close", modalType: null, modalProps: {} },
  updateModal: (modal) => set({ modalState: modal }),
  closeModal: () =>
    set({ modalState: { status: "close", modalType: null, modalProps: {} } }),
  linkCardExtensionState: { extendedComponentVariant: null, linkId: null },
  closeLinkCardExtension: () =>
    set({
      linkCardExtensionState: { extendedComponentVariant: null, linkId: null },
    }),
  updateLinkCardExtension: (variant, id) => {
    set({
      linkCardExtensionState: { extendedComponentVariant: variant, linkId: id },
    })
  },
}))
