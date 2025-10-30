// Types and interfaces for authentication context
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  registerStudent: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  registerTeacher: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
}

// API Request/Response types
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  privacy_policy_accepted: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface ApiError {
  detail: string;
  status_code: number;
}
