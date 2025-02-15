import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  Loader2,
  AlertCircle,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { SignUpData } from "@/types/auth";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSwitchToSignIn,
}) => {
  const { signup, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<SignUpData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: undefined,
    phone: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof SignUpData, string>>
  >({});

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof SignUpData, string>> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = "You must accept the terms and conditions";
    }

    // Optional field validations
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13 || age > 120) {
        errors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signup(formData);
      onClose();
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: "",
        gender: undefined,
        phone: "",
        acceptTerms: false,
      });
      setFormErrors({});
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleInputChange = (
    field: keyof SignUpData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Clear general error
    if (error) {
      clearError();
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      gender: undefined,
      phone: "",
      acceptTerms: false,
    });
    setFormErrors({});
    clearError();
    onClose();
  };

  const handleSwitchToSignIn = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      gender: undefined,
      phone: "",
      acceptTerms: false,
    });
    setFormErrors({});
    clearError();
    onSwitchToSignIn();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Create Account
          </DialogTitle>
          <DialogDescription className="text-center">
            Join Your Care to start your wellness journey
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={`pl-10 ${formErrors.firstName ? "border-red-500" : ""}`}
                  disabled={isLoading}
                  autoComplete="given-name"
                />
              </div>
              {formErrors.firstName && (
                <p className="text-sm text-red-500">{formErrors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={formErrors.lastName ? "border-red-500" : ""}
                disabled={isLoading}
                autoComplete="family-name"
              />
              {formErrors.lastName && (
                <p className="text-sm text-red-500">{formErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-10 ${formErrors.email ? "border-red-500" : ""}`}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`pl-10 pr-10 ${formErrors.password ? "border-red-500" : ""}`}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`pl-10 pr-10 ${formErrors.confirmPassword ? "border-red-500" : ""}`}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className={`pl-10 ${formErrors.dateOfBirth ? "border-red-500" : ""}`}
                  disabled={isLoading}
                />
              </div>
              {formErrors.dateOfBirth && (
                <p className="text-sm text-red-500">{formErrors.dateOfBirth}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Gender (Optional)</Label>
              <Select
                value={formData.gender || "none"}
                onValueChange={(value) =>
                  handleInputChange(
                    "gender",
                    value === "none"
                      ? ""
                      : (value as "male" | "female" | "other"),
                  )
                }
                disabled={isLoading}
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
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`pl-10 ${formErrors.phone ? "border-red-500" : ""}`}
                disabled={isLoading}
                autoComplete="tel"
              />
            </div>
            {formErrors.phone && (
              <p className="text-sm text-red-500">{formErrors.phone}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("acceptTerms", checked as boolean)
                }
                disabled={isLoading}
                className={formErrors.acceptTerms ? "border-red-500" : ""}
              />
              <label
                htmlFor="acceptTerms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <button type="button" className="text-primary hover:underline">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="text-primary hover:underline">
                  Privacy Policy
                </button>
              </label>
            </div>
            {formErrors.acceptTerms && (
              <p className="text-sm text-red-500">{formErrors.acceptTerms}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <Separator />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Already have an account?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleSwitchToSignIn}
              disabled={isLoading}
              className="w-full"
            >
              Sign In
            </Button>
          </div>
        </form>

        {/* Firebase Info */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs font-medium text-green-900 mb-1">
            Secure Registration with Firebase
          </p>
          <p className="text-xs text-green-800">
            Your data is protected with enterprise-grade security
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
