
import { v4 as uuidv4 } from "uuid";
import { Shipment, Document } from "@/types/shipment";
import { DocumentCreateData } from "./types";

export const useShipmentDocuments = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const addDocument = async (shipmentId: string, document: DocumentCreateData) => {
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
  
  return {
    addDocument,
    updateDocument,
    deleteDocument
  };
};
