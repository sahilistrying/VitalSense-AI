import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { LoginCredentials } from "@/types/auth";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSwitchToSignUp,
}) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<LoginCredentials>>({});

  const validateForm = (): boolean => {
    const errors: Partial<LoginCredentials> = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
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
      await login(formData);
      onClose();
      // Reset form
      setFormData({ email: "", password: "" });
      setFormErrors({});
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
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
    setFormData({ email: "", password: "" });
    setFormErrors({});
    clearError();
    onClose();
  };

  const handleSwitchToSignUp = () => {
    setFormData({ email: "", password: "" });
    setFormErrors({});
    clearError();
    onSwitchToSignUp();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to access your health dashboard
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`pl-10 pr-10 ${formErrors.password ? "border-red-500" : ""}`}
                disabled={isLoading}
                autoComplete="current-password"
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              disabled={isLoading}
            >
              Forgot your password?
            </button>
          </div>

          <Separator />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleSwitchToSignUp}
              disabled={isLoading}
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </form>

        {/* Firebase Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-medium text-blue-900 mb-1">
            Powered by Firebase Authentication
          </p>
          <p className="text-xs text-blue-800">
            Secure authentication with Google's Firebase platform
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
