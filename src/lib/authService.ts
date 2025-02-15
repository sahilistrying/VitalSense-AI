import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { ref, set, get, update, push } from "firebase/database";
import { auth, database } from "./firebase";
import { User } from "@/types/auth";

// Convert Firebase user to our User type
export const convertFirebaseUser = async (
  firebaseUser: FirebaseUser,
): Promise<User> => {
  const userRef = ref(database, `users/${firebaseUser.uid}`);
  const snapshot = await get(userRef);
  const userData = snapshot.val();

  // If user data doesn't exist in database, create basic profile
  if (!userData) {
    const basicUserData = {
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || "",
      firstName: firebaseUser.displayName?.split(" ")[0] || "",
      lastName: firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      preferences: {
        notifications: true,
        newsletter: false,
        dataSharing: false,
      },
    };

    await set(userRef, basicUserData);

    return {
      id: firebaseUser.uid,
      ...basicUserData,
    };
  }

  return {
    id: firebaseUser.uid,
    ...userData,
  };
};

// Sign up with email and password
export const signUpWithEmailPassword = async (
  email: string,
  password: string,
  additionalData: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
  },
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const firebaseUser = userCredential.user;

    // Update display name
    await updateProfile(firebaseUser, {
      displayName: `${additionalData.firstName} ${additionalData.lastName}`,
    });

    // Create user profile in database
    const userData = {
      email: firebaseUser.email || "",
      name: `${additionalData.firstName} ${additionalData.lastName}`,
      firstName: additionalData.firstName,
      lastName: additionalData.lastName,
      dateOfBirth: additionalData.dateOfBirth,
      gender: additionalData.gender,
      phone: additionalData.phone,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      preferences: {
        notifications: true,
        newsletter: false,
        dataSharing: false,
      },
    };

    const userRef = ref(database, `users/${firebaseUser.uid}`);
    await set(userRef, userData);

    return {
      id: firebaseUser.uid,
      ...userData,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign in with email and password
export const signInWithEmailPassword = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const firebaseUser = userCredential.user;

    // Update last login
    const userRef = ref(database, `users/${firebaseUser.uid}`);
    await update(userRef, {
      lastLogin: new Date().toISOString(),
    });

    return await convertFirebaseUser(firebaseUser);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>,
): Promise<void> => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, updates);

    // Update Firebase auth profile if name changed
    if (updates.firstName || updates.lastName) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName:
            `${updates.firstName || ""} ${updates.lastName || ""}`.trim(),
        });
      }
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const user = await convertFirebaseUser(firebaseUser);
        callback(user);
      } catch (error) {
        console.error("Error converting Firebase user:", error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Save health history to Firebase
export const saveHealthHistory = async (userId: string, historyData: any) => {
  try {
    const historyRef = ref(database, `healthHistory/${userId}`);
    await push(historyRef, {
      ...historyData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get health history from Firebase
export const getHealthHistory = async (userId: string) => {
  try {
    const historyRef = ref(database, `healthHistory/${userId}`);
    const snapshot = await get(historyRef);
    const data = snapshot.val();

    if (!data) return [];

    // Convert object to array with IDs
    return Object.entries(data).map(([id, historyItem]) => ({
      id,
      ...historyItem,
    }));
  } catch (error: any) {
    console.error("Error getting health history:", error);
    return [];
  }
};

// Save chat messages to Firebase
export const saveChatMessage = async (userId: string, message: any) => {
  try {
    const messagesRef = ref(database, `chatMessages/${userId}`);
    await push(messagesRef, {
      ...message,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get chat messages from Firebase
export const getChatMessages = async (userId: string) => {
  try {
    const messagesRef = ref(database, `chatMessages/${userId}`);
    const snapshot = await get(messagesRef);
    const data = snapshot.val();

    if (!data) return [];

    // Convert object to array with IDs and sort by timestamp
    return Object.entries(data)
      .map(([id, message]) => ({
        id,
        ...message,
      }))
      .sort(
        (a: any, b: any) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
  } catch (error: any) {
    console.error("Error getting chat messages:", error);
    return [];
  }
};
