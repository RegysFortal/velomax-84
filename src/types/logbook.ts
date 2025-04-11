
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
