import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { User as UserType } from "@/types/auth";
import { format } from "date-fns";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<UserType>>(user || {});

  if (!user) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser(user);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleSave = async () => {
    try {
      await updateProfile(editedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>User Profile</span>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            Manage your personal information and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editedUser.firstName || ""}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="First Name"
                  />
                  <Input
                    value={editedUser.lastName || ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    Member since {format(new Date(user.createdAt), "MMM yyyy")}
                  </Badge>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Contact Information</h4>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedUser.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{user.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editedUser.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Phone number"
                  />
                ) : (
                  <p className="text-sm">{user.phone || "Not provided"}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Personal Information</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date of Birth
                </Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedUser.dateOfBirth || ""}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                  />
                ) : (
                  <p className="text-sm">
                    {user.dateOfBirth
                      ? format(new Date(user.dateOfBirth), "MMM dd, yyyy")
                      : "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                {isEditing ? (
                  <Select
                    value={editedUser.gender || "none"}
                    onValueChange={(value) =>
                      handleInputChange("gender", value === "none" ? "" : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select gender</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm capitalize">
                    {user.gender || "Not specified"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Medical Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Medical Information</h4>

            <div className="space-y-3">
              <div>
                <Label>Allergies</Label>
                <div className="mt-1">
                  {user.medicalInfo?.allergies?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {user.medicalInfo.allergies.map((allergy, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      None reported
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Current Medications</Label>
                <div className="mt-1">
                  {user.medicalInfo?.medications?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {user.medicalInfo.medications.map((medication, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {medication}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      None reported
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Medical Conditions</Label>
                <div className="mt-1">
                  {user.medicalInfo?.conditions?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {user.medicalInfo.conditions.map((condition, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      None reported
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Stats */}
          <div className="space-y-4">
            <h4 className="font-medium">Account Statistics</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {format(new Date(user.createdAt), "MMM yyyy")}
                </p>
                <p className="text-xs text-muted-foreground">Member Since</p>
              </div>

              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {user.lastLogin
                    ? format(new Date(user.lastLogin), "MMM dd")
                    : "Never"}
                </p>
                <p className="text-xs text-muted-foreground">Last Login</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
