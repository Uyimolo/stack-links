import { db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getUserData = async (userId: string) => {
  // fetch user data from firestore
  const userRef = collection(db, "users");
  const q = query(userRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate().toISOString(),
  }));
};
