
import { supabase } from '@/integrations/supabase/client';
import { FiscalAction } from '@/types/shipment';
import { mapFiscalActionToSupabase, mapSupabaseToFiscalAction } from '../utils/fiscalActionMappers';
import { toast } from "sonner";

// Define interface for Supabase Fiscal Action to match the database schema
interface SupabaseFiscalAction {
  id?: string;
  shipment_id: string;
  reason: string;
  amount_to_pay: number;
  action_number?: string;
  payment_date?: string;
  release_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

/**
 * Service for fiscal action operations with Supabase
 */
export const fiscalActionService = {
  /**
   * Updates an existing fiscal action
   */
  async updateFiscalAction(
    fiscalActionId: string,
    fiscalActionData: Partial<FiscalAction>
  ): Promise<FiscalAction | null> {
    try {
      // Get current user if available
      let userId: string | undefined;
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          userId = userData.user.id;
        }
      } catch (userError) {
        console.warn("Could not get current user for fiscal action update:", userError);
      }
      
      // Map domain model to Supabase format
      const mappedData = mapFiscalActionToSupabase(fiscalActionData, undefined, userId);
      
      // Create properly typed update object for Supabase
      const supabaseData: Partial<SupabaseFiscalAction> = {
        updated_at: new Date().toISOString()
      };
      
      // Only include fields that exist in mappedData
      if (mappedData.action_number !== undefined) supabaseData.action_number = mappedData.action_number;
      if (mappedData.reason !== undefined) supabaseData.reason = mappedData.reason;
      if (mappedData.amount_to_pay !== undefined) supabaseData.amount_to_pay = mappedData.amount_to_pay;
      if (mappedData.payment_date !== undefined) supabaseData.payment_date = mappedData.payment_date;
      if (mappedData.release_date !== undefined) supabaseData.release_date = mappedData.release_date;
      if (mappedData.notes !== undefined) supabaseData.notes = mappedData.notes;
      if (mappedData.user_id !== undefined) supabaseData.user_id = mappedData.user_id;
      
      console.log("Updating fiscal action with ID:", fiscalActionId);
      console.log("Update data:", supabaseData);
      
      // Track request timing for debugging
      const requestStart = Date.now();
      
      // Execute update
      const { error, data } = await supabase
        .from('fiscal_actions')
        .update(supabaseData)
        .eq('id', fiscalActionId)
        .select('*');
        
      console.log(`Request time: ${Date.now() - requestStart}ms`);  
      
      if (error) {
        console.error("Error updating fiscal action:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.error("No data returned after update");
        throw new Error("Failed to update fiscal action: no data returned");
      }
      
      console.log("Supabase response after update:", data);
      
      // Map response to domain model
      return mapSupabaseToFiscalAction(data[0]);
    } catch (error) {
      console.error("Error updating fiscal action:", error);
      throw error;
    }
  },
  
  /**
   * Creates a new fiscal action
   */
  async createFiscalAction(
    shipmentId: string,
    fiscalActionData: Partial<FiscalAction>
  ): Promise<FiscalAction | null> {
    try {
      // Get current user if available
      let userId: string | undefined;
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          userId = userData.user.id;
        }
      } catch (userError) {
        console.warn("Could not get current user for fiscal action creation:", userError);
      }
      
      // Ensure all required fields are present with defaults
      const completeData: Partial<FiscalAction> = {
        reason: 'Não especificado',
        amountToPay: 0,
        ...fiscalActionData
      };
      
      // Map domain model to Supabase format
      const mappedData = mapFiscalActionToSupabase(completeData, shipmentId, userId);
      
      // Create a properly typed object for Supabase
      const supabaseData: SupabaseFiscalAction = {
        shipment_id: shipmentId,
        reason: mappedData.reason || 'Não especificado',
        amount_to_pay: mappedData.amount_to_pay !== undefined ? mappedData.amount_to_pay : 0,
        action_number: mappedData.action_number,
        payment_date: mappedData.payment_date,
        release_date: mappedData.release_date,
        notes: mappedData.notes,
        created_at: mappedData.created_at,
        updated_at: mappedData.updated_at,
        user_id: mappedData.user_id
      };
      
      console.log("Creating new fiscal action for shipment:", shipmentId);
      console.log("Creation data:", supabaseData);
      
      // Insert new fiscal action with properly typed data
      const { data: newFiscalAction, error } = await supabase
        .from('fiscal_actions')
        .insert(supabaseData)
        .select('*')
        .single();
        
      if (error) {
        console.error("Error creating fiscal action:", error);
        throw error;
      }
      
      if (!newFiscalAction) {
        console.error("No data returned after creation");
        throw new Error("Failed to create fiscal action: no data returned");
      }
      
      console.log("New fiscal action created:", newFiscalAction);
      
      // Map response to domain model
      return mapSupabaseToFiscalAction(newFiscalAction);
    } catch (error) {
      console.error("Error creating fiscal action:", error);
      throw error;
    }
  },
  
  /**
   * Updates shipment retention status
   */
  async updateShipmentRetentionStatus(
    shipmentId: string, 
    isRetained: boolean
  ): Promise<void> {
    try {
      console.log(`Updating shipment ${shipmentId} retention status to ${isRetained}`);
      const { error } = await supabase
        .from('shipments')
        .update({ 
          is_retained: isRetained,
          status: isRetained ? "retained" : "in_transit",
          updated_at: new Date().toISOString()
        })
        .eq('id', shipmentId);
        
      if (error) {
        console.error("Error updating shipment retention status:", error);
        throw error;
      }
      
      console.log("Shipment retention status updated successfully");
    } catch (error) {
      console.warn("Could not update shipment retention status:", error);
      throw error;
    }
  }
};
