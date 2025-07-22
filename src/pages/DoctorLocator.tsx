import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  MapPin,
  Filter,
  Search,
  Map,
  List,
  Navigation,
  AlertCircle,
  Loader2,
  Target,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoctorCard } from "@/components/DoctorCard";
import { doctors, getDoctorsBySpecialty } from "@/data/doctors";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Doctor } from "@/types/health";

const specialties = [
  "General Practitioner",
  "Cardiologist",
  "Pulmonologist",
  "Neurologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Psychiatrist",
  "Rheumatologist",
  "Allergist",
  "Urologist",
];

const distanceOptions = [
  { value: "5", label: "5 miles" },
  { value: "10", label: "10 miles" },
  { value: "25", label: "25 miles" },
  { value: "50", label: "50 miles" },
  { value: "100", label: "100 miles" },
];

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get user's approximate address from coordinates (mock implementation)
const getAddressFromCoordinates = async (
  lat: number,
  lng: number,
): Promise<string> => {
  // In a real app, you'd use a geocoding service like Google Maps or Mapbox
  // For demo purposes, we'll return a mock address
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        `${Math.round(lat * 100) / 100}°N, ${Math.round(lng * 100) / 100}°W`,
      );
    }, 500);
  });
};

export const DoctorLocator: React.FC = () => {
  const location = useLocation();
  const {
    latitude,
    longitude,
    error: locationError,
    isLoading: locationLoading,
    requestLocation,
  } = useGeolocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [maxDistance, setMaxDistance] = useState<string>("25");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "experience">(
    "distance",
  );
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [userAddress, setUserAddress] = useState<string>("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Check if we have a specialty filter from navigation state
  useEffect(() => {
    if (location.state?.specialty) {
      setSelectedSpecialty(location.state.specialty);
    }
  }, [location.state]);

  // Get user address when coordinates are available
  useEffect(() => {
    if (latitude && longitude) {
      setIsLoadingAddress(true);
      getAddressFromCoordinates(latitude, longitude)
        .then((address) => {
          setUserAddress(address);
          setIsLoadingAddress(false);
        })
        .catch(() => {
          setUserAddress("Unknown location");
          setIsLoadingAddress(false);
        });
    }
  }, [latitude, longitude]);

  // Filter and sort doctors based on user location and preferences
  useEffect(() => {
    let filtered = [...doctors];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.location.city.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply specialty filter
    if (selectedSpecialty) {
      filtered = getDoctorsBySpecialty(selectedSpecialty);
      if (searchTerm) {
        filtered = filtered.filter(
          (doctor) =>
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.location.city
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        );
      }
    }

    // Calculate distances and apply distance filter if user location is available
    if (latitude && longitude) {
      filtered = filtered.map((doctor) => ({
        ...doctor,
        location: {
          ...doctor.location,
          distance: calculateDistance(
            latitude,
            longitude,
            doctor.location.coordinates.lat,
            doctor.location.coordinates.lng,
          ),
        },
      }));

      // Filter by maximum distance
      const maxDistanceNum = parseInt(maxDistance);
      filtered = filtered.filter(
        (doctor) => doctor.location.distance <= maxDistanceNum,
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "experience":
          return b.experience - a.experience;
        case "distance":
        default:
          if (latitude && longitude) {
            return a.location.distance - b.location.distance;
          }
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, maxDistance, sortBy, latitude, longitude]);

  const handleBookAppointment = (doctor: Doctor) => {
    // In a real app, this would integrate with booking systems
    alert(
      `Booking appointment with ${doctor.name}. In a real app, this would open the booking interface.`,
    );
  };

  const LocationStatus = () => {
    if (locationLoading) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Getting your location...</span>
        </div>
      );
    }

    if (locationError) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{locationError}</span>
            <Button variant="outline" size="sm" onClick={requestLocation}>
              <Target className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    if (latitude && longitude) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
          <MapPin className="h-4 w-4" />
          <span>
            Location found:{" "}
            {isLoadingAddress ? "Loading address..." : userAddress}
          </span>
        </div>
      );
    }

    return (
      <Alert className="mb-4">
        <Navigation className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Enable location for accurate distance calculations</span>
          <Button variant="outline" size="sm" onClick={requestLocation}>
            <Target className="h-4 w-4 mr-1" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Find Healthcare Providers
            </h1>
            <p className="text-muted-foreground">
              Discover qualified doctors and specialists near you
            </p>
          </div>

          {/* Location Status */}
          <LocationStatus />

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search doctors, specialties, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={selectedSpecialty || "all"}
                  onValueChange={(value) =>
                    setSelectedSpecialty(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-full lg:w-60">
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={maxDistance} onValueChange={setMaxDistance}>
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {distanceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        Within {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={sortBy}
                  onValueChange={(
                    value: "distance" | "rating" | "experience",
                  ) => setSortBy(value)}
                >
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Sort by Distance</SelectItem>
                    <SelectItem value="rating">Sort by Rating</SelectItem>
                    <SelectItem value="experience">
                      Sort by Experience
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("map")}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Active Filters Display */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {latitude && longitude
                      ? `Showing doctors within ${maxDistance} miles of your location`
                      : "Enable location for distance-based search"}
                  </span>
                </div>

                {(selectedSpecialty || searchTerm) && (
                  <div className="flex items-center gap-2">
                    {selectedSpecialty && (
                      <Badge variant="secondary">
                        {selectedSpecialty}
                        <button
                          onClick={() => setSelectedSpecialty("")}
                          className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {searchTerm && (
                      <Badge variant="secondary">
                        Search: "{searchTerm}"
                        <button
                          onClick={() => setSearchTerm("")}
                          className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                {filteredDoctors.length} Doctors Found
              </h2>
              {latitude && longitude && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <MapPin className="h-3 w-3 mr-1" />
                  Location-based results
                </Badge>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Sorted by{" "}
              {sortBy === "distance"
                ? "distance"
                : sortBy === "rating"
                  ? "rating"
                  : "experience"}
            </div>
          </div>

          {/* Doctor List */}
          {viewMode === "list" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onBookAppointment={handleBookAppointment}
                  showDistance={latitude && longitude}
                />
              ))}
            </div>
          )}

          {/* Map View */}
          {viewMode === "map" && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="max-w-md mx-auto">
                  <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">
                    Interactive Map Coming Soon
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We're working on an interactive map that will show doctor
                    locations with:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                    <li>• Real-time location pins</li>
                    <li>• Driving directions</li>
                    <li>• Street view integration</li>
                    <li>• Availability indicators</li>
                  </ul>
                  <Button variant="outline" onClick={() => setViewMode("list")}>
                    View as List
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {filteredDoctors.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No doctors found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {latitude && longitude
                    ? `No doctors found within ${maxDistance} miles of your location with the current filters.`
                    : "Try adjusting your search criteria or enable location for better results."}
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSpecialty("");
                      setMaxDistance("50");
                    }}
                  >
                    Clear Filters
                  </Button>
                  {!latitude && (
                    <Button onClick={requestLocation}>
                      <Target className="h-4 w-4 mr-2" />
                      Enable Location
                    </Button>
                  )}
                  {latitude && longitude && (
                    <Button
                      variant="outline"
                      onClick={() => setMaxDistance("100")}
                    >
                      Expand to 100 miles
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Benefits */}
          {!latitude && !locationError && (
            <Card className="mt-8 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">
                      Enable Location for Better Results
                    </h4>
                    <p className="text-sm text-blue-800 mb-3">
                      Allow location access to find doctors near you with
                      accurate distances, driving directions, and personalized
                      recommendations.
                    </p>
                    <Button size="sm" onClick={requestLocation}>
                      <Navigation className="h-4 w-4 mr-2" />
                      Enable Location Services
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emergency Notice */}
          <Card className="mt-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">
                    Medical Emergency?
                  </h4>
                  <p className="text-sm text-red-800 mb-3">
                    If you're experiencing a medical emergency, don't search for
                    doctors. Call 911 immediately or go to the nearest emergency
                    room.
                  </p>
                  <Button size="sm" variant="destructive">
                    <Navigation className="h-4 w-4 mr-2" />
                    Emergency: Call 911
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
