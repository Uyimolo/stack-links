import { ModalState } from "@/types/types"
import { create } from "zustand"

interface AppState {
  showSidebar: boolean
  toggleSidebar: () => void
  modalState: ModalState
  updateModal: (newModalState: ModalState) => void
  closeModal: () => void
}

export const useAppState = create<AppState>((set) => ({
  showSidebar: false,
  toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
  modalState: { status: "close", modalType: null, modalProps: {} },

  updateModal: (modal) => set({ modalState: modal }),

  closeModal: () =>
    set({ modalState: { status: "close", modalType: null, modalProps: {} } }),
}))
