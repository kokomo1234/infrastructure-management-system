
import { getUsers, getUserById, User } from "@/lib/dataService";

export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  avatar?: string;
  managerId?: string;
  subordinateIds: string[];
  role: 'admin' | 'supervisor' | 'standard';
  department?: string;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  assignedBy: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  description?: string;
}

// Données simulées pour les tâches
const tasks: Task[] = [
  {
    id: "task1",
    title: "Maintenance UPS Site A",
    assignedTo: "3",
    assignedBy: "2",
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(2025, 0, 20),
    description: "Vérification routine UPS"
  },
  {
    id: "task2", 
    title: "Inspection Rectifier",
    assignedTo: "4",
    assignedBy: "2",
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(2025, 0, 25),
    description: "Inspection mensuelle"
  }
];

// Conversion des utilisateurs en employés avec hiérarchie
const convertUserToEmployee = (user: User): Employee => ({
  id: user.id,
  name: user.name,
  position: user.position,
  email: user.email,
  avatar: user.avatar,
  managerId: getManagerId(user.id),
  subordinateIds: getSubordinateIds(user.id),
  role: getUserRole(user.id),
  department: getUserDepartment(user.id)
});

// Logique de hiérarchie simple (à adapter selon vos besoins)
const getManagerId = (userId: string): string | undefined => {
  switch (userId) {
    case "3":
    case "4":
    case "5":
      return "2"; // Jean Dupont est le superviseur
    case "2":
      return "1"; // Admin est au-dessus du superviseur
    default:
      return undefined;
  }
};

const getSubordinateIds = (userId: string): string[] => {
  switch (userId) {
    case "1":
      return ["2"]; // Admin supervise Jean Dupont
    case "2":
      return ["3", "4", "5"]; // Jean Dupont supervise les techniciens
    default:
      return [];
  }
};

const getUserRole = (userId: string): 'admin' | 'supervisor' | 'standard' => {
  switch (userId) {
    case "1":
      return 'admin';
    case "2":
      return 'supervisor';
    default:
      return 'standard';
  }
};

const getUserDepartment = (userId: string): string => {
  switch (userId) {
    case "1":
      return 'Administration';
    case "2":
      return 'Supervision';
    default:
      return 'Technique';
  }
};

export const getAllEmployees = (): Employee[] => {
  return getUsers().map(convertUserToEmployee);
};

// Alias pour compatibilité
export const getAllUsers = getAllEmployees;

export const getEmployeeById = (id: string): Employee | undefined => {
  const user = getUserById(id);
  return user ? convertUserToEmployee(user) : undefined;
};

export const getSubordinates = (managerId: string): Employee[] => {
  const manager = getEmployeeById(managerId);
  if (!manager) return [];
  
  return manager.subordinateIds
    .map(getEmployeeById)
    .filter((emp): emp is Employee => emp !== undefined);
};

export const getManager = (employeeId: string): Employee | undefined => {
  const employee = getEmployeeById(employeeId);
  if (!employee || !employee.managerId) return undefined;
  
  return getEmployeeById(employee.managerId);
};

// Alias pour compatibilité
export const getSupervisor = getManager;

// Fonction pour obtenir toute la hiérarchie sous un manager
export const getHierarchy = (managerId: string): Employee[] => {
  const subordinates = getSubordinates(managerId);
  const hierarchy: Employee[] = [...subordinates];
  
  subordinates.forEach(subordinate => {
    const subHierarchy = getHierarchy(subordinate.id);
    hierarchy.push(...subHierarchy);
  });
  
  return hierarchy;
};

// Fonction récursive pour obtenir tous les subordonnés
export const getAllSubordinatesRecursive = (managerId: string): Employee[] => {
  return getHierarchy(managerId);
};

// Fonctions pour la gestion des tâches
export const getUserTasks = (userId: string): Task[] => {
  return tasks.filter(task => task.assignedTo === userId);
};

export const getTasksAssignedBy = (managerId: string): Task[] => {
  return tasks.filter(task => task.assignedBy === managerId);
};

// Fonction pour construire l'arbre hiérarchique - accepte maintenant un paramètre optionnel
export const buildHierarchyTree = (employees?: Employee[]): Employee[] => {
  const allEmployees = employees || getAllEmployees();
  const rootEmployees = allEmployees.filter(emp => !emp.managerId);
  
  const buildTree = (employee: Employee): Employee => {
    const subordinates = getSubordinates(employee.id);
    return {
      ...employee,
      subordinates: subordinates.map(buildTree)
    } as Employee & { subordinates: Employee[] };
  };
  
  return rootEmployees.map(buildTree);
};
