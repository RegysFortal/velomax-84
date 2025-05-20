
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
      
      // Debug invoice numbers
      console.log("Adding document with invoice numbers:", document.invoiceNumbers);
      
      // Prepare data for Supabase insert
      const supabaseDocument = {
        shipment_id: shipmentId,
        name: document.name,
        type: documentType,
        url: document.url,
        notes: document.notes,
        minute_number: document.minuteNumber,
        invoice_numbers: document.invoiceNumbers || [],
        weight: document.weight,
        packages: document.packages,
        is_delivered: document.isDelivered || false,
        created_at: now,
        updated_at: now
      };
      
      // Debug final object being sent to Supabase
      console.log("Supabase document object:", supabaseDocument);
      
      // Insert document into Supabase
      const { data: newDoc, error } = await supabase
        .from('shipment_documents')
        .insert(supabaseDocument)
        .select()
        .single();
        
      if (error) {
        console.error("Error in addDocument:", error);
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
      
      console.log("New document created:", newDocument);
      
      // Update state
      const updatedShipments = shipments.map(s => {
        if (s.id === shipmentId) {
          return { 
            ...s, 
            documents: [...(s.documents || []), newDocument],
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
      
      console.log("Document to update:", documentToUpdate);
      console.log("Invoice numbers to save:", documentToUpdate.invoiceNumbers);
      
      // Prepare data for Supabase update
      const supabaseDocument = {
        name: documentToUpdate.name,
        type: documentToUpdate.type,
        url: documentToUpdate.url,
        notes: documentToUpdate.notes,
        minute_number: documentToUpdate.minuteNumber,
        invoice_numbers: Array.isArray(documentToUpdate.invoiceNumbers) 
          ? documentToUpdate.invoiceNumbers 
          : [],
        weight: documentToUpdate.weight,
        packages: documentToUpdate.packages,
        is_delivered: documentToUpdate.isDelivered || false,
        updated_at: now
      };
      
      console.log("Supabase document update:", supabaseDocument);
      
      // Update document in Supabase
      const { error } = await supabase
        .from('shipment_documents')
        .update(supabaseDocument)
        .eq('id', documentId);
        
      if (error) {
        console.error("Error updating document in Supabase:", error);
        throw error;
      }
      
      console.log("Document updated successfully in Supabase");
      
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
      
      console.log("Updated shipments state:", updatedShipmentsList.find(s => s.id === shipmentId)?.documents);
      
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
            documents: (s.documents || []).filter(d => d.id !== documentId),
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
