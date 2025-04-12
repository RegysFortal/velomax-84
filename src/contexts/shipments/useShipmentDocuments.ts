
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
      
      // Ensure document.type is a valid value
      const documentType = document.type as "cte" | "invoice" | "delivery_location" | "other";
      
      // Prepare data for Supabase insert
      const supabaseDocument = {
        shipment_id: shipmentId,
        name: document.name,
        type: documentType,
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
        type: newDoc.type as "cte" | "invoice" | "delivery_location" | "other",
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
  
  const updateDocument = async (shipmentId: string, documentId: string, updatedDocuments: Document[]) => {
    try {
      const now = new Date().toISOString();
      
      // Find the document to update
      const documentToUpdate = updatedDocuments.find(d => d.id === documentId);
      
      if (!documentToUpdate) {
        throw new Error("Document not found in the updated documents array");
      }
      
      // Prepare data for Supabase update
      const supabaseDocument: any = {
        updated_at: now
      };
      
      // Map fields from our model to Supabase column names
      if (documentToUpdate.name !== undefined) supabaseDocument.name = documentToUpdate.name;
      if (documentToUpdate.type !== undefined) supabaseDocument.type = documentToUpdate.type;
      if (documentToUpdate.url !== undefined) supabaseDocument.url = documentToUpdate.url;
      if (documentToUpdate.notes !== undefined) supabaseDocument.notes = documentToUpdate.notes;
      if (documentToUpdate.minuteNumber !== undefined) supabaseDocument.minute_number = documentToUpdate.minuteNumber;
      if (documentToUpdate.invoiceNumbers !== undefined) supabaseDocument.invoice_numbers = documentToUpdate.invoiceNumbers;
      if (documentToUpdate.weight !== undefined) supabaseDocument.weight = documentToUpdate.weight;
      if (documentToUpdate.packages !== undefined) supabaseDocument.packages = documentToUpdate.packages;
      if (documentToUpdate.isDelivered !== undefined) supabaseDocument.is_delivered = documentToUpdate.isDelivered;
      
      // Update document in Supabase
      const { error } = await supabase
        .from('shipment_documents')
        .update(supabaseDocument)
        .eq('id', documentId);
        
      if (error) {
        throw error;
      }
      
      // Update the shipments state with the updated documents
      const updatedShipmentsList = shipments.map(s => {
        if (s.id === shipmentId) {
          return { 
            ...s, 
            documents: updatedDocuments,
            updatedAt: now
          };
        }
        return s;
      });
      
      setShipments(updatedShipmentsList);
      
      // Return the updated document
      return documentToUpdate;
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
