
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager' | 'user';
  name: string;
  permissions?: UserPermissions;
  password?: string; // Add password property for internal use
}

export interface UserPermissions {
  clients: boolean;
  cities: boolean;
  reports: boolean;
  financial: boolean;
  priceTables: boolean;
  settings: boolean;
}

export interface Client {
  id: string;
  name: string;
  address: string;
  contact: string;
  phone: string;
  email: string;
  priceTableId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceTable {
  id: string;
  name: string;
  minimumRate: {
    standardDelivery: number;
    saturdayCollection: number;
    emergencyCollection: number;
    exclusiveVehicle: number;
    scheduledDifficultAccess: number;
    normalBiological: number;
    infectiousBiological: number;
    sundayHoliday: number;
  };
  excessWeight: {
    minPerKg: number;
    maxPerKg: number;
  };
  doorToDoor: {
    ratePerKm: number;
    maxWeight: number;
  };
  insurance: {
    standard: number;
    perishable: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  minuteNumber: string;
  clientId: string;
  deliveryDate: string;
  deliveryTime: string;
  receiver: string;
  weight: number;
  distance?: number;
  cityId?: string; // Added cityId for door-to-door deliveries
  deliveryType: 'standard' | 'saturday' | 'emergency' | 'exclusive' | 'scheduled' | 'normalBiological' | 'infectiousBiological' | 'sundayHoliday';
  cargoType: 'standard' | 'perishable';
  cargoValue: number;
  totalFreight: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Helper constant to identify door-to-door delivery types
export const doorToDoorDeliveryTypes: Delivery['deliveryType'][] = ['exclusive', 'scheduled'];

export interface City {
  id: string;
  name: string;
  distance: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialReport {
  id: string;
  clientId: string;
  startDate: string;
  endDate: string;
  totalFreight: number;
  totalDeliveries: number;
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export type SortDirection = 'asc' | 'desc';

// Novas interfaces para o diário de bordo
export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  year: string;
  make: string;
  currentOdometer: number;
  lastOilChange: number;
  nextOilChangeKm: number;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'driver' | 'assistant';
  documentId: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface TireMaintenance {
  id: string;
  vehicleId: string;
  tirePosition: 'frontLeft' | 'frontRight' | 'rearLeft' | 'rearRight' | 'spare';
  changeDate: string;
  brand: string;
  model: string;
  odometerKm: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  odometerKm: number;
  createdAt: string;
  updatedAt: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  odometerKm: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface LogbookEntry {
  id: string;
  date: string;
  vehicleId: string;
  driverId: string;
  assistantId?: string;
  departureTime: string;
  returnTime?: string;
  departureOdometer: number;
  returnOdometer?: number;
  fuelRecordId?: string;
  maintenanceId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
