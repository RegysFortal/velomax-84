
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
  invoiceNumber?: string;
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
