// Servicio para manejar la autenticación con el backend OnlyCation APIs
const API_BASE_URL = '/api'; // Usar proxy de Vite para evitar CORS

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

class AuthService {
  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        detail: 'Error de conexión con el servidor',
        status_code: response.status 
      }));
      throw new Error(errorData.detail || 'Error desconocido');
    }

    return response.json();
  }

  // Registro de estudiante
  async registerStudent(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/student/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });

      return this.handleResponse<RegisterResponse>(response);
    } catch (error) {
      console.error('Error registering student:', error);
      throw error;
    }
  }

  // Registro de docente
  async registerTeacher(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/teacher/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });

      return this.handleResponse<RegisterResponse>(response);
    } catch (error) {
      console.error('Error registering teacher:', error);
      throw error;
    }
  }

  // Subir documentos de docente (separado del registro inicial)
  async uploadTeacherDocuments(formData: FormData): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers/documents/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          // No incluir Content-Type para FormData, el browser lo maneja automáticamente
        },
        body: formData,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error uploading teacher documents:', error);
      throw error;
    }
  }

  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      const result = await this.handleResponse<LoginResponse>(response);
      
      // Guardar tokens en localStorage
      if (result.success && result.data) {
        localStorage.setItem('access_token', result.data.access_token);
        localStorage.setItem('refresh_token', result.data.refresh_token);
        localStorage.setItem('user_email', result.data.email);
        localStorage.setItem('user_role', result.data.role);
        localStorage.setItem('user_name', `${result.data.first_name} ${result.data.last_name}`);
      }

      return result;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const email = localStorage.getItem('user_email');
      if (email) {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: this.getHeaders(true),
          body: JSON.stringify({ email }),
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Limpiar localStorage independientemente del resultado
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
    }
  }

  // Refresh token
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh-token/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ token: refreshToken }),
      });

      const result = await this.handleResponse<{
        success: boolean;
        data: { access_token: string; token_type: string };
      }>(response);

      if (result.success && result.data) {
        localStorage.setItem('access_token', result.data.access_token);
        return result.data.access_token;
      }

      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Si falla el refresh, limpiar tokens
      this.logout();
      return null;
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Obtener información del usuario actual
  getCurrentUser(): {
    email: string;
    name: string;
    role: string;
  } | null {
    const email = localStorage.getItem('user_email');
    const name = localStorage.getItem('user_name');
    const role = localStorage.getItem('user_role');

    if (email && name && role) {
      return { email, name, role };
    }

    return null;
  }

  // Solicitar reset de contraseña
  async requestPasswordReset(email: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset/request`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email }),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  }

  // Verificar código de reset de contraseña
  async verifyPasswordReset(email: string, code: string, newPassword: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset/verify`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          email,
          code,
          new_password: newPassword,
        }),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error verifying password reset:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const authService = new AuthService();
export default authService;
