
import { Document } from "@/types/shipment";

/**
 * Maps Supabase document data to our Document type
 */
export const mapSupabaseToDocument = (supabaseDoc: any): Document => {
  return {
    id: supabaseDoc.id,
    name: supabaseDoc.name,
    type: supabaseDoc.type as "cte" | "invoice" | "delivery_location" | "other",
    url: supabaseDoc.url,
    notes: supabaseDoc.notes,
    minuteNumber: supabaseDoc.minute_number,
    invoiceNumbers: supabaseDoc.invoice_numbers || [],
    weight: supabaseDoc.weight,
    packages: supabaseDoc.packages,
    isDelivered: supabaseDoc.is_delivered,
    createdAt: supabaseDoc.created_at,
    updatedAt: supabaseDoc.updated_at
  };
};

/**
 * Maps Document type to Supabase format
 */
export const mapDocumentToSupabase = (document: Partial<Document>, shipmentId?: string) => {
  const now = new Date().toISOString();
  
  // Ensure document.type is a valid value if provided
  const documentType = document.type as "cte" | "invoice" | "delivery_location" | "other";
  
  // Ensure invoiceNumbers is an array
  const invoiceNumbersArray = Array.isArray(document.invoiceNumbers) 
    ? document.invoiceNumbers 
    : (document.invoiceNumbers ? [document.invoiceNumbers] : []);
  
  // Prepare data for Supabase
  return {
    ...(shipmentId && { shipment_id: shipmentId }),
    ...(document.name && { name: document.name }),
    ...(documentType && { type: documentType }),
    ...(document.url && { url: document.url }),
    ...(document.notes !== undefined && { notes: document.notes }),
    ...(document.minuteNumber !== undefined && { minute_number: document.minuteNumber }),
    invoice_numbers: invoiceNumbersArray,
    ...(document.weight !== undefined && { weight: document.weight }),
    ...(document.packages !== undefined && { packages: document.packages }),
    ...(document.isDelivered !== undefined && { is_delivered: document.isDelivered }),
    updated_at: now,
    ...(shipmentId && { created_at: now }) // Only include created_at for new documents
  };
};
