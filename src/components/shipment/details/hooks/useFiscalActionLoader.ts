
import { useCallback } from "react";
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to load fiscal action data from the database
 */
export const useFiscalActionLoader = () => {
  /**
   * Load fiscal action data directly from the database
   */
  const loadLatestFiscalActionData = useCallback(async (shipmentId: string) => {
    if (!shipmentId) return null;
    
    try {
      console.log("Loading latest fiscal action data for shipment:", shipmentId);
      const { data, error } = await supabase
        .from('fiscal_actions')
        .select('*')
        .eq('shipment_id', shipmentId)
        .maybeSingle();
        
      if (error) {
        console.error("Error loading fiscal action data:", error);
        return null;
      }
      
      if (data) {
        console.log("Loaded fresh fiscal action data from database:", data);
        
        // Format amount with comma as decimal separator for display
        let formattedAmount = '';
        if (data.amount_to_pay) {
          // Convert to string with 2 decimal places and replace period with comma
          formattedAmount = data.amount_to_pay.toString().replace('.', ',');
          
          // Ensure we have 2 decimal places
          if (!formattedAmount.includes(',')) {
            formattedAmount += ',00';
          } else {
            const parts = formattedAmount.split(',');
            if (parts[1].length === 1) {
              formattedAmount += '0';
            }
          }
        }
        
        return {
          actionNumber: data.action_number || '',
          reason: data.reason || '',
          amountToPay: formattedAmount || '',
          paymentDate: data.payment_date || '',
          releaseDate: data.release_date || '',
          notes: data.notes || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error in loadLatestFiscalActionData:", error);
      return null;
    }
  }, []);

  return { loadLatestFiscalActionData };
};
