import React, { createContext, useContext, useState, useEffect } from "react";
import {
  HealthHistory,
  PredictionResult,
  ChatMessage,
  UserProfile,
} from "../types/health";
import { useAuth } from "./AuthContext";
import {
  saveHealthHistory,
  getHealthHistory,
  saveChatMessage,
  getChatMessages,
} from "@/lib/authService";

interface HealthContextType {
  // Current session state
  selectedSymptoms: string[];
  setSelectedSymptoms: (symptoms: string[]) => void;
  currentPrediction: PredictionResult | null;
  setCurrentPrediction: (prediction: PredictionResult | null) => void;

  // History management
  healthHistory: HealthHistory[];
  addToHistory: (entry: Omit<HealthHistory, "id">) => void;
  clearHistory: () => void;

  // Chat messages
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearChatMessages: () => void;

  // User profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;

  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error("useHealth must be used within a HealthProvider");
  }
  return context;
};

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [currentPrediction, setCurrentPrediction] =
    useState<PredictionResult | null>(null);
  const [healthHistory, setHealthHistory] = useState<HealthHistory[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data when authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && user) {
        try {
          setIsLoading(true);

          // Load health history from Firebase
          const history = await getHealthHistory(user.id);
          setHealthHistory(history);

          // Load chat messages from Firebase
          const messages = await getChatMessages(user.id);
          setChatMessages(messages);
        } catch (error) {
          console.error("Error loading user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Clear data when not authenticated
        setHealthHistory([]);
        setChatMessages([]);
        setUserProfile(null);
      }
    };

    loadUserData();
  }, [user, isAuthenticated]);

  const addToHistory = async (entry: Omit<HealthHistory, "id">) => {
    const newEntry: HealthHistory = {
      ...entry,
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // Update local state immediately
    setHealthHistory((prev) => [newEntry, ...prev]);

    // Save to Firebase if user is authenticated
    if (isAuthenticated && user) {
      try {
        await saveHealthHistory(user.id, newEntry);
      } catch (error) {
        console.error("Error saving health history:", error);
        // Revert local state on error
        setHealthHistory((prev) =>
          prev.filter((item) => item.id !== newEntry.id),
        );
      }
    } else {
      // For non-authenticated users, store in localStorage as fallback
      const existingHistory = JSON.parse(
        localStorage.getItem("guestHealthHistory") || "[]",
      );
      localStorage.setItem(
        "guestHealthHistory",
        JSON.stringify([newEntry, ...existingHistory]),
      );
    }
  };

  const clearHistory = async () => {
    setHealthHistory([]);

    if (isAuthenticated && user) {
      // In a real implementation, you might want to add a clearHealthHistory function
      // For now, we'll keep the Firebase data and just clear the local state
      console.log("Health history cleared locally. Firebase data preserved.");
    } else {
      localStorage.removeItem("guestHealthHistory");
    }
  };

  const addChatMessage = async (
    message: Omit<ChatMessage, "id" | "timestamp">,
  ) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    // Update local state immediately
    setChatMessages((prev) => [...prev, newMessage]);

    // Save to Firebase if user is authenticated
    if (isAuthenticated && user) {
      try {
        await saveChatMessage(user.id, newMessage);
      } catch (error) {
        console.error("Error saving chat message:", error);
        // Revert local state on error
        setChatMessages((prev) =>
          prev.filter((msg) => msg.id !== newMessage.id),
        );
      }
    } else {
      // For non-authenticated users, store in localStorage as fallback
      const existingMessages = JSON.parse(
        localStorage.getItem("guestChatMessages") || "[]",
      );
      localStorage.setItem(
        "guestChatMessages",
        JSON.stringify([...existingMessages, newMessage]),
      );
    }
  };

  const clearChatMessages = () => {
    setChatMessages([]);

    if (!isAuthenticated || !user) {
      localStorage.removeItem("guestChatMessages");
    }
  };

  // Load guest data from localStorage if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const guestHistory = JSON.parse(
        localStorage.getItem("guestHealthHistory") || "[]",
      );
      const guestMessages = JSON.parse(
        localStorage.getItem("guestChatMessages") || "[]",
      );

      setHealthHistory(guestHistory);
      setChatMessages(guestMessages);
    }
  }, [isAuthenticated]);

  const value: HealthContextType = {
    selectedSymptoms,
    setSelectedSymptoms,
    currentPrediction,
    setCurrentPrediction,
    healthHistory,
    addToHistory,
    clearHistory,
    chatMessages,
    addChatMessage,
    clearChatMessages,
    userProfile,
    setUserProfile,
    isLoading,
    setIsLoading,
  };

  return (
    <HealthContext.Provider value={value}>{children}</HealthContext.Provider>
  );
};
