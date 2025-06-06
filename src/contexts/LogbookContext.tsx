import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LogbookEntry, FuelRecord, Vehicle, Employee, Maintenance, TireMaintenance } from '@/types';
import { useAuth } from './auth/AuthContext';
import { useEmployeesData } from '@/hooks/useEmployeesData';

interface LogbookContextType {
  // Logbook entries
  entries: LogbookEntry[];
  addEntry: (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<LogbookEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  
  // Fuel records
  fuelRecords: FuelRecord[];
  addFuelRecord: (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateFuelRecord: (id: string, record: Partial<FuelRecord>) => Promise<void>;
  deleteFuelRecord: (id: string) => Promise<void>;
  getFuelRecordById: (id: string) => FuelRecord | undefined;
  
  // Logbook entries with new naming
  addLogbookEntry: (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateLogbookEntry: (id: string, entry: Partial<LogbookEntry>) => void;
  getLogbookEntryById: (id: string) => LogbookEntry | undefined;
  
  // Vehicles
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  
  // Employees
  employees: Employee[];
  
  // Maintenance records
  maintenanceRecords: Maintenance[];
  addMaintenance: (maintenance: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateMaintenance: (id: string, maintenance: Partial<Maintenance>) => void;
  deleteMaintenance: (id: string) => void;
  
  // Tire maintenance records
  tireMaintenanceRecords: TireMaintenance[];
  deleteTireMaintenance: (id: string) => Promise<void>;
  
  isLoading: boolean;
}

const LogbookContext = createContext<LogbookContextType | undefined>(undefined);

export const LogbookProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [tireMaintenanceRecords, setTireMaintenanceRecords] = useState<TireMaintenance[]>([]);
  const { user } = useAuth();
  
  // Use real employees data instead of mock data
  const { employees: realEmployees, loading: employeesLoading } = useEmployeesData();
  
  // Convert User type to Employee type for compatibility
  const employees: Employee[] = realEmployees.map(emp => ({
    id: emp.id,
    name: emp.name,
    position: emp.position,
    email: emp.email,
    phone: emp.phone,
    isActive: true,
    hireDate: emp.employeeSince,
    departmentId: emp.department,
    createdAt: emp.createdAt,
    updatedAt: emp.updatedAt,
    userId: emp.id,
    rg: emp.rg,
    cpf: emp.cpf,
    birthDate: emp.birthDate,
    driverLicense: emp.driverLicense,
    driverLicenseExpiry: emp.driverLicenseExpiry,
    driverLicenseCategory: emp.driverLicenseCategory,
    fatherName: emp.fatherName,
    motherName: emp.motherName,
    address: emp.address,
    city: emp.city,
    state: emp.state,
    zipCode: emp.zipCode,
    employeeSince: emp.employeeSince
  }));
  
  useEffect(() => {
    // Load mock data for entries and other data
    setEntries([
      {
        id: "1",
        date: "2025-04-01",
        driverId: "driver-1",
        vehicleId: "vehicle-1",
        departureTime: "08:00",
        departureOdometer: 10000,
        destination: "Cliente XYZ",
        purpose: "Entrega",
        returnTime: "17:30",
        endOdometer: 10150,
        tripDistance: 150,
        status: "completed",
        notes: "Entrega realizada com sucesso",
        createdAt: "2025-04-01T08:00:00Z",
        updatedAt: "2025-04-01T17:30:00Z",
      },
      {
        id: "2",
        date: "2025-04-02",
        driverId: "driver-2",
        vehicleId: "vehicle-2",
        departureTime: "09:00",
        departureOdometer: 15000,
        destination: "Cliente ABC",
        purpose: "Coleta",
        returnTime: "16:30",
        endOdometer: 15100,
        tripDistance: 100,
        status: "completed",
        createdAt: "2025-04-02T09:00:00Z",
        updatedAt: "2025-04-02T16:30:00Z",
      },
      {
        id: "3",
        date: "2025-04-03",
        driverId: "driver-1",
        vehicleId: "vehicle-1",
        departureTime: "08:30",
        departureOdometer: 10150,
        destination: "Cliente DEF",
        purpose: "Entrega",
        status: "in_progress",
        createdAt: "2025-04-03T08:30:00Z",
        updatedAt: "2025-04-03T08:30:00Z",
      }
    ]);
    
    setFuelRecords([
      {
        id: "1",
        date: "2025-04-01",
        vehicleId: "vehicle-1",
        fuelType: "diesel",
        liters: 50,
        pricePerLiter: 4.75,
        totalCost: 237.50,
        odometer: 10000,
        isFull: true,
        station: "Posto Shell",
        createdAt: "2025-04-01T17:45:00Z",
        updatedAt: "2025-04-01T17:45:00Z",
      },
      {
        id: "2",
        date: "2025-04-02",
        vehicleId: "vehicle-2",
        fuelType: "gasolina",
        liters: 40,
        pricePerLiter: 5.35,
        totalCost: 214.00,
        odometer: 15100,
        isFull: true,
        station: "Posto Ipiranga",
        createdAt: "2025-04-02T16:45:00Z",
        updatedAt: "2025-04-02T16:45:00Z",
      }
    ]);

    // Set mock vehicles data
    setVehicles([
      {
        id: "vehicle-1",
        plate: "ABC1234",
        make: "Volkswagen",
        model: "Constellation 24.280",
        year: "2020",
        brand: "Volkswagen",
        type: "truck",
        capacity: 24000,
        fuelType: "diesel",
        currentOdometer: 15000,
        lastOilChange: 10000,
        nextOilChangeKm: 20000,
        status: "active"
      },
      {
        id: "vehicle-2",
        plate: "DEF5678",
        make: "Mercedes-Benz",
        model: "Sprinter 415",
        year: "2021",
        brand: "Mercedes-Benz",
        type: "van",
        capacity: 3500,
        fuelType: "diesel",
        currentOdometer: 12000,
        lastOilChange: 9000,
        nextOilChangeKm: 15000,
        status: "active"
      }
    ]);

    // Set mock maintenance records
    setMaintenanceRecords([
      {
        id: "maintenance-1",
        date: "2025-03-15",
        vehicleId: "vehicle-1",
        maintenanceType: "oil_change",
        description: "Troca de óleo e filtros",
        cost: 850.00,
        odometer: 10000,
        provider: "Oficina Mecânica Brasil",
        notes: "Próxima troca em 5.000 km",
        createdAt: "2025-03-15T14:30:00Z",
        updatedAt: "2025-03-15T14:30:00Z"
      },
      {
        id: "maintenance-2",
        date: "2025-03-25",
        vehicleId: "vehicle-2",
        maintenanceType: "brakes",
        description: "Troca de pastilhas de freio",
        cost: 650.00,
        odometer: 11500,
        provider: "Auto Center Express",
        notes: "Rotores em bom estado",
        createdAt: "2025-03-25T10:15:00Z",
        updatedAt: "2025-03-25T10:15:00Z"
      }
    ]);

    // Set mock tire maintenance records
    setTireMaintenanceRecords([
      {
        id: "tire-1",
        date: "2025-03-20",
        vehicleId: "vehicle-1",
        maintenanceType: "replacement",
        tirePosition: "frontLeft",
        tireSize: "295/80 R22.5",
        brand: "Michelin",
        mileage: 80000,
        cost: 1800.00,
        description: "Substituição preventiva",
        provider: "Pneus Brasil",
        createdAt: "2025-03-20T09:45:00Z",
        updatedAt: "2025-03-20T09:45:00Z"
      },
      {
        id: "tire-2",
        date: "2025-03-22",
        vehicleId: "vehicle-2",
        maintenanceType: "puncture",
        tirePosition: "rearRight",
        tireSize: "225/75 R16C",
        brand: "Pirelli",
        mileage: 35000,
        cost: 120.00,
        description: "Reparo de furo",
        provider: "Borracharia Rápida",
        createdAt: "2025-03-22T16:30:00Z",
        updatedAt: "2025-03-22T16:30:00Z"
      }
    ]);
    
    // Set loading to false when employees data is loaded
    if (!employeesLoading) {
      setIsLoading(false);
    }
  }, [employeesLoading]);
  
  // CRUD operations for logbook entries
  const addEntry = async (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const now = new Date().toISOString();
    const newEntry: LogbookEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      userId: user?.id,
    };
    
    setEntries([...entries, newEntry]);
  };
  
  const updateEntry = async (id: string, entry: Partial<LogbookEntry>) => {
    setEntries(entries.map(e => 
      e.id === id ? { ...e, ...entry, updatedAt: new Date().toISOString() } : e
    ));
  };
  
  const deleteEntry = async (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };
  
  // CRUD operations for fuel records
  const addFuelRecord = async (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const now = new Date().toISOString();
    const newRecord: FuelRecord = {
      ...record,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      userId: user?.id,
    };
    
    setFuelRecords([...fuelRecords, newRecord]);
  };
  
  const updateFuelRecord = async (id: string, record: Partial<FuelRecord>) => {
    setFuelRecords(fuelRecords.map(r => 
      r.id === id ? { ...r, ...record, updatedAt: new Date().toISOString() } : r
    ));
  };
  
  const deleteFuelRecord = async (id: string) => {
    setFuelRecords(fuelRecords.filter(r => r.id !== id));
  };

  const getFuelRecordById = (id: string) => {
    return fuelRecords.find(record => record.id === id);
  };

  // Logbook entries with new naming
  const addLogbookEntry = (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    addEntry(entry);
  };

  const updateLogbookEntry = (id: string, entry: Partial<LogbookEntry>) => {
    updateEntry(id, entry);
  };

  const getLogbookEntryById = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  // Vehicle CRUD operations
  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const now = new Date().toISOString();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      userId: user?.id,
    };
    
    setVehicles([...vehicles, newVehicle]);
  };

  const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
    setVehicles(vehicles.map(v => 
      v.id === id ? { ...v, ...vehicle, updatedAt: new Date().toISOString() } : v
    ));
  };

  const deleteVehicle = async (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  // Maintenance CRUD operations
  const addMaintenance = (maintenance: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const now = new Date().toISOString();
    const newMaintenance: Maintenance = {
      ...maintenance,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      userId: user?.id,
    };
    
    setMaintenanceRecords([...maintenanceRecords, newMaintenance]);
  };

  const updateMaintenance = (id: string, maintenance: Partial<Maintenance>) => {
    setMaintenanceRecords(maintenanceRecords.map(m => 
      m.id === id ? { ...m, ...maintenance, updatedAt: new Date().toISOString() } : m
    ));
  };

  const deleteMaintenance = (id: string) => {
    setMaintenanceRecords(maintenanceRecords.filter(m => m.id !== id));
  };

  // Tire maintenance CRUD operations
  const deleteTireMaintenance = async (id: string) => {
    setTireMaintenanceRecords(tireMaintenanceRecords.filter(t => t.id !== id));
  };
  
  return (
    <LogbookContext.Provider value={{
      entries,
      fuelRecords,
      isLoading,
      addEntry,
      updateEntry,
      deleteEntry,
      addFuelRecord,
      updateFuelRecord,
      deleteFuelRecord,
      getFuelRecordById,
      addLogbookEntry,
      updateLogbookEntry,
      getLogbookEntryById,
      vehicles,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      employees, // Now using real employees data
      maintenanceRecords,
      addMaintenance,
      updateMaintenance,
      deleteMaintenance,
      tireMaintenanceRecords,
      deleteTireMaintenance,
    }}>
      {children}
    </LogbookContext.Provider>
  );
};

export const useLogbook = () => {
  const context = useContext(LogbookContext);
  if (context === undefined) {
    throw new Error('useLogbook must be used within a LogbookProvider');
  }
  return context;
};
