
// DeliveryType and related types
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
  | 'tracked'
  | 'door_to_door'
  | 'scheduled';

export type CargoType = 'standard' | 'perishable';

// Array of delivery types that are door-to-door deliveries
export const doorToDoorDeliveryTypes: DeliveryType[] = [
  'doorToDoorInterior',
  'door_to_door'
];

export interface Delivery {
  id: string;
  minuteNumber: string;
  clientId: string;
  deliveryDate: string;
  deliveryTime: string;
  receiver: string;
  receiverId?: string;
  weight: number;
  packages: number;
  deliveryType: DeliveryType;
  cargoType: CargoType;
  cargoValue?: number;
  totalFreight: number;
  notes?: string;
  occurrence?: string;
  createdAt: string;
  updatedAt: string;
  cityId?: string;
  pickupName?: string;
  pickupDate?: string;
  pickupTime?: string;
}

// Re-export all types from other files
export * from './activity';
export * from './shipment';
export * from './budget';
export * from './client';
export * from './city';
export * from './priceTable';

// Add placeholder export to silence TypeScript errors until we create these files
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  hireDate?: string;
  departmentId?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: string;
  brand: string;
  type: string;
  capacity: number;
  fuelType: string;
  currentOdometer: number;
  lastOilChange?: number;
  nextOilChangeKm?: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface LogbookEntry {
  id: string;
  date: string;
  driverId: string;
  assistantId?: string;
  vehicleId: string;
  departureTime: string;
  departureOdometer: number;
  destination: string;
  purpose: string;
  returnTime?: string;
  endOdometer?: number;
  tripDistance?: number;
  status: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface FuelRecord {
  id: string;
  date: string;
  vehicleId: string;
  fuelType: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  odometer: number;
  isFull?: boolean;
  station?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface Maintenance {
  id: string;
  date: string;
  vehicleId: string;
  maintenanceType: string;
  description: string;
  cost: number;
  odometer: number;
  provider?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface TireMaintenance {
  id: string;
  date: string;
  vehicleId: string;
  maintenanceType: string;
  tirePosition: string;
  tireSize?: string;
  brand?: string;
  mileage: number;
  cost: number;
  description?: string;
  provider?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface FinancialReport {
  id: string;
  clientId: string;
  startDate: string;
  endDate: string;
  totalDeliveries: number;
  totalFreight: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}
