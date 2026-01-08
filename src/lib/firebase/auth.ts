import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { Admin } from "@/types";

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    console.error("Sign in error:", firebaseError);

    // Throw user-friendly error messages
    switch (firebaseError.code) {
      case "auth/user-not-found":
        throw new Error("No account found with this email");
      case "auth/wrong-password":
        throw new Error("Incorrect password");
      case "auth/invalid-email":
        throw new Error("Invalid email address");
      case "auth/user-disabled":
        throw new Error("This account has been disabled");
      case "auth/too-many-requests":
        throw new Error("Too many failed attempts. Please try again later");
      default:
        throw new Error("Failed to sign in. Please try again");
    }
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Sign out error:", error);
    throw new Error("Failed to sign out");
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Check if user is an admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const adminDoc = await getDoc(doc(db, "admins", userId));
    return adminDoc.exists() && adminDoc.data()?.isActive === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Get admin data for a user
 */
export async function getAdminData(userId: string): Promise<Admin | null> {
  try {
    const adminDoc = await getDoc(doc(db, "admins", userId));
    if (adminDoc.exists()) {
      return { id: adminDoc.id, ...adminDoc.data() } as Admin;
    }
    return null;
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return null;
  }
}

/**
 * Get current user's ID token
 */
export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    return await user.getIdToken();
  } catch (error) {
    console.error("Error getting ID token:", error);
    return null;
  }
}

/**
 * Refresh the current user's ID token
 */
export async function refreshToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    return await user.getIdToken(true);
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}
