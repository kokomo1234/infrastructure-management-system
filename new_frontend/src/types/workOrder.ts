
export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'pending' | 'in-progress' | 'completed' | 'cancelled';
  equipmentIds: string[];
  contractorId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  attachments?: WorkOrderAttachment[];
  comments?: WorkOrderComment[];
  tags?: string[];
}

export interface WorkOrderAttachment {
  id: string;
  workOrderId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface WorkOrderComment {
  id: string;
  workOrderId: string;
  userId: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

export interface WorkOrderTemplate {
  id: string;
  name: string;
  description: string;
  defaultPriority: WorkOrder['priority'];
  estimatedHours?: number;
  checklistItems?: string[];
  requiredFields?: string[];
}

export interface WorkOrderGeneratedMessage {
  recipient: string;
  subject: string;
  body: string;
  equipmentDetails: Array<{
    name: string;
    brand?: string;
    model: string;
    serialNumber?: string;
    location: string;
  }>;
}
