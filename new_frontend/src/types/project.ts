
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'admin' | 'user' | 'guest';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  color?: string;
  template?: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  parentTaskId?: string;
  estimatedHours?: number;
  actualHours?: number;
  dependencies?: string[];
  tags?: string[];
  position?: number;
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  type: 'blocks' | 'blocked_by' | 'related';
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  mentions?: string[];
}

export interface FileAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  linkedTasks?: string[];
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  hours: number;
  description?: string;
  date: string;
  createdAt: string;
}

export interface Automation {
  id: string;
  projectId: string;
  name: string;
  trigger: {
    type: 'task_status_changed' | 'task_assigned' | 'task_overdue' | 'task_created';
    conditions: Record<string, any>;
  };
  action: {
    type: 'send_notification' | 'change_status' | 'assign_user' | 'add_comment';
    parameters: Record<string, any>;
  };
  isActive: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'task_assigned' | 'task_completed' | 'comment_added' | 'deadline_approaching';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

export type ViewType = 'list' | 'kanban' | 'calendar' | 'gantt' | 'timeline' | 'workload';

export interface ViewFilter {
  status?: string[];
  assignee?: string[];
  priority?: string[];
  project?: string[];
  dueDate?: {
    start?: string;
    end?: string;
  };
}
