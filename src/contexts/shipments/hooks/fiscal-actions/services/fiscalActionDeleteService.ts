
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for fiscal action deletion operations
 */
export const fiscalActionDeleteService = {
  /**
   * Deletes a fiscal action by ID
   */
  async deleteFiscalAction(fiscalActionId: string): Promise<boolean> {
    try {
      console.log("Removing fiscal action with ID:", fiscalActionId);
      
      const { error } = await supabase
        .from('fiscal_actions')
        .delete()
        .eq('id', fiscalActionId);
        
      if (error) {
        console.error("Error deleting fiscal action:", error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting fiscal action:", error);
      throw error;
    }
  }
};
