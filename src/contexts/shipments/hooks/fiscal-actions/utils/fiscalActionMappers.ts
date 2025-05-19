
import { FiscalAction } from "@/types/shipment";

/**
 * Maps fiscal action domain model to Supabase database format
 */
export const mapFiscalActionToSupabase = (
  fiscalActionData: Partial<FiscalAction>, 
  shipmentId?: string,
  userId?: string
): Record<string, any> => {
  const now = new Date().toISOString();
  const supabaseFiscalAction: Record<string, any> = {
    updated_at: now
  };
  
  // Add shipment_id if provided (for creation)
  if (shipmentId) {
    supabaseFiscalAction.shipment_id = shipmentId;
  }

  // Add user_id if provided
  if (userId) {
    supabaseFiscalAction.user_id = userId;
  }
  
  // Map only the fields that were provided
  if (fiscalActionData.actionNumber !== undefined) supabaseFiscalAction.action_number = fiscalActionData.actionNumber;
  if (fiscalActionData.reason !== undefined) supabaseFiscalAction.reason = fiscalActionData.reason;
  if (fiscalActionData.amountToPay !== undefined) supabaseFiscalAction.amount_to_pay = fiscalActionData.amountToPay;
  if (fiscalActionData.paymentDate !== undefined) supabaseFiscalAction.payment_date = fiscalActionData.paymentDate;
  if (fiscalActionData.releaseDate !== undefined) supabaseFiscalAction.release_date = fiscalActionData.releaseDate;
  if (fiscalActionData.notes !== undefined) supabaseFiscalAction.notes = fiscalActionData.notes;
  
  // For creation, add created_at
  if (shipmentId) {
    supabaseFiscalAction.created_at = now;
  }
  
  return supabaseFiscalAction;
};

/**
 * Maps Supabase database response to fiscal action domain model
 */
export const mapSupabaseToFiscalAction = (data: any): FiscalAction => {
  return {
    id: data.id,
    actionNumber: data.action_number,
    reason: data.reason,
    amountToPay: data.amount_to_pay,
    paymentDate: data.payment_date,
    releaseDate: data.release_date,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};
