
import { Document } from "@/types/shipment";

/**
 * Maps a Supabase document object to our Document type
 */
export const mapSupabaseToDocument = (supabaseDoc: any): Document => {
  return {
    id: supabaseDoc.id,
    name: supabaseDoc.name,
    type: supabaseDoc.type,
    url: supabaseDoc.url,
    notes: supabaseDoc.notes,
    minuteNumber: supabaseDoc.minute_number,
    invoiceNumbers: supabaseDoc.invoice_numbers || [],
    weight: supabaseDoc.weight ? parseFloat(supabaseDoc.weight) : undefined,
    packages: supabaseDoc.packages,
    status: 'in_transit', // Default status
    isPriority: false, // Default priority
    retentionInfo: {
      // Empty retention info object - will be populated when document is retained
    },
    deliveryInfo: {
      // Empty delivery info object - will be populated when document is delivered
    },
    isDelivered: supabaseDoc.is_delivered || false,
    createdAt: supabaseDoc.created_at,
    updatedAt: supabaseDoc.updated_at
  };
};

/**
 * Maps our Document type to a Supabase document object for updates
 */
export const mapDocumentToSupabase = (document: Document) => {
  return {
    name: document.name,
    type: document.type,
    url: document.url,
    notes: document.notes,
    minute_number: document.minuteNumber,
    invoice_numbers: document.invoiceNumbers,
    weight: document.weight,
    packages: document.packages,
    is_delivered: document.isDelivered,
    updated_at: new Date().toISOString()
  };
};
