
export interface HierarchyUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'standard';
  supervisorId?: string;
  position?: string;
  department?: string;
  avatar?: string;
  subordinates?: HierarchyUser[];
}

export interface TaskAssignment {
  id: string;
  title: string;
  description: string;
  assignedBy: string;
  assignedTo: string;
  projectId?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HierarchyProject {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  assignedTo: string[];
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HierarchyRelation {
  supervisorId: string;
  subordinateId: string;
  createdAt: string;
}
