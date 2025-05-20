
import { useCallback } from "react";
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to load fiscal action data from the database
 */
export const useFiscalActionLoader = () => {
  /**
   * Format a number value to display as currency with comma separator
   */
  const formatAmountForDisplay = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '';
    
    // Convert to string and ensure we have 2 decimal places
    const valueStr = amount.toFixed(2);
    
    // Replace dot with comma for Brazilian format
    return valueStr.replace('.', ',');
  };

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
        const formattedAmount = formatAmountForDisplay(data.amount_to_pay);
        
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
