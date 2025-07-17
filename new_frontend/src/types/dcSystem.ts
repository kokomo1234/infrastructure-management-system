
export interface Rectifier {
  id: string;
  name: string;
  capacity: number; // in Watts
}

export interface CBDB {
  id: string;
  name: string;
  fuseCount: number;
  capacityAmp: number; // in Amperes
}

export interface BatteryPack {
  id: string;
  name: string;
  type: "lithium-ion" | "lead-acid" | "other";
  capacityAh: number; // in Ampere-hours
  systemId: string; // ID of the associated DC system (now required)
  cellCount: number; // NB accumulateur
  manufactureDate?: string; // Date de fabrication
  rechargeCurrent?: number; // Courant de recharge (A)
  standardResistance?: number; // Resistance étalon
  lastInspectionDate?: string; // Dernière inspection
  nextInspectionDate?: string; // Prochaine inspection
  rating?: number; // Côte (1-10)
  comments?: string; // Commentaire
}

export interface Inverter {
  id: string;
  name: string;
  capacity: number; // in Watts
  efficiency?: number; // optional efficiency percentage
  systemId: string; // ID of the associated DC system (now required)
}

export interface NetworkInfo {
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  switchPort: string;
}

export interface DCSystem {
  id: string;
  name: string;
  model: string;
  location: string;
  baseCapacity: number;
  systemVoltage: number;
  totalLoad: number;
  rectifiers: Rectifier[];
  cdbds: CBDB[];
  batteryPacks: BatteryPack[];
  inverters: Inverter[];
  networkInfo?: NetworkInfo;
}
