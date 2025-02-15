import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  AuthState,
  LoginCredentials,
  SignUpData,
  AuthContextType,
} from "@/types/auth";
import {
  signUpWithEmailPassword,
  signInWithEmailPassword,
  signOutUser,
  updateUserProfile,
  onAuthStateChange,
} from "@/lib/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      });
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await signInWithEmailPassword(
        credentials.email,
        credentials.password,
      );

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = "Login failed";

      if (error instanceof Error) {
        if (error.message.includes("user-not-found")) {
          errorMessage = "No account found with this email address";
        } else if (error.message.includes("wrong-password")) {
          errorMessage = "Incorrect password";
        } else if (error.message.includes("invalid-email")) {
          errorMessage = "Invalid email address";
        } else if (error.message.includes("too-many-requests")) {
          errorMessage = "Too many failed attempts. Please try again later";
        } else {
          errorMessage = error.message;
        }
      }

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  };

  const signup = async (data: SignUpData) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Validate signup data
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (data.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (!data.acceptTerms) {
        throw new Error("You must accept the terms and conditions");
      }

      const user = await signUpWithEmailPassword(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phone: data.phone,
      });

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = "Signup failed";

      if (error instanceof Error) {
        if (error.message.includes("email-already-in-use")) {
          errorMessage = "An account with this email already exists";
        } else if (error.message.includes("weak-password")) {
          errorMessage =
            "Password is too weak. Please choose a stronger password";
        } else if (error.message.includes("invalid-email")) {
          errorMessage = "Invalid email address";
        } else {
          errorMessage = error.message;
        }
      }

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) {
      throw new Error("No user logged in");
    }

    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await updateUserProfile(authState.user.id, updates);

      const updatedUser = { ...authState.user, ...updates };

      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Profile update failed";

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
