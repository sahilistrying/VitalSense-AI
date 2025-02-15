import React, { useState } from "react";
import { MapPin, Navigation, Search, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocationPermission } from "@/components/LocationPermission";
import { ManualLocationEntry } from "@/components/ManualLocationEntry";

interface LocationSetupWizardProps {
  onLocationSet: (location: {
    address: string;
    coordinates?: { lat: number; lng: number };
  }) => void;
  onSkip: () => void;
}

type Step = "choice" | "permission" | "manual";

export const LocationSetupWizard: React.FC<LocationSetupWizardProps> = ({
  onLocationSet,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>("choice");
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleAutoLocation = () => {
    setCurrentStep("permission");
  };

  const handleManualLocation = () => {
    setCurrentStep("manual");
  };

  const requestGeolocation = () => {
    setIsRequestingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setIsRequestingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSet({
          address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          coordinates: { lat: latitude, lng: longitude },
        });
        setIsRequestingLocation(false);
      },
      (error) => {
        let errorMessage = "Unable to retrieve location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        setLocationError(errorMessage);
        setIsRequestingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  const handleLocationDenied = () => {
    setCurrentStep("manual");
  };

  const handleManualLocationSubmit = (
    address: string,
    coordinates?: { lat: number; lng: number },
  ) => {
    onLocationSet({ address, coordinates });
  };

  if (currentStep === "permission") {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep("choice")}
            className="text-sm text-muted-foreground"
          >
            ← Back to options
          </Button>
        </div>
        <LocationPermission
          onLocationGranted={requestGeolocation}
          onLocationDenied={handleLocationDenied}
          isLoading={isRequestingLocation}
          error={locationError}
        />
      </div>
    );
  }

  if (currentStep === "manual") {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep("choice")}
            className="text-sm text-muted-foreground"
          >
            ← Back to options
          </Button>
        </div>
        <ManualLocationEntry onLocationSubmit={handleManualLocationSubmit} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Find Doctors Near You</h2>
        <p className="text-muted-foreground">
          How would you like to set your location to find nearby healthcare
          providers?
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Auto Location Option */}
        <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Navigation className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Use My Location</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Automatically detect your current location for accurate
                  results and distances.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                  <li>✓ Most accurate distances</li>
                  <li>✓ Real-time location</li>
                  <li>✓ Turn-by-turn directions</li>
                </ul>
              </div>
              <Button onClick={handleAutoLocation} className="w-full">
                <Navigation className="mr-2 h-4 w-4" />
                Enable Location
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manual Location Option */}
        <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Enter Location</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manually enter your city, address, or zip code to find doctors
                  in your area.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                  <li>✓ No location permission needed</li>
                  <li>✓ Search any area</li>
                  <li>✓ Privacy-friendly option</li>
                </ul>
              </div>
              <Button
                onClick={handleManualLocation}
                variant="outline"
                className="w-full"
              >
                <Search className="mr-2 h-4 w-4" />
                Enter Manually
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button
          variant="ghost"
          onClick={onSkip}
          className="text-sm text-muted-foreground"
        >
          Skip for now and browse all doctors
        </Button>
      </div>
    </div>
  );
};
