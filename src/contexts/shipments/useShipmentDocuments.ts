
import { Shipment, Document } from "@/types/shipment";
import { DocumentCreateData } from "./types";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useShipmentDocuments = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const addDocument = async (shipmentId: string, document: DocumentCreateData) => {
    try {
      const now = new Date().toISOString();
      
      // Prepare data for Supabase insert
      const supabaseDocument = {
        shipment_id: shipmentId,
        name: document.name,
        type: document.type,
        url: document.url,
        notes: document.notes,
        minute_number: document.minuteNumber,
        invoice_numbers: document.invoiceNumbers,
        weight: document.weight,
        packages: document.packages,
        is_delivered: document.isDelivered || false,
        created_at: now,
        updated_at: now
      };
      
      // Insert document into Supabase
      const { data: newDoc, error } = await supabase
        .from('shipment_documents')
        .insert(supabaseDocument)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Map the Supabase data to our Document type
      const newDocument: Document = {
        id: newDoc.id,
        name: newDoc.name,
        type: newDoc.type,
        url: newDoc.url,
        notes: newDoc.notes,
        minuteNumber: newDoc.minute_number,
        invoiceNumbers: newDoc.invoice_numbers || [],
        weight: newDoc.weight,
        packages: newDoc.packages,
        isDelivered: newDoc.is_delivered,
        createdAt: newDoc.created_at,
        updatedAt: newDoc.updated_at
      };
      
      // Update state
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
    } catch (error) {
      console.error("Error adding document:", error);
      toast.error("Erro ao adicionar documento");
      throw error;
    }
  };
  
  const updateDocument = async (shipmentId: string, documentId: string, documentData: Partial<Document>) => {
    try {
      const now = new Date().toISOString();
      
      // Prepare data for Supabase update
      const supabaseDocument: any = {
        updated_at: now
      };
      
      // Map fields from our model to Supabase column names
      if (documentData.name !== undefined) supabaseDocument.name = documentData.name;
      if (documentData.type !== undefined) supabaseDocument.type = documentData.type;
      if (documentData.url !== undefined) supabaseDocument.url = documentData.url;
      if (documentData.notes !== undefined) supabaseDocument.notes = documentData.notes;
      if (documentData.minuteNumber !== undefined) supabaseDocument.minute_number = documentData.minuteNumber;
      if (documentData.invoiceNumbers !== undefined) supabaseDocument.invoice_numbers = documentData.invoiceNumbers;
      if (documentData.weight !== undefined) supabaseDocument.weight = documentData.weight;
      if (documentData.packages !== undefined) supabaseDocument.packages = documentData.packages;
      if (documentData.isDelivered !== undefined) supabaseDocument.is_delivered = documentData.isDelivered;
      
      // Update document in Supabase
      const { error } = await supabase
        .from('shipment_documents')
        .update(supabaseDocument)
        .eq('id', documentId);
        
      if (error) {
        throw error;
      }
      
      // Update the document in state
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
      
      // Return the updated document
      const shipment = updatedShipments.find(s => s.id === shipmentId);
      const updatedDocument = shipment?.documents.find(d => d.id === documentId);
      
      if (!updatedDocument) {
        throw new Error("Document not found");
      }
      
      return updatedDocument;
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Erro ao atualizar documento");
      throw error;
    }
  };
  
  const deleteDocument = async (shipmentId: string, documentId: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('shipment_documents')
        .delete()
        .eq('id', documentId);
        
      if (error) {
        throw error;
      }
      
      // Update state
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
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Erro ao excluir documento");
      throw error;
    }
  };
  
  return {
    addDocument,
    updateDocument,
    deleteDocument
  };
};
