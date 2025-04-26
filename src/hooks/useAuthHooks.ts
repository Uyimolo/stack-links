// hooks/useAuthHooks.js
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";

export const useFirebaseAuthError = () => {
  // Return a function instead of directly calling the hook inside an event handler
  const handleFirebaseAuthError = (error: FirebaseError) => {
    const errorCode = error?.code || "";
    const errorMessage = error?.message || "An unknown error occurred";

    switch (errorCode) {
      case "auth/user-not-found":
        toast.error("No user found with this email address");
        break;
      case "auth/wrong-password":
        toast.error("Incorrect password");
        break;
      case "auth/invalid-email":
        toast.error("The email address is not valid");
        break;
      case "auth/user-disabled":
        toast.error("This user account has been disabled");
        break;
      case "auth/email-already-in-use":
        toast.error("This email is already registered");
        break;
      case "auth/weak-password":
        toast.error("The password is too weak");
        break;
      case "auth/operation-not-allowed":
        toast.error("Operation not allowed");
        break;
      case "auth/too-many-requests":
        toast.error("Too many unsuccessful attempts. Please try again later");
        break;
      default:
        toast.error(errorMessage);
    }
  };

  return { handleFirebaseAuthError };
};
