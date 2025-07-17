import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Types
export interface TDLSite {
  id: number;
  name: string;
  region: string;
  class: string;
  phase: string;
  voltage: string;
  power_factor: number;
  status: string;
  SDS: boolean;
  esp_plan: number;
  nb_cab: number;
  charge_ac: number;
  charge_dc: number;
  charge_gen: number;
  charge_clim: number;
  adresse: string;
  ville: string;
  code_postal: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  total_capacity_kw?: number;
  used_capacity_kw?: number;
  remaining_capacity_kw?: number;
  emergency_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface ACEquipment {
  id: number;
  nom: string;
  type: string;
  output_ac: number;
  current_load: number;
  TDL_id?: number;
  TSF_id?: number;
  Paire_id?: string;
  pair_id?: string;
  is_redundant: boolean;
  port_sw?: string;
  gateway?: string;
  netmask?: string;
  ip?: string;
  username?: string;
  password?: string;
  installation_date?: string;
  date_inst?: string;
  voltage?: number;
  phase?: number;
  puissance_tot?: number;
  efficiency?: number;
  Bypass?: string;
  commentaire?: string;
  ING?: string;
  modèle?: string;
  no_série?: string;
  manufacturer?: string;
  fournisseur_id?: number;
  fabricant_id?: number;
  last_maintenance?: string;
  next_maintenance?: string;
  warranty_expiry?: string;
  OOD: boolean;
  SLA?: number;
  specifications?: any;
  created_at: string;
  updated_at: string;
}

export interface DCSystem {
  id: number;
  type: string;
  output_dc: number;
  TDL_id?: number;
  TSF_id?: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  phone?: string;
  department?: string;
  position?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  type?: string;
  site_id?: string;
  site_type?: 'TDL' | 'TSF';
  equipment_type?: string;
  equipment_id?: number;
  assigned_to?: string;
  created_by: string;
  scheduled_date?: string;
  due_date?: string;
  completed_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  cost?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// API Functions
export const apiService = {
  // Health check
  health: () => api.get('/health'),

  // TDL Sites
  getTDLSites: () => api.get<TDLSite[]>('/tdl'),
  getTDLSite: (id: number) => api.get<TDLSite>(`/tdl/${id}`),
  createTDLSite: (data: Partial<TDLSite>) => api.post<TDLSite>('/tdl', data),
  updateTDLSite: (id: number, data: Partial<TDLSite>) => api.put<TDLSite>(`/tdl/${id}`, data),
  deleteTDLSite: (id: number) => api.delete(`/tdl/${id}`),

  // AC Equipment
  getACEquipment: (params?: { TDL_id?: number; TSF_id?: number }) => 
    api.get<ACEquipment[]>('/ac', { params }),
  getACEquipmentById: (id: number) => api.get<ACEquipment>(`/ac/${id}`),
  createACEquipment: (data: Partial<ACEquipment>) => api.post<ACEquipment>('/ac', data),
  updateACEquipment: (id: number, data: Partial<ACEquipment>) => api.put<ACEquipment>(`/ac/${id}`, data),
  deleteACEquipment: (id: number) => api.delete(`/ac/${id}`),

  // DC Systems
  getDCSystems: (params?: { TDL_id?: number; TSF_id?: number }) => 
    api.get<DCSystem[]>('/dc', { params }),
  getDCSystemById: (id: number) => api.get<DCSystem>(`/dc/${id}`),
  createDCSystem: (data: Partial<DCSystem>) => api.post<DCSystem>('/dc', data),
  updateDCSystem: (id: number, data: Partial<DCSystem>) => api.put<DCSystem>(`/dc/${id}`, data),
  deleteDCSystem: (id: number) => api.delete(`/dc/${id}`),

  // Work Orders
  getWorkOrders: () => api.get<WorkOrder[]>('/work-orders'),
  getWorkOrder: (id: string) => api.get<WorkOrder>(`/work-orders/${id}`),
  createWorkOrder: (data: Partial<WorkOrder>) => api.post<WorkOrder>('/work-orders', data),
  updateWorkOrder: (id: string, data: Partial<WorkOrder>) => api.put<WorkOrder>(`/work-orders/${id}`, data),
  deleteWorkOrder: (id: string) => api.delete(`/work-orders/${id}`),

  // Users
  getUsers: () => api.get<User[]>('/users'),
  getUser: (id: string) => api.get<User>(`/users/${id}`),
  createUser: (data: Partial<User>) => api.post<User>('/users', data),
  updateUser: (id: string, data: Partial<User>) => api.put<User>(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),

  // Migration endpoints
  getMigrationStatus: () => api.get('/migration/status'),
  executeMigration: () => api.post('/migration/execute'),
  verifyMigration: () => api.get('/migration/verify'),
  fixCapacity: () => api.post('/migration/fix-capacity'),
  fixTDLTypes: () => api.post('/migration/fix-tdl-types'),
  getTDLTypesStatus: () => api.get('/migration/tdl-types-status'),
  getCapacityStatus: () => api.get('/migration/capacity-status'),
};

export default apiService;
