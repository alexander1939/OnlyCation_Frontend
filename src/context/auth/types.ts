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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  registerStudent: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  registerTeacher: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  uploadTeacherDocuments: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyPasswordReset: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshToken: () => Promise<string | null>;
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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

export interface ApiError {
  detail: string;
  status_code: number;
}
