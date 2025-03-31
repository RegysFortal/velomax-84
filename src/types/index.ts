
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
  deliveryType: 'standard' | 'saturday' | 'emergency' | 'exclusive' | 'scheduled' | 'normalBiological' | 'infectiousBiological' | 'sundayHoliday';
  cargoType: 'standard' | 'perishable';
  cargoValue: number;
  totalFreight: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

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
