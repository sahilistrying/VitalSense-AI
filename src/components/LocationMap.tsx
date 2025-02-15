import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/types/health";

interface LocationMapProps {
  doctors: Doctor[];
  userLocation?: {
    lat: number;
    lng: number;
  };
  onDoctorSelect?: (doctor: Doctor) => void;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  doctors,
  userLocation,
  onDoctorSelect,
}) => {
  // This is a placeholder component - in a real app, you'd integrate with Google Maps, Mapbox, etc.

  return (
    <Card className="h-96">
      <CardContent className="p-8 h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-12 w-12 text-primary" />
            </div>
            {userLocation && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Navigation className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          <h3 className="font-semibold text-lg mb-2">
            Interactive Map Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            We're working on an interactive map that will show doctor locations,
            driving directions, and real-time availability. For now, you can
            view doctor locations in the list format with distance information.
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available Doctors ({doctors.length})</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-xs text-muted-foreground">Upcoming features:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Interactive map with doctor pins</li>
              <li>• Turn-by-turn directions</li>
              <li>• Real-time traffic updates</li>
              <li>• Street view integration</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
