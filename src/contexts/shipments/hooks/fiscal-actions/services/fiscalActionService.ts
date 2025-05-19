
import { supabase } from '@/integrations/supabase/client';
import { FiscalAction } from '@/types/shipment';
import { mapFiscalActionToSupabase, mapSupabaseToFiscalAction } from '../utils/fiscalActionMappers';
import { toast } from "sonner";

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
      const supabaseData = mapFiscalActionToSupabase(fiscalActionData, undefined, userId);
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
      const supabaseData = mapFiscalActionToSupabase(completeData, shipmentId, userId);
      console.log("Creating new fiscal action for shipment:", shipmentId);
      console.log("Creation data:", supabaseData);
      
      // Make sure required fields are present for database insert
      if (!supabaseData.reason) supabaseData.reason = 'Não especificado';
      if (supabaseData.amount_to_pay === undefined) supabaseData.amount_to_pay = 0;
      
      // Insert new fiscal action
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
      await supabase
        .from('shipments')
        .update({ 
          is_retained: isRetained,
          status: isRetained ? "retained" : "in_transit",
          updated_at: new Date().toISOString()
        })
        .eq('id', shipmentId);
    } catch (error) {
      console.warn("Could not update shipment retention status:", error);
    }
  }
};
