import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Shipment, Document, FiscalAction, ShipmentStatus } from "@/types/shipment";
import { toast } from "sonner";

interface ShipmentsContextType {
  shipments: Shipment[];
  loading: boolean;
  
  // CRUD operations for shipments
  addShipment: (shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt' | 'documents'>) => Promise<Shipment>;
  updateShipment: (id: string, shipment: Partial<Shipment>) => Promise<Shipment>;
  deleteShipment: (id: string) => Promise<void>;
  getShipmentById: (id: string) => Shipment | undefined;
  
  // Document management
  addDocument: (shipmentId: string, document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Document>;
  updateDocument: (shipmentId: string, documentId: string, document: Partial<Document>) => Promise<Document>;
  deleteDocument: (shipmentId: string, documentId: string) => Promise<void>;
  
  // Fiscal action management
  updateFiscalAction: (shipmentId: string, fiscalAction: Omit<FiscalAction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FiscalAction>;
  clearFiscalAction: (shipmentId: string) => Promise<void>;
  
  // Status management
  updateStatus: (shipmentId: string, status: ShipmentStatus) => Promise<void>;
  
  // Filtering functions
  getShipmentsByStatus: (status: ShipmentStatus) => Shipment[];
  getShipmentsByCarrier: (carrierName: string) => Shipment[];
  getShipmentsByDateRange: (startDate: string, endDate: string) => Shipment[];
  getShipmentsByCompany: (companyId: string) => Shipment[];
  getRetainedShipments: () => Shipment[];
  getUndeliveredShipments: () => Shipment[];
}

const ShipmentsContext = createContext<ShipmentsContextType | undefined>(undefined);

interface ShipmentsProviderProps {
  children: ReactNode;
}

export function ShipmentsProvider({ children }: ShipmentsProviderProps) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = () => {
      try {
        const storedShipments = localStorage.getItem("velomax_shipments");
        
        if (storedShipments) {
          setShipments(JSON.parse(storedShipments));
        }
      } catch (error) {
        console.error("Error loading shipments data:", error);
        toast.error("Não foi possível carregar os dados de embarques.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("velomax_shipments", JSON.stringify(shipments));
    }
  }, [shipments, loading]);
  
  const addShipment = async (shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt' | 'documents'>) => {
    const now = new Date().toISOString();
    const newShipment: Shipment = {
      ...shipment,
      id: uuidv4(),
      documents: [],
      createdAt: now,
      updatedAt: now,
    };
    
    setShipments(prev => [...prev, newShipment]);
    return newShipment;
  };
  
  const updateShipment = async (id: string, shipmentData: Partial<Shipment>) => {
    const updatedShipments = shipments.map(s => {
      if (s.id === id) {
        return { ...s, ...shipmentData, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    
    setShipments(updatedShipments);
    const updatedShipment = updatedShipments.find(s => s.id === id);
    
    if (!updatedShipment) {
      throw new Error("Shipment not found");
    }
    
    return updatedShipment;
  };
  
  const deleteShipment = async (id: string) => {
    setShipments(prev => prev.filter(s => s.id !== id));
  };
  
  const getShipmentById = (id: string) => {
    return shipments.find(s => s.id === id);
  };
  
  const addDocument = async (shipmentId: string, document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newDocument: Document = {
      ...document,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    const updatedShipments = shipments.map(s => {
      if (s.id === shipmentId) {
        return { 
          ...s, 
          documents: [...s.documents, newDocument],
          updatedAt: now
        };
      }
      return s;
    });
    
    setShipments(updatedShipments);
    return newDocument;
  };
  
  const updateDocument = async (shipmentId: string, documentId: string, documentData: Partial<Document>) => {
    const now = new Date().toISOString();
    const updatedShipments = shipments.map(s => {
      if (s.id === shipmentId) {
        const updatedDocuments = s.documents.map(d => {
          if (d.id === documentId) {
            return { ...d, ...documentData, updatedAt: now };
          }
          return d;
        });
        
        return { 
          ...s, 
          documents: updatedDocuments,
          updatedAt: now
        };
      }
      return s;
    });
    
    setShipments(updatedShipments);
    
    const shipment = updatedShipments.find(s => s.id === shipmentId);
    const updatedDocument = shipment?.documents.find(d => d.id === documentId);
    
    if (!updatedDocument) {
      throw new Error("Document not found");
    }
    
    return updatedDocument;
  };
  
  const deleteDocument = async (shipmentId: string, documentId: string) => {
    const now = new Date().toISOString();
    const updatedShipments = shipments.map(s => {
      if (s.id === shipmentId) {
        return { 
          ...s, 
          documents: s.documents.filter(d => d.id !== documentId),
          updatedAt: now
        };
      }
      return s;
    });
    
    setShipments(updatedShipments);
  };
  
  const updateFiscalAction = async (shipmentId: string, fiscalActionData: Omit<FiscalAction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const fiscalAction: FiscalAction = {
      ...fiscalActionData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    const updatedShipments = shipments.map(s => {
      if (s.id === shipmentId) {
        return { 
          ...s, 
          fiscalAction,
          isRetained: true,
          status: "retained" as ShipmentStatus,
          updatedAt: now
        };
      }
      return s;
    });
    
    setShipments(updatedShipments);
    return fiscalAction;
  };
  
  const clearFiscalAction = async (shipmentId: string) => {
    const now = new Date().toISOString();
    const updatedShipments = shipments.map(s => {
      if (s.id === shipmentId) {
        return { 
          ...s, 
          fiscalAction: undefined,
          isRetained: false,
          updatedAt: now
        };
      }
      return s;
    });
    
    setShipments(updatedShipments);
  };
  
  const updateStatus = async (shipmentId: string, status: ShipmentStatus) => {
    const now = new Date().toISOString();
    const updatedShipments = shipments.map(s => {
      if (s.id === shipmentId) {
        return { 
          ...s, 
          status,
          isRetained: status === "retained" ? s.isRetained : false,
          updatedAt: now
        };
      }
      return s;
    });
    
    setShipments(updatedShipments);
  };
  
  const getShipmentsByStatus = (status: ShipmentStatus) => {
    return shipments.filter(s => s.status === status);
  };
  
  const getShipmentsByCarrier = (carrierName: string) => {
    return shipments.filter(s => 
      s.carrierName.toLowerCase().includes(carrierName.toLowerCase())
    );
  };
  
  const getShipmentsByDateRange = (startDate: string, endDate: string) => {
    return shipments.filter(s => {
      if (!s.arrivalDate) return false;
      return s.arrivalDate >= startDate && s.arrivalDate <= endDate;
    });
  };
  
  const getShipmentsByCompany = (companyId: string) => {
    return shipments.filter(s => s.companyId === companyId);
  };
  
  const getRetainedShipments = () => {
    return shipments.filter(s => s.isRetained);
  };
  
  const getUndeliveredShipments = () => {
    return shipments.filter(s => s.status !== "delivered");
  };
  
  const contextValue: ShipmentsContextType = {
    shipments,
    loading,
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentById,
    addDocument,
    updateDocument,
    deleteDocument,
    updateFiscalAction,
    clearFiscalAction,
    updateStatus,
    getShipmentsByStatus,
    getShipmentsByCarrier,
    getShipmentsByDateRange,
    getShipmentsByCompany,
    getRetainedShipments,
    getUndeliveredShipments,
  };
  
  return (
    <ShipmentsContext.Provider value={contextValue}>
      {children}
    </ShipmentsContext.Provider>
  );
}

export const useShipments = () => {
  const context = useContext(ShipmentsContext);
  
  if (context === undefined) {
    throw new Error("useShipments must be used within a ShipmentsProvider");
  }
  
  return context;
};
