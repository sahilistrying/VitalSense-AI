import React, { useState } from "react";
import { MapPin, Search, Navigation, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ManualLocationEntryProps {
  onLocationSubmit: (
    address: string,
    coordinates?: { lat: number; lng: number },
  ) => void;
  isLoading?: boolean;
}

// Mock geocoding function - in a real app, you'd use Google Maps Geocoding API
const geocodeAddress = async (
  address: string,
): Promise<{ lat: number; lng: number } | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock coordinates for common locations
  const mockLocations: Record<string, { lat: number; lng: number }> = {
    "new york": { lat: 40.7128, lng: -74.006 },
    nyc: { lat: 40.7128, lng: -74.006 },
    manhattan: { lat: 40.7831, lng: -73.9712 },
    brooklyn: { lat: 40.6782, lng: -73.9442 },
    queens: { lat: 40.7282, lng: -73.7949 },
    bronx: { lat: 40.8448, lng: -73.8648 },
    "los angeles": { lat: 34.0522, lng: -118.2437 },
    chicago: { lat: 41.8781, lng: -87.6298 },
    miami: { lat: 25.7617, lng: -80.1918 },
    boston: { lat: 42.3601, lng: -71.0589 },
    "san francisco": { lat: 37.7749, lng: -122.4194 },
    seattle: { lat: 47.6062, lng: -122.3321 },
    atlanta: { lat: 33.749, lng: -84.388 },
    dallas: { lat: 32.7767, lng: -96.797 },
    philadelphia: { lat: 39.9526, lng: -75.1652 },
  };

  const normalizedAddress = address.toLowerCase();

  // Check for direct matches
  for (const [key, coords] of Object.entries(mockLocations)) {
    if (normalizedAddress.includes(key)) {
      return coords;
    }
  }

  // Check for zip codes (mock some common NYC zip codes)
  if (/^\d{5}$/.test(address)) {
    const zipCode = address;
    const nycZips = [
      "10001",
      "10002",
      "10003",
      "10004",
      "10005",
      "10010",
      "10011",
      "10012",
    ];
    if (nycZips.includes(zipCode)) {
      return {
        lat: 40.7128 + Math.random() * 0.1,
        lng: -74.006 + Math.random() * 0.1,
      };
    }
  }

  return null; // Address not found
};

export const ManualLocationEntry: React.FC<ManualLocationEntryProps> = ({
  onLocationSubmit,
  isLoading = false,
}) => {
  const [address, setAddress] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      setError("Please enter an address, city, or zip code");
      return;
    }

    setIsGeocoding(true);
    setError(null);

    try {
      const coordinates = await geocodeAddress(address.trim());

      if (coordinates) {
        onLocationSubmit(address.trim(), coordinates);
      } else {
        // Even if geocoding fails, we can still use the address for display
        onLocationSubmit(address.trim());
        setError(
          "Could not find exact coordinates, but will search in this area",
        );
      }
    } catch (err) {
      setError("Failed to process location. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const quickLocations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Miami, FL",
    "Boston, MA",
    "San Francisco, CA",
  ];

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Enter Your Location
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address, City, or Zip Code</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="address"
                type="text"
                placeholder="e.g., New York, NY or 10001"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setError(null);
                }}
                className="pl-10"
                disabled={isLoading || isGeocoding}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isGeocoding || !address.trim()}
          >
            {isGeocoding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding Location...
              </>
            ) : (
              <>
                <Navigation className="mr-2 h-4 w-4" />
                Search Doctors
              </>
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Quick locations
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {quickLocations.map((location) => (
            <Button
              key={location}
              variant="outline"
              size="sm"
              onClick={() => setAddress(location)}
              disabled={isLoading || isGeocoding}
              className="text-xs"
            >
              {location}
            </Button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          <p>
            We'll search for doctors in and around your specified location. For
            best results, include city and state.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
