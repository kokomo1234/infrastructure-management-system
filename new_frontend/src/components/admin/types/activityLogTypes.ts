
export type LogEntry = {
  id: string;
  timestamp: Date;
  user: {
    name: string;
    email: string;
  };
  action: string;
  resource: string;
  status: "success" | "warning" | "error";
  details: string;
  ip?: string; // Add the ip field as optional
};

export const MOCK_LOGS: LogEntry[] = [
  {
    id: "log1",
    timestamp: new Date(2025, 3, 5, 9, 30),
    user: {
      name: "Admin User",
      email: "admin@example.com",
    },
    action: "LOGIN",
    resource: "Authentication",
    status: "success",
    details: "Logged in successfully",
  },
  {
    id: "log2",
    timestamp: new Date(2025, 3, 5, 10, 15),
    user: {
      name: "Admin User",
      email: "admin@example.com",
    },
    action: "CREATE",
    resource: "User",
    status: "success",
    details: "Created user john@example.com",
  },
  {
    id: "log3",
    timestamp: new Date(2025, 3, 4, 14, 22),
    user: {
      name: "Normal User",
      email: "user@example.com",
    },
    action: "VIEW",
    resource: "Sites",
    status: "success",
    details: "Viewed site list",
  },
  {
    id: "log4",
    timestamp: new Date(2025, 3, 3, 11, 45),
    user: {
      name: "Admin User",
      email: "admin@example.com",
    },
    action: "UPDATE",
    resource: "Equipment",
    status: "warning",
    details: "Updated equipment settings",
  },
  {
    id: "log5",
    timestamp: new Date(2025, 3, 2, 16, 30),
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    action: "DELETE",
    resource: "Maintenance Record",
    status: "error",
    details: "Attempted to delete maintenance record without permission",
  },
  {
    id: "log6",
    timestamp: new Date(2025, 3, 1, 9, 10),
    user: {
      name: "Admin User",
      email: "admin@example.com",
    },
    action: "MODIFY",
    resource: "Permissions",
    status: "success",
    details: "Modified role permissions",
  },
  {
    id: "log7",
    timestamp: new Date(2025, 2, 28, 13, 20),
    user: {
      name: "Sarah Smith",
      email: "sarah@example.com",
    },
    action: "LOGIN",
    resource: "Authentication",
    status: "error",
    details: "Failed login attempt",
  },
];
