import { create } from "zustand"
import type { ModalState } from "@/types/types"

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
