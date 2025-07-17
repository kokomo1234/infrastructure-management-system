
export interface StandbyPerson {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface StandbyAssignment {
  id: string;
  personId: string;
  startDate: Date;
  endDate: Date;
  isFullWeek: boolean;
}

export interface StandbyChangeRequest {
  id: string;
  requesterId: string;
  requestedPersonId: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  message?: string;
}

export interface StandbyNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  type: 'request' | 'approval' | 'rejection' | 'admin' | 'system';
  relatedRequestId?: string;
}
