
import { Shipment } from "@/types/shipment";
import { DocumentCreateData } from "../../types";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { mapSupabaseToDocument } from "./documentMappers";

export const useAddDocument = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const addDocument = async (shipmentId: string, document: DocumentCreateData) => {
    try {
      const now = new Date().toISOString();
      
      // Ensure document.type is a valid value
      const documentType = document.type as "cte" | "invoice" | "delivery_location" | "other";
      
      // Ensure invoiceNumbers is an array
      const invoiceNumbersArray = Array.isArray(document.invoiceNumbers) 
        ? document.invoiceNumbers 
        : (document.invoiceNumbers ? [document.invoiceNumbers] : []);
      
      // Debug invoice numbers
      console.log("Adding document with invoice numbers:", invoiceNumbersArray);
      
      // Prepare data for Supabase insert
      const supabaseDocument = {
        shipment_id: shipmentId,
        name: document.name,
        type: documentType,
        url: document.url,
        notes: document.notes,
        minute_number: document.minuteNumber,
        invoice_numbers: invoiceNumbersArray,
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
      const newDocument = mapSupabaseToDocument(newDoc);
      
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

  return { addDocument };
};
