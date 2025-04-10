export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: string;
  entityName?: string;
  details?: string;
  ipAddress?: string;
}

export interface Client {
  id: string;
  name: string;
  tradingName?: string;
  document?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  contact?: string;
  phone?: string;
  email?: string;
  notes?: string;
  price_table_id?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  distance: number;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface Delivery {
  id: string;
  minuteNumber: string;
  clientId: string;
  deliveryDate: string;
  deliveryTime: string;
  receiver: string;
  receiverId?: string; // Add receiverId as optional
  weight: number;
  packages: number;
  deliveryType: 'standard' | 'emergency' | 'door_to_door' | 'exclusive' | 'scheduled';
  cargoType: 'standard' | 'perishable' | 'fragile' | 'dangerous' | 'valuable';
  cargoValue?: number;
  totalFreight: number;
  notes?: string;
  occurrence?: string;
  createdAt: string;
  updatedAt: string;
  cityId?: string;
  pickupName?: string; // Add pickupName
  pickupDate?: string; // Add pickupDate
  pickupTime?: string; // Add pickupTime
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  email?: string;
  phone?: string;
  hireDate?: string;
  isActive?: boolean;
  departmentId?: string;
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
  status: 'open' | 'closed' | 'pending';
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  fuelType: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  odometer: number;
  station?: string;
  isFull?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface LogbookEntry {
  id: string;
  vehicleId: string;
  driverId: string;
  assistantId?: string;
  date: string;
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

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
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

export interface PriceTable {
  id: string;
  name: string;
  description?: string;
  minimumRate: any;
  doorToDoor: any;
  excessWeight: any;
  insurance: any;
  waitingHour: any;
  defaultDiscount?: number;
  allowCustomPricing?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface TireMaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  maintenanceType: string;
  mileage: number;
  tirePosition: string;
  cost: number;
  brand?: string;
  tireSize?: string;
  description?: string;
  provider?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  plate: string;
  type: string;
  brand: string;
  capacity: number;
  fuelType: string;
  status: string;
  currentOdometer: number;
  lastOilChange?: number;
  nextOilChangeKm?: number;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}
