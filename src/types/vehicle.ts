
export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: string;
  brand: string;
  type: 'car' | 'motorcycle' | 'truck' | 'van';
  capacity: number;
  fuelType: 'gasoline' | 'diesel' | 'ethanol' | 'flex' | 'electric';
  currentOdometer: number;
  lastOilChange?: number;
  nextOilChangeKm?: number;
  status: 'active' | 'maintenance' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  // Additional properties
  renavam?: string;
  chassis?: string;
}
