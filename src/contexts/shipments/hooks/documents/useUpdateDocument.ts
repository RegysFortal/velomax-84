
import { Shipment, Document } from "@/types/shipment";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { mapDocumentToSupabase } from "./documentMappers";

export const useUpdateDocument = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const updateDocument = async (shipmentId: string, documentId: string, updatedDocuments: Document[]) => {
    try {
      const now = new Date().toISOString();
      
      // Find the document to update
      const documentToUpdate = updatedDocuments.find(d => d.id === documentId);
      
      if (!documentToUpdate) {
        throw new Error("Document not found in the updated documents array");
      }
      
      console.log("Document to update:", documentToUpdate);
      
      // Prepare data for Supabase using our mapper
      const supabaseDocument = mapDocumentToSupabase(documentToUpdate);
      
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
      
      // Update the shipments state with the updated document
      const updatedShipmentsList = shipments.map(s => {
        if (s.id === shipmentId) {
          // Get all other documents that weren't updated
          const otherDocuments = s.documents.filter(d => d.id !== documentId);
          // Combine with the updated document
          const newDocuments = [...otherDocuments, documentToUpdate];
          
          return { 
            ...s, 
            documents: newDocuments,
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

  return { updateDocument };
};
