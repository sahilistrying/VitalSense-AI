import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
  timestamp: number | null;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: false,
    timestamp: null,
  });

  const defaultOptions: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 300000, // 5 minutes
    ...options,
  };

  const updatePosition = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      error: null,
      isLoading: false,
      timestamp: position.timestamp,
    });
  }, []);

  const updateError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = "Unable to retrieve location";

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage =
          "Location access denied. Please enable location services and refresh the page.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage =
          "Location information is unavailable. Please check your device settings.";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out. Please try again.";
        break;
      default:
        errorMessage = `Location error: ${error.message}`;
    }

    setState((prev) => ({
      ...prev,
      error: errorMessage,
      isLoading: false,
    }));
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
        isLoading: false,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    navigator.geolocation.getCurrentPosition(
      updatePosition,
      updateError,
      defaultOptions,
    );
  }, [updatePosition, updateError, defaultOptions]);

  // Automatically request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Watch position changes
  const watchPosition = useCallback(() => {
    if (!navigator.geolocation) {
      return null;
    }

    const watchId = navigator.geolocation.watchPosition(
      updatePosition,
      updateError,
      defaultOptions,
    );

    return watchId;
  }, [updatePosition, updateError, defaultOptions]);

  const clearWatch = useCallback((watchId: number) => {
    navigator.geolocation.clearWatch(watchId);
  }, []);

  // Calculate distance to a point
  const calculateDistanceTo = useCallback(
    (targetLat: number, targetLng: number): number | null => {
      if (!state.latitude || !state.longitude) {
        return null;
      }

      const R = 3959; // Earth's radius in miles
      const dLat = ((targetLat - state.latitude) * Math.PI) / 180;
      const dLon = ((targetLng - state.longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((state.latitude * Math.PI) / 180) *
          Math.cos((targetLat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    [state.latitude, state.longitude],
  );

  // Check if location is fresh (within maximumAge)
  const isLocationFresh = useCallback(() => {
    if (!state.timestamp) return false;
    const now = Date.now();
    return now - state.timestamp < (defaultOptions.maximumAge || 300000);
  }, [state.timestamp, defaultOptions.maximumAge]);

  return {
    ...state,
    requestLocation,
    watchPosition,
    clearWatch,
    calculateDistanceTo,
    isLocationFresh,
    hasLocation: state.latitude !== null && state.longitude !== null,
    isSupported: "geolocation" in navigator,
  };
};
