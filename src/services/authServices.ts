import { auth } from "@/config/firebase"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  User,
} from "firebase/auth"

// **Sign Up Function**
export const signUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )
  await sendEmailVerification(userCredential.user) // Auto-send email verification on signup
  return userCredential.user
}

// **Login Function**
export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

// **Logout Function**
export const logout = async () => {
  await signOut(auth)
}

// **Send Password Reset Email**
export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email)
}

// **Update Password (For Logged-In Users)**
export const updateUserPassword = async (user: User, newPassword: string) => {
  await updatePassword(user, newPassword)
}

// **Get Current User**
export const getCurrentUser = () => auth.currentUser

// **Send Email Verification**
export const sendUserEmailVerification = async (user: User) => {
  return await sendEmailVerification(user) // Ensure this returns a promise
}
