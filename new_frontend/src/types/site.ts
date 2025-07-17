
export interface TDLType {
  id: string;
  name: string;
  equipmentCount: number;
  phase: string;
  voltage: string;
  powerFactor: number;
}

export interface Generator {
  id: string;
  name: string;
  capacity: number; // KW
  tswName: string;
  isRedundant: boolean;
}

export interface TSW {
  id: string;
  name: string;
  capacity: number; // KW
  currentLoad: number; // KW
  isRedundant: boolean;
}

export interface AirConditioner {
  id: string;
  name: string;
  sensibleKW: number;
  pair: string;
  isRedundant: boolean;
}

export interface UPS {
  id: string;
  name: string;
  capacity: number; // KW
  currentLoad: number; // KW
  pair: string;
  isRedundant: boolean;
}

export interface DCSystem {
  id: string;
  name: string;
  capacity: number; // KW
  installedCapacity: number; // KW
  actualLoad: number; // KW
}

export interface SiteType {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  class: string;
  phase: string;
  voltage: string;
  powerFactor: number;
  equipmentCount: number;
  status: string;
  tdls: TDLType[];
  
  // Capacity information
  totalCapacityKW?: number;
  usedCapacityKW?: number;
  remainingCapacityKW?: number;
  
  // Input details
  inputVoltage?: string;
  inputCurrent?: string;
  emergencyPercentage?: number; // Default to 80%
  
  // Equipment lists
  generators?: Generator[];
  tsws?: TSW[];
  airConditioners?: AirConditioner[];
  ups?: UPS[];
  dcSystems?: DCSystem[];
}
