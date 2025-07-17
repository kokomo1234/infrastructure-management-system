
import { v4 as uuidv4 } from "uuid";
import { DCSystem, Rectifier, CBDB, BatteryPack, Inverter, NetworkInfo } from "@/types/dcSystem";

// Initial empty system
const initialDCSystem: DCSystem = {
  id: uuidv4(),
  name: "Système DC Principal",
  model: "PowerDC 5000",
  location: "Centrale Montréal",
  baseCapacity: 0,
  systemVoltage: 48, // Default DC voltage
  totalLoad: 0,
  rectifiers: [],
  cdbds: [],
  batteryPacks: [],
  inverters: []
};

// In-memory storage for demo purposes
let currentSystem: DCSystem = { ...initialDCSystem };

// System Management Functions
export const getDCSystem = (): DCSystem => {
  return { ...currentSystem };
};

export const updateDCSystem = (updates: Partial<DCSystem>): DCSystem => {
  currentSystem = { ...currentSystem, ...updates };
  return { ...currentSystem };
};

// Network Information Management
export const updateNetworkInfo = (networkInfo: NetworkInfo): DCSystem => {
  currentSystem.networkInfo = { ...networkInfo };
  return { ...currentSystem };
};

// Component Management Functions
export const addRectifier = (rectifier: Omit<Rectifier, "id">): DCSystem => {
  const newRectifier = { ...rectifier, id: uuidv4() };
  currentSystem.rectifiers.push(newRectifier);
  return { ...currentSystem };
};

export const removeRectifier = (id: string): DCSystem => {
  currentSystem.rectifiers = currentSystem.rectifiers.filter(r => r.id !== id);
  return { ...currentSystem };
};

export const addCBDB = (cbdb: Omit<CBDB, "id">): DCSystem => {
  const newCBDB = { ...cbdb, id: uuidv4() };
  currentSystem.cdbds.push(newCBDB);
  return { ...currentSystem };
};

export const removeCBDB = (id: string): DCSystem => {
  currentSystem.cdbds = currentSystem.cdbds.filter(c => c.id !== id);
  return { ...currentSystem };
};

export const addBatteryPack = (batteryPack: Omit<BatteryPack, "id">): DCSystem => {
  const newBatteryPack = { ...batteryPack, id: uuidv4() };
  currentSystem.batteryPacks.push(newBatteryPack);
  return { ...currentSystem };
};

export const removeBatteryPack = (id: string): DCSystem => {
  currentSystem.batteryPacks = currentSystem.batteryPacks.filter(b => b.id !== id);
  return { ...currentSystem };
};

export const addInverter = (inverter: Omit<Inverter, "id">): DCSystem => {
  const newInverter = { ...inverter, id: uuidv4() };
  currentSystem.inverters.push(newInverter);
  return { ...currentSystem };
};

export const removeInverter = (id: string): DCSystem => {
  currentSystem.inverters = currentSystem.inverters.filter(i => i.id !== id);
  return { ...currentSystem };
};

// Calculation Functions
export const calculateTotalInstalledCapacity = (system: DCSystem): number => {
  const rectifiersCapacity = system.rectifiers.reduce((total, rectifier) => total + rectifier.capacity, 0);
  return system.baseCapacity + rectifiersCapacity;
};

export const calculateCBDBWattage = (cbdb: CBDB, systemVoltage: number): number => {
  return cbdb.capacityAmp * systemVoltage;
};

export const calculateTotalBatteryCapacity = (system: DCSystem): number => {
  return system.batteryPacks.reduce((total, battery) => total + battery.capacityAh, 0);
};

export const calculateAutonomy = (system: DCSystem): number => {
  if (system.totalLoad <= 0) return 0;
  
  const totalBatteryAh = calculateTotalBatteryCapacity(system);
  return (totalBatteryAh * system.systemVoltage) / system.totalLoad;
};

// Reset system (for testing)
export const resetDCSystem = (): DCSystem => {
  currentSystem = { ...initialDCSystem, id: uuidv4() };
  return { ...currentSystem };
};
