import { useState, useEffect } from "react";
import { HealthHistory } from "../types/health";

export const useHealthHistory = () => {
  const [history, setHistory] = useState<HealthHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load history from localStorage
    try {
      const savedHistory = localStorage.getItem("healthHistory");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load health history:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addEntry = (entry: Omit<HealthHistory, "id">) => {
    const newEntry: HealthHistory = {
      ...entry,
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);

    // Save to localStorage
    try {
      localStorage.setItem("healthHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save health history:", error);
    }
  };

  const removeEntry = (id: string) => {
    const updatedHistory = history.filter((entry) => entry.id !== id);
    setHistory(updatedHistory);

    try {
      localStorage.setItem("healthHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save health history:", error);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("healthHistory");
    } catch (error) {
      console.error("Failed to clear health history:", error);
    }
  };

  const getRecentEntries = (count: number = 5) => {
    return history.slice(0, count);
  };

  const getEntriesByDateRange = (startDate: Date, endDate: Date) => {
    return history.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  return {
    history,
    isLoading,
    addEntry,
    removeEntry,
    clearHistory,
    getRecentEntries,
    getEntriesByDateRange,
  };
};
