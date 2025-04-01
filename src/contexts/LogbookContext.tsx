import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { 
  LogbookEntry, 
  Vehicle, 
  Employee, 
  FuelRecord, 
  Maintenance, 
  TireMaintenance 
} from "@/types";
import { toast } from "@/components/ui/use-toast";

interface LogbookContextType {
  entries: LogbookEntry[];
  vehicles: Vehicle[];
  employees: Employee[];
  fuelRecords: FuelRecord[];
  maintenances: Maintenance[];
  tireMaintenance: TireMaintenance[];
  loading: boolean;
  
  // Operações de entradas do diário
  addLogbookEntry: (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<LogbookEntry>;
  updateLogbookEntry: (id: string, entry: Partial<LogbookEntry>) => Promise<LogbookEntry>;
  deleteLogbookEntry: (id: string) => Promise<void>;
  getLogbookEntryById: (id: string) => LogbookEntry | undefined;
  
  // Operações de veículos
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Vehicle>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<Vehicle>;
  deleteVehicle: (id: string) => Promise<void>;
  getVehicleById: (id: string) => Vehicle | undefined;
  
  // Operações de funcionários
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Employee>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
  getEmployeeById: (id: string) => Employee | undefined;
  
  // Operações de abastecimentos
  addFuelRecord: (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FuelRecord>;
  updateFuelRecord: (id: string, record: Partial<FuelRecord>) => Promise<FuelRecord>;
  deleteFuelRecord: (id: string) => Promise<void>;
  getFuelRecordById: (id: string) => FuelRecord | undefined;
  
  // Operações de manutenções
  addMaintenance: (maintenance: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Maintenance>;
  updateMaintenance: (id: string, maintenance: Partial<Maintenance>) => Promise<Maintenance>;
  deleteMaintenance: (id: string) => Promise<void>;
  getMaintenanceById: (id: string) => Maintenance | undefined;
  
  // Operações de manutenção de pneus
  addTireMaintenance: (tire: Omit<TireMaintenance, 'id' | 'createdAt' | 'updatedAt'>) => Promise<TireMaintenance>;
  updateTireMaintenance: (id: string, tire: Partial<TireMaintenance>) => Promise<TireMaintenance>;
  deleteTireMaintenance: (id: string) => Promise<void>;
  getTireMaintenanceById: (id: string) => TireMaintenance | undefined;
}

const LogbookContext = createContext<LogbookContextType | undefined>(undefined);

interface LogbookProviderProps {
  children: ReactNode;
}

// Mock data para inicialização
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    plate: "ABC-1234",
    model: "Fiorino",
    year: "2020",
    make: "Fiat",
    currentOdometer: 45000,
    lastOilChange: 42000,
    nextOilChangeKm: 47000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    plate: "DEF-5678",
    model: "Saveiro",
    year: "2019",
    make: "Volkswagen",
    currentOdometer: 62000,
    lastOilChange: 60000,
    nextOilChangeKm: 65000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "João Silva",
    role: "driver",
    employeeSince: "2021-01-15",
    dateOfBirth: "1985-05-12",
    phone: "(11) 98765-4321",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Maria Souza",
    role: "assistant",
    employeeSince: "2022-03-20",
    dateOfBirth: "1990-07-25",
    phone: "(11) 91234-5678",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export function LogbookProvider({ children }: LogbookProviderProps) {
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [tireMaintenance, setTireMaintenance] = useState<TireMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const loadData = () => {
      try {
        const storedEntries = localStorage.getItem("logbook_entries");
        const storedVehicles = localStorage.getItem("logbook_vehicles");
        const storedEmployees = localStorage.getItem("logbook_employees");
        const storedFuelRecords = localStorage.getItem("logbook_fuel_records");
        const storedMaintenances = localStorage.getItem("logbook_maintenances");
        const storedTireMaintenance = localStorage.getItem("logbook_tire_maintenance");
        
        if (storedEntries) setEntries(JSON.parse(storedEntries));
        if (storedVehicles) setVehicles(JSON.parse(storedVehicles));
        else setVehicles(mockVehicles);
        if (storedEmployees) {
          const parsedEmployees = JSON.parse(storedEmployees);
          // Migrate old employees data structure if needed
          const migratedEmployees = parsedEmployees.map((emp: any) => {
            if (emp.documentId && !emp.employeeSince) {
              return {
                ...emp,
                employeeSince: new Date().toISOString().split('T')[0],
              };
            }
            return emp;
          });
          setEmployees(migratedEmployees);
        }
        else setEmployees(mockEmployees);
        if (storedFuelRecords) setFuelRecords(JSON.parse(storedFuelRecords));
        if (storedMaintenances) setMaintenances(JSON.parse(storedMaintenances));
        if (storedTireMaintenance) setTireMaintenance(JSON.parse(storedTireMaintenance));
        
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do diário de bordo.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Salvar dados no localStorage quando houver mudanças
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("logbook_entries", JSON.stringify(entries));
      localStorage.setItem("logbook_vehicles", JSON.stringify(vehicles));
      localStorage.setItem("logbook_employees", JSON.stringify(employees));
      localStorage.setItem("logbook_fuel_records", JSON.stringify(fuelRecords));
      localStorage.setItem("logbook_maintenances", JSON.stringify(maintenances));
      localStorage.setItem("logbook_tire_maintenance", JSON.stringify(tireMaintenance));
    }
  }, [entries, vehicles, employees, fuelRecords, maintenances, tireMaintenance, loading]);
  
  // Operações de entradas do diário
  const addLogbookEntry = async (entry: Omit<LogbookEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newEntry: LogbookEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    setEntries(prev => [...prev, newEntry]);
    
    // Atualizar odômetro do veículo
    if (entry.vehicleId) {
      const vehicle = vehicles.find(v => v.id === entry.vehicleId);
      if (vehicle && entry.departureOdometer > vehicle.currentOdometer) {
        updateVehicle(entry.vehicleId, { currentOdometer: entry.departureOdometer });
      }
      
      if (entry.returnOdometer && entry.returnOdometer > vehicle?.currentOdometer!) {
        updateVehicle(entry.vehicleId, { currentOdometer: entry.returnOdometer });
      }
    }
    
    return newEntry;
  };
  
  const updateLogbookEntry = async (id: string, entry: Partial<LogbookEntry>) => {
    const updatedEntries = entries.map(e => {
      if (e.id === id) {
        const updatedEntry = { ...e, ...entry, updatedAt: new Date().toISOString() };
        
        // Atualizar odômetro do veículo se necessário
        if (updatedEntry.vehicleId && (updatedEntry.departureOdometer || updatedEntry.returnOdometer)) {
          const vehicle = vehicles.find(v => v.id === updatedEntry.vehicleId);
          
          if (updatedEntry.departureOdometer && updatedEntry.departureOdometer > vehicle?.currentOdometer!) {
            updateVehicle(updatedEntry.vehicleId, { currentOdometer: updatedEntry.departureOdometer });
          }
          
          if (updatedEntry.returnOdometer && updatedEntry.returnOdometer > vehicle?.currentOdometer!) {
            updateVehicle(updatedEntry.vehicleId, { currentOdometer: updatedEntry.returnOdometer });
          }
        }
        
        return updatedEntry;
      }
      return e;
    });
    
    setEntries(updatedEntries);
    const updatedEntry = updatedEntries.find(e => e.id === id);
    
    if (!updatedEntry) {
      throw new Error("Entry not found");
    }
    
    return updatedEntry;
  };
  
  const deleteLogbookEntry = async (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };
  
  const getLogbookEntryById = (id: string) => {
    return entries.find(e => e.id === id);
  };

  // Operações de veículos
  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    setVehicles(prev => [...prev, newVehicle]);
    return newVehicle;
  };
  
  const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
    const updatedVehicles = vehicles.map(v => {
      if (v.id === id) {
        return { ...v, ...vehicle, updatedAt: new Date().toISOString() };
      }
      return v;
    });
    
    setVehicles(updatedVehicles);
    const updatedVehicle = updatedVehicles.find(v => v.id === id);
    
    if (!updatedVehicle) {
      throw new Error("Vehicle not found");
    }
    
    return updatedVehicle;
  };
  
  const deleteVehicle = async (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };
  
  const getVehicleById = (id: string) => {
    return vehicles.find(v => v.id === id);
  };
  
  // Operações de funcionários
  const addEmployee = async (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newEmployee: Employee = {
      ...employee,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  };
  
  const updateEmployee = async (id: string, employee: Partial<Employee>) => {
    const updatedEmployees = employees.map(e => {
      if (e.id === id) {
        return { ...e, ...employee, updatedAt: new Date().toISOString() };
      }
      return e;
    });
    
    setEmployees(updatedEmployees);
    const updatedEmployee = updatedEmployees.find(e => e.id === id);
    
    if (!updatedEmployee) {
      throw new Error("Employee not found");
    }
    
    return updatedEmployee;
  };
  
  const deleteEmployee = async (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };
  
  const getEmployeeById = (id: string) => {
    return employees.find(e => e.id === id);
  };
  
  // Operações de abastecimentos
  const addFuelRecord = async (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newRecord: FuelRecord = {
      ...record,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    setFuelRecords(prev => [...prev, newRecord]);
    
    // Atualizar o odômetro do veículo se necessário
    const vehicle = vehicles.find(v => v.id === record.vehicleId);
    if (vehicle && record.odometerKm > vehicle.currentOdometer) {
      updateVehicle(record.vehicleId, { currentOdometer: record.odometerKm });
    }
    
    return newRecord;
  };
  
  const updateFuelRecord = async (id: string, record: Partial<FuelRecord>) => {
    const updatedRecords = fuelRecords.map(r => {
      if (r.id === id) {
        const updatedRecord = { ...r, ...record, updatedAt: new Date().toISOString() };
        
        // Atualizar o odômetro do veículo se necessário
        if (updatedRecord.vehicleId && updatedRecord.odometerKm) {
          const vehicle = vehicles.find(v => v.id === updatedRecord.vehicleId);
          if (vehicle && updatedRecord.odometerKm > vehicle.currentOdometer) {
            updateVehicle(updatedRecord.vehicleId, { currentOdometer: updatedRecord.odometerKm });
          }
        }
        
        return updatedRecord;
      }
      return r;
    });
    
    setFuelRecords(updatedRecords);
    const updatedRecord = updatedRecords.find(r => r.id === id);
    
    if (!updatedRecord) {
      throw new Error("Fuel record not found");
    }
    
    return updatedRecord;
  };
  
  const deleteFuelRecord = async (id: string) => {
    setFuelRecords(prev => prev.filter(r => r.id !== id));
  };
  
  const getFuelRecordById = (id: string) => {
    return fuelRecords.find(r => r.id === id);
  };

  // Operações de manutenções
  const addMaintenance = async (maintenance: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newMaintenance: Maintenance = {
      ...maintenance,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    setMaintenances(prev => [...prev, newMaintenance]);
    
    // Atualizar o odômetro do veículo se necessário
    const vehicle = vehicles.find(v => v.id === maintenance.vehicleId);
    if (vehicle && maintenance.odometerKm > vehicle.currentOdometer) {
      updateVehicle(maintenance.vehicleId, { currentOdometer: maintenance.odometerKm });
    }
    
    // Se for troca de óleo, atualizar o lastOilChange do veículo
    if (maintenance.type.toLowerCase().includes("óleo") || maintenance.type.toLowerCase().includes("oleo")) {
      updateVehicle(maintenance.vehicleId, { 
        lastOilChange: maintenance.odometerKm,
        nextOilChangeKm: maintenance.odometerKm + 5000 // Próxima troca em +5000km
      });
    }
    
    return newMaintenance;
  };
  
  const updateMaintenance = async (id: string, maintenance: Partial<Maintenance>) => {
    const updatedMaintenances = maintenances.map(m => {
      if (m.id === id) {
        const updatedMaintenance = { ...m, ...maintenance, updatedAt: new Date().toISOString() };
        
        // Atualizar o odômetro do veículo se necessário
        if (updatedMaintenance.vehicleId && updatedMaintenance.odometerKm) {
          const vehicle = vehicles.find(v => v.id === updatedMaintenance.vehicleId);
          if (vehicle && updatedMaintenance.odometerKm > vehicle.currentOdometer) {
            updateVehicle(updatedMaintenance.vehicleId, { currentOdometer: updatedMaintenance.odometerKm });
          }
          
          // Se for troca de óleo, atualizar o lastOilChange do veículo
          if (updatedMaintenance.type.toLowerCase().includes("óleo") || updatedMaintenance.type.toLowerCase().includes("oleo")) {
            updateVehicle(updatedMaintenance.vehicleId, { 
              lastOilChange: updatedMaintenance.odometerKm,
              nextOilChangeKm: updatedMaintenance.odometerKm + 5000 // Próxima troca em +5000km
            });
          }
        }
        
        return updatedMaintenance;
      }
      return m;
    });
    
    setMaintenances(updatedMaintenances);
    const updatedMaintenance = updatedMaintenances.find(m => m.id === id);
    
    if (!updatedMaintenance) {
      throw new Error("Maintenance record not found");
    }
    
    return updatedMaintenance;
  };
  
  const deleteMaintenance = async (id: string) => {
    setMaintenances(prev => prev.filter(m => m.id !== id));
  };
  
  const getMaintenanceById = (id: string) => {
    return maintenances.find(m => m.id === id);
  };
  
  // Operações de manutenção de pneus
  const addTireMaintenance = async (tire: Omit<TireMaintenance, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTire: TireMaintenance = {
      ...tire,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    setTireMaintenance(prev => [...prev, newTire]);
    
    // Atualizar o odômetro do veículo se necessário
    const vehicle = vehicles.find(v => v.id === tire.vehicleId);
    if (vehicle && tire.odometerKm > vehicle.currentOdometer) {
      updateVehicle(tire.vehicleId, { currentOdometer: tire.odometerKm });
    }
    
    return newTire;
  };
  
  const updateTireMaintenance = async (id: string, tire: Partial<TireMaintenance>) => {
    const updatedTires = tireMaintenance.map(t => {
      if (t.id === id) {
        const updatedTire = { ...t, ...tire, updatedAt: new Date().toISOString() };
        
        // Atualizar o odômetro do veículo se necessário
        if (updatedTire.vehicleId && updatedTire.odometerKm) {
          const vehicle = vehicles.find(v => v.id === updatedTire.vehicleId);
          if (vehicle && updatedTire.odometerKm > vehicle.currentOdometer) {
            updateVehicle(updatedTire.vehicleId, { currentOdometer: updatedTire.odometerKm });
          }
        }
        
        return updatedTire;
      }
      return t;
    });
    
    setTireMaintenance(updatedTires);
    const updatedTire = updatedTires.find(t => t.id === id);
    
    if (!updatedTire) {
      throw new Error("Tire maintenance record not found");
    }
    
    return updatedTire;
  };
  
  const deleteTireMaintenance = async (id: string) => {
    setTireMaintenance(prev => prev.filter(t => t.id !== id));
  };
  
  const getTireMaintenanceById = (id: string) => {
    return tireMaintenance.find(t => t.id === id);
  };
  
  const contextValue: LogbookContextType = {
    entries,
    vehicles,
    employees,
    fuelRecords,
    maintenances,
    tireMaintenance,
    loading,
    addLogbookEntry,
    updateLogbookEntry,
    deleteLogbookEntry,
    getLogbookEntryById,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    addFuelRecord,
    updateFuelRecord,
    deleteFuelRecord,
    getFuelRecordById,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    getMaintenanceById,
    addTireMaintenance,
    updateTireMaintenance,
    deleteTireMaintenance,
    getTireMaintenanceById,
  };
  
  return (
    <LogbookContext.Provider value={contextValue}>
      {children}
    </LogbookContext.Provider>
  );
}

export const useLogbook = () => {
  const context = useContext(LogbookContext);
  
  if (context === undefined) {
    throw new Error("useLogbook must be used within a LogbookProvider");
  }
  
  return context;
};
