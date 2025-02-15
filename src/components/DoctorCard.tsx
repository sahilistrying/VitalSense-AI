import React from "react";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Navigation,
  Car,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Doctor } from "@/types/health";
import { format } from "date-fns";

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment?: (doctor: Doctor) => void;
  showDistance?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onBookAppointment,
  showDistance = true,
}) => {
  const handleBookAppointment = () => {
    if (onBookAppointment) {
      onBookAppointment(doctor);
    }
  };

  const handleGetDirections = () => {
    const { lat, lng } = doctor.location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-yellow-600";
    return "text-gray-600";
  };

  const getDistanceColor = (distance: number) => {
    if (distance <= 2) return "text-green-600";
    if (distance <= 5) return "text-yellow-600";
    return "text-orange-600";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDistance = (distance: number) => {
    if (distance < 0.1) return "< 0.1 mi";
    return `${distance.toFixed(1)} mi`;
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={doctor.image} alt={doctor.name} />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {getInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 truncate">
              {doctor.name}
            </h3>
            <Badge className="mb-2" variant="secondary">
              {doctor.specialty}
            </Badge>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star
                  className={`h-4 w-4 fill-current ${getRatingColor(doctor.rating)}`}
                />
                <span className={getRatingColor(doctor.rating)}>
                  {doctor.rating}
                </span>
                <span className="text-xs">
                  ({Math.floor(Math.random() * 100) + 50} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{doctor.experience} years</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Location Information */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Location
          </h4>
          <div className="space-y-1">
            <p className="text-sm font-medium">{doctor.location.address}</p>
            <p className="text-sm text-muted-foreground">
              {doctor.location.city}
            </p>
            {showDistance && doctor.location.distance !== undefined && (
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${getDistanceColor(doctor.location.distance)}`}
                >
                  {formatDistance(doctor.location.distance)} away
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGetDirections}
                  className="h-7 px-2 text-xs"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Directions
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Availability */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Next Available
          </h4>
          <div className="space-y-1">
            <p className="text-sm font-medium text-green-600">
              {format(
                new Date(doctor.availability.nextAvailable),
                "MMM d, yyyy",
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(doctor.availability.nextAvailable), "h:mm a")}
            </p>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <h4 className="text-sm font-medium mb-2">Office Hours</h4>
          <div className="space-y-1">
            {doctor.availability.schedule.map((schedule, index) => (
              <div key={index} className="text-xs text-muted-foreground">
                {schedule}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t pt-4 space-y-2">
          <Button onClick={handleBookAppointment} className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                window.open(`tel:${doctor.contact.phone}`, "_self")
              }
            >
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                window.open(`mailto:${doctor.contact.email}`, "_self")
              }
            >
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
            {showDistance && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleGetDirections}
              >
                <Car className="h-3 w-3 mr-1" />
                Drive
              </Button>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Experience:</span>
            <span className="font-medium">{doctor.experience} years</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Rating:</span>
            <span className="font-medium">{doctor.rating}/5.0</span>
          </div>
          {showDistance && doctor.location.distance !== undefined && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Distance:</span>
              <span
                className={`font-medium ${getDistanceColor(doctor.location.distance)}`}
              >
                {formatDistance(doctor.location.distance)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
