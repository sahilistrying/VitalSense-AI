export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  medicalInfo?: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    dataSharing: boolean;
  };
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  phone?: string;
  acceptTerms: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}
