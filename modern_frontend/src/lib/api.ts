// API Configuration
const API_BASE_URL = '/api';

// Token management
class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
}

// Types
export interface TDLSite {
  id: string;
  name: string;
  location: string;
  status: 'Actif' | 'Inactif' | 'Maintenance';
  total_capacity_kw: number;
  used_capacity_kw: number;
  efficiency_percentage: number;
  last_maintenance: string;
  next_maintenance: string;
  created_at: string;
  updated_at: string;
}

export interface ACEquipment {
  id: number;
  name: string;
  type: string;
  output_capacity_kw: number;
  input_voltage: number;
  output_voltage: number;
  efficiency_percentage: number;
  status: 'Actif' | 'Inactif' | 'Maintenance';
  site_id: string;
  installation_date: string;
  last_maintenance: string;
  next_maintenance: string;
  created_at: string;
  updated_at: string;
}

export interface DCSystem {
  id: number;
  name: string;
  type: string;
  voltage: number;
  current_capacity_a: number;
  power_capacity_w: number;
  efficiency_percentage: number;
  status: 'Actif' | 'Inactif' | 'Maintenance';
  site_id: string;
  installation_date: string;
  last_maintenance: string;
  next_maintenance: string;
  created_at: string;
  updated_at: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  type: string;
  site_id: string;
  site_type: 'TDL' | 'TSF';
  equipment_type: string;
  equipment_id: number;
  assigned_to: string;
  created_by: string;
  scheduled_date: string;
  due_date: string;
  completed_date?: string;
  estimated_hours: number;
  actual_hours?: number;
  cost: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  department: string;
  position: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Migration {
  id: number;
  name: string;
  executed_at: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  department?: string;
  position?: string;
}

// API Service
class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token and add to headers if available
    const token = TokenManager.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      headers,
      ...options,
    });

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && token) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry the original request with new token
        const newToken = TokenManager.getToken();
        if (newToken) {
          headers.Authorization = `Bearer ${newToken}`;
          const retryResponse = await fetch(url, {
            headers,
            ...options,
          });
          
          if (retryResponse.ok) {
            return retryResponse.json();
          }
        }
      }
      
      // If refresh failed or retry failed, clear tokens and redirect to login
      TokenManager.clearTokens();
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        TokenManager.setToken(data.token);
        if (data.refreshToken) {
          TokenManager.setRefreshToken(data.refreshToken);
        }
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    return false;
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    TokenManager.setToken(response.token);
    TokenManager.setRefreshToken(response.refreshToken);
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    TokenManager.setToken(response.token);
    TokenManager.setRefreshToken(response.refreshToken);
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<{ user: User }>('/auth/profile').then(data => data.user);
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }).then(data => data.user);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // TDL Sites
  async getTDLSites(): Promise<TDLSite[]> {
    return this.request('/tdl');
  }

  async getTDLSite(id: string): Promise<TDLSite> {
    return this.request(`/tdl/${id}`);
  }

  async createTDLSite(data: Partial<TDLSite>): Promise<TDLSite> {
    return this.request('/tdl', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTDLSite(id: string, data: Partial<TDLSite>): Promise<TDLSite> {
    return this.request(`/tdl/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTDLSite(id: string): Promise<void> {
    await this.request(`/tdl/${id}`, {
      method: 'DELETE',
    });
  }

  // AC Equipment
  async getACEquipment(params?: { site_id?: string }): Promise<ACEquipment[]> {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/ac${queryParams}`);
  }

  async getACEquipmentById(id: number): Promise<ACEquipment> {
    return this.request(`/ac/${id}`);
  }

  async createACEquipment(data: Partial<ACEquipment>): Promise<ACEquipment> {
    return this.request('/ac', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateACEquipment(id: number, data: Partial<ACEquipment>): Promise<ACEquipment> {
    return this.request(`/ac/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteACEquipment(id: number): Promise<void> {
    await this.request(`/ac/${id}`, {
      method: 'DELETE',
    });
  }

  // DC Systems
  async getDCSystems(params?: { site_id?: string }): Promise<DCSystem[]> {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/dc${queryParams}`);
  }

  async getDCSystemById(id: number): Promise<DCSystem> {
    return this.request(`/dc/${id}`);
  }

  async createDCSystem(data: Partial<DCSystem>): Promise<DCSystem> {
    return this.request('/dc', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDCSystem(id: number, data: Partial<DCSystem>): Promise<DCSystem> {
    return this.request(`/dc/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDCSystem(id: number): Promise<void> {
    await this.request(`/dc/${id}`, {
      method: 'DELETE',
    });
  }

  // Work Orders
  async getWorkOrders(params?: { status?: string; priority?: string; assigned_to?: string }): Promise<WorkOrder[]> {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/work-orders${queryParams}`);
  }

  async getWorkOrder(id: string): Promise<WorkOrder> {
    return this.request(`/work-orders/${id}`);
  }

  async createWorkOrder(data: Partial<WorkOrder>): Promise<WorkOrder> {
    return this.request('/work-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWorkOrder(id: string, data: Partial<WorkOrder>): Promise<WorkOrder> {
    return this.request(`/work-orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWorkOrder(id: string): Promise<void> {
    await this.request(`/work-orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Users (Admin only)
  async getUsers(params?: { page?: number; limit?: number }): Promise<{ users: User[]; pagination: any }> {
    const queryParams = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`/users${queryParams}`);
  }

  async getUser(id: string): Promise<User> {
    return this.request<{ user: User }>(`/users/${id}`).then(data => data.user);
  }

  async createUser(data: Partial<User> & { password: string }): Promise<User> {
    return this.request<{ user: User }>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(data => data.user);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.request<{ user: User }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then(data => data.user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async updateUserPassword(id: string, password: string): Promise<void> {
    await this.request(`/users/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
  }

  // Migration endpoints (Admin only)
  async getMigrationStatus(): Promise<Migration[]> {
    return this.request('/migration/status');
  }

  async executeMigration(): Promise<void> {
    await this.request('/migration/execute', {
      method: 'POST',
    });
  }

  async verifyMigration(): Promise<void> {
    await this.request('/migration/verify', {
      method: 'POST',
    });
  }

  async fixCapacity(): Promise<void> {
    await this.request('/migration/fix-capacity', {
      method: 'POST',
    });
  }

  async fixTDLTypes(): Promise<void> {
    await this.request('/migration/fix-tdl-types', {
      method: 'POST',
    });
  }

  async getTDLTypesStatus(): Promise<void> {
    await this.request('/migration/tdl-types-status', {
      method: 'POST',
    });
  }

  async getCapacityStatus(): Promise<void> {
    await this.request('/migration/capacity-status', {
      method: 'POST',
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export TokenManager for use in auth context
export { TokenManager };
