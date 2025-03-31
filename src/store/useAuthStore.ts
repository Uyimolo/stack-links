"use client"
import { create } from "zustand"
import {
  login,
  signUp,
  logout,
  sendUserEmailVerification,
} from "@/services/authServices"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/config/firebase"

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  isVerified: boolean
  loginUser: (email: string, password: string) => Promise<void>
  registerUser: (email: string, password: string) => Promise<void>
  logoutUser: () => Promise<void>
  verifyUserEmail: () => Promise<void>
  checkUser: () => () => void // Returns unsubscribe function
  refreshUserState: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true, // Start with loading true to prevent redirect flashes
  error: null,
  isVerified: false,

  loginUser: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const user = await login(email, password)
      if (!user) {
        throw new Error("Invalid email or password")
      }
      set({ user, isVerified: user.emailVerified, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error // Re-throw for handling in the UI
    }
  },

  registerUser: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const user = await signUp(email, password)
      set({ user, isVerified: user.emailVerified, loading: false })
      // Auto-send verification email
      if (user) await sendUserEmailVerification(user)
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error // Re-throw for consistent error handling
    }
  },

  logoutUser: async () => {
    set({ loading: true, error: null })
    try {
      await logout()
      set({ user: null, isVerified: false, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  verifyUserEmail: async () => {
    const { user } = get()
    if (!user) {
      const error = new Error("No authenticated user found.")
      set({ error: (error as Error).message })
      throw error
    }

    try {
      await sendUserEmailVerification(user)
      set({ error: null })
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    }
  },

  checkUser: () => {
    // Set loading initially when we start checking
    set({ loading: true })

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({
        user,
        isVerified: user?.emailVerified || false,
        loading: false, // Set loading to false once we have a result
      })
    })

    return unsubscribe
  },

  refreshUserState: async () => {
    const user = auth.currentUser
    if (!user) return

    try {
      await user.reload() // Refresh Firebase user state
      set({
        user: auth.currentUser,
        isVerified: auth.currentUser?.emailVerified || false,
      })
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    }
  },
}))
