
// Add the username and permissions properties to the User interface
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
  lastLogin?: string;
  permissions?: {
    // Operational permissions
    deliveries: boolean;
    shipments: boolean;
    
    // Financial permissions
    clients: boolean;
    cities: boolean;
    reports: boolean;
    financial: boolean;
    priceTables: boolean;
    
    // Management permissions
    dashboard: boolean;
    logbook: boolean;
    employees: boolean;
    vehicles: boolean;
    maintenance: boolean;
    settings: boolean;
  };
}

// City related types
export interface City {
  id: string;
  name: string;
  distance: number;
  createdAt: string;
  updatedAt: string;
}

// Client related types
export interface Client {
  id: string;
  name: string;
  tradingName?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  contact: string;
  phone: string;
  email: string;
  priceTableId: string;
  createdAt: string;
  updatedAt: string;
}

// Delivery related types
export type DeliveryType = 
  | 'standard'
  | 'emergency'
  | 'exclusive'
  | 'saturday'
  | 'sundayHoliday'
  | 'difficultAccess'
  | 'metropolitanRegion'
  | 'doorToDoorInterior'
  | 'reshipment'
  | 'normalBiological'
  | 'infectiousBiological'
  | 'tracked';

export type CargoType = 'standard' | 'perishable';

export const doorToDoorDeliveryTypes: DeliveryType[] = [
  'doorToDoorInterior'
];

export interface Delivery {
  id: string;
  minuteNumber: string;
  clientId: string;
  deliveryDate: string;
  deliveryTime: string;
  receiver: string;
  weight: number;
  packages: number;
  deliveryType: DeliveryType;
  cargoType: CargoType;
  cargoValue?: number;
  totalFreight: number;
  cityId?: string;
  notes?: string;
  occurrence?: string;
  createdAt: string;
  updatedAt: string;
}

// Financial related types
export type FinancialReportStatus = 'open' | 'closed';

export interface FinancialReport {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  status: FinancialReportStatus;
  createdAt: string;
  updatedAt: string;
}

// Price table related types
export interface PriceTable {
  id: string;
  name: string;
  description?: string;
  minimumRate: {
    standardDelivery: number;
    emergencyCollection: number;
    saturdayCollection: number;
    exclusiveVehicle: number;
    scheduledDifficultAccess: number;
    metropolitanRegion: number;
    sundayHoliday: number;
    normalBiological: number;
    infectiousBiological: number;
    trackedVehicle: number;
    doorToDoorInterior: number;
    reshipment: number;
  };
  excessWeight: {
    minPerKg: number;
    maxPerKg: number;
    biologicalPerKg: number;
    reshipmentPerKg: number;
  };
  doorToDoor: {
    ratePerKm: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Logbook related types
export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  status: 'active' | 'maintenance' | 'inactive';
  type: 'car' | 'motorcycle' | 'truck' | 'van';
  capacity?: number;
  fuelType: 'gasoline' | 'diesel' | 'ethanol' | 'flex' | 'electric';
  lastMaintenance?: string;
  nextMaintenance?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  licenseNumber?: string;
  licenseType?: string;
  licenseExpiration?: string;
  phone: string;
  email?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface LogbookEntry {
  id: string;
  vehicleId: string;
  driverId: string;
  departureDate: string;
  departureTime: string;
  departureOdometer: number;
  returnDate?: string;
  returnTime?: string;
  returnOdometer?: number;
  route?: string;
  notes?: string;
  status: 'ongoing' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  liters: number;
  fuelType: 'gasoline' | 'diesel' | 'ethanol' | 'flex';
  totalCost: number;
  pricePerLiter: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  type: 'preventive' | 'corrective' | 'emergency';
  description: string;
  date: string;
  cost: number;
  odometer: number;
  status: 'scheduled' | 'in_progress' | 'completed';
  technician?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TireMaintenance {
  id: string;
  vehicleId: string;
  date: string;
  position: string;
  brand: string;
  model: string;
  cost: number;
  odometer: number;
  type: 'new' | 'rotation' | 'repair';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
