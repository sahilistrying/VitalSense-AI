import React, { useState } from "react";
import {
  MapPin,
  Shield,
  Navigation,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface LocationPermissionProps {
  onLocationGranted: () => void;
  onLocationDenied: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const LocationPermission: React.FC<LocationPermissionProps> = ({
  onLocationGranted,
  onLocationDenied,
  isLoading = false,
  error = null,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const benefits = [
    {
      icon: <Navigation className="h-5 w-5 text-blue-600" />,
      title: "Accurate Distances",
      description: "See exact distances to healthcare providers near you",
    },
    {
      icon: <MapPin className="h-5 w-5 text-green-600" />,
      title: "Nearby Doctors",
      description: "Find the closest doctors and specialists in your area",
    },
    {
      icon: <Navigation className="h-5 w-5 text-purple-600" />,
      title: "Turn-by-Turn Directions",
      description: "Get driving directions directly to your chosen doctor",
    },
    {
      icon: <Shield className="h-5 w-5 text-orange-600" />,
      title: "Privacy Protected",
      description: "Your location is only used locally and never stored",
    },
  ];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <span>Enable Location Services</span>
            <Badge variant="secondary" className="ml-2">
              Recommended
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <p className="text-muted-foreground mb-4">
            To provide you with the most accurate results and distances to
            healthcare providers, we'd like to access your current location.
            This information stays on your device and is never shared or stored.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
            >
              {benefit.icon}
              <div>
                <h4 className="font-medium text-sm">{benefit.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy Information */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 text-sm mb-1">
                Your Privacy is Protected
              </h4>
              <ul className="text-xs text-green-800 space-y-1">
                <li className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Location is only used to calculate distances
                </li>
                <li className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  No data is sent to external servers
                </li>
                <li className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  You can disable this anytime in browser settings
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onLocationGranted}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Enable Location
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onLocationDenied}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Skip for Now
          </Button>
        </div>

        {/* Additional Details */}
        <div className="text-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showDetails ? "Hide" : "Show"} technical details
          </button>
        </div>

        {showDetails && (
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">How Location Services Work:</h4>
            <div className="text-xs text-muted-foreground space-y-2">
              <p>
                <strong>Browser API:</strong> We use your browser's built-in
                Geolocation API to determine your approximate location.
              </p>
              <p>
                <strong>Accuracy:</strong> Location accuracy depends on your
                device and available location sources (GPS, WiFi, cellular
                towers).
              </p>
              <p>
                <strong>Permissions:</strong> You can revoke location
                permissions at any time through your browser settings.
              </p>
              <p>
                <strong>Fallback:</strong> If location is disabled, you can
                still search by entering your city or zip code.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
