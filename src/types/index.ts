
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
  updatedAt: string;
  department?: string;
  position?: string;
  phone?: string;
  permissions?: {
    deliveries: boolean;
    shipments: boolean;
    clients: boolean;
    cities: boolean;
    reports: boolean;
    financial: boolean;
    priceTables: boolean;
    dashboard: boolean;
    logbook: boolean;
    employees: boolean;
    vehicles: boolean;
    maintenance: boolean;
    settings: boolean;
  };
  lastLogin?: string;
}

export interface Client {
  id: string;
  name: string;
  tradingName: string;
  document: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  contact: string;
  notes: string;
  priceTableId: string;
  createdAt: string;
  updatedAt: string;
  // Add these missing properties
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
}

export interface PriceTable {
  id: string;
  name: string;
  description: string;
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
    maxWeight?: number;
  };
  // Add missing properties
  waitingHour?: {
    fiorino: number;
    medium: number;
    large: number;
  };
  insurance?: {
    standard: number;
    perishable: number;
  };
  allowCustomPricing?: boolean;
  defaultDiscount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  distance: number;
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
  packages: number;
  deliveryType: 'standard' | 'emergency' | 'exclusive' | 'saturday' | 'sundayHoliday' | 'difficultAccess' | 'metropolitanRegion' | 'doorToDoorInterior' | 'reshipment' | 'normalBiological' | 'infectiousBiological' | 'tracked';
  cargoType: 'standard' | 'perishable';
  cargoValue?: number;
  totalFreight: number;
  notes: string;
  occurrence?: string;
  createdAt: string;
  updatedAt: string;
  cityId?: string;
  customPricing?: boolean;
  discount?: number;
}

export const doorToDoorDeliveryTypes: Delivery['deliveryType'][] = [
  'doorToDoorInterior',
];

export interface FinancialReport {
  id: string;
  clientId: string;
  startDate: string;
  endDate: string;
  totalDeliveries: number;
  totalFreight: number;
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
  title?: string;
}

export interface ActivityLog {
  id?: string;
  timestamp?: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  details?: string;
}

export interface Shipment {
  id: string;
  companyId: string;
  carrierName: string;
  trackingNumber: string;
  shippingDate: string;
  arrivalDate: string;
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  status: ShipmentStatus;
  isRetained: boolean;
  notes?: string;
  documents: Document[];
  fiscalAction?: FiscalAction;
  createdAt: string;
  updatedAt: string;
}

export type ShipmentStatus = "pending" | "inTransit" | "retained" | "delivered" | "returned" | "canceled";

export interface Document {
  id: string;
  filename: string;
  url: string;
  type: "invoice" | "packingList" | "other";
  createdAt: string;
  updatedAt: string;
}

export interface FiscalAction {
  id: string;
  reason: string;
  details: string;
  requiresAction: boolean;
  actionTaken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TireMaintenance {
  id: string;
  vehicleId: string;
  maintenanceType: 'replacement' | 'puncture' | 'purchase';
  date: string;
  tirePosition?: string;
  tireSize?: string;
  brand?: string;
  cost?: number;
  mileage?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  year: string;
  make: string;
  brand: string;
  type: 'car' | 'motorcycle' | 'truck' | 'van';
  fuelType: 'gasoline' | 'diesel' | 'ethanol' | 'flex' | 'electric';
  currentOdometer: number;
  lastOilChange: number;
  nextOilChangeKm: number;
  status?: 'active' | 'maintenance' | 'inactive';
  renavam?: string;
  chassis?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Add missing types for the LogbookContext
export interface LogbookEntry {
  id: string;
  date: string;
  vehicleId: string;
  driverId: string;
  startOdometer: number;
  endOdometer: number;
  tripDistance: number;
  departureTime: string;
  arrivalTime: string;
  destination: string;
  purpose: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  departmentId: string;
  email: string;
  phone: string;
  hireDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  fuelType: string;
  isFull: boolean;
  station?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  maintenanceType: string;
  date: string;
  odometer: number;
  description: string;
  cost: number;
  provider?: string;
  invoiceNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
