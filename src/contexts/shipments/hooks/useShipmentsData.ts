
import { useState, useEffect } from 'react';
import { Shipment, ShipmentStatus } from '@/types/shipment';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { mapShipmentFromSupabase, mapDocumentFromSupabase } from '../utils/shipmentMappers';

export function useShipmentsData(user: any) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshShipmentsData = () => {
    if (!isRefreshing) {
      console.log("Manually refreshing shipments data");
      setIsRefreshing(true);
      setRefreshTrigger(prev => prev + 1);
    }
  };

  useEffect(() => {
    const loadShipmentsData = async () => {
      try {
        if (!user) return;
        
        if (!loading && !isRefreshing) setLoading(true);
        console.log("Loading shipments data from database...");
        
        const { data: shipmentsData, error: shipmentsError } = await supabase
          .from('shipments')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (shipmentsError) {
          throw shipmentsError;
        }
        
        console.log(`Retrieved ${shipmentsData.length} shipments from database`);
        
        const shipmentsWithDetailsPromises = shipmentsData.map(async (shipment) => {
          const { data: documentsData, error: documentsError } = await supabase
            .from('shipment_documents')
            .select('*')
            .eq('shipment_id', shipment.id);
          
          if (documentsError) {
            console.error('Error fetching documents:', documentsError);
            return {
              ...mapShipmentFromSupabase(shipment),
              documents: []
            };
          }
          
          let fiscalAction = undefined;
          
          // Explicitly check if the shipment is retained to fetch fiscal action
          if (shipment.is_retained) {
            const { data: fiscalData, error: fiscalError } = await supabase
              .from('fiscal_actions')
              .select('*')
              .eq('shipment_id', shipment.id)
              .maybeSingle();
            
            if (!fiscalError && fiscalData) {
              fiscalAction = {
                id: fiscalData.id,
                actionNumber: fiscalData.action_number,
                reason: fiscalData.reason,
                amountToPay: fiscalData.amount_to_pay,
                paymentDate: fiscalData.payment_date,
                releaseDate: fiscalData.release_date,
                notes: fiscalData.notes,
                createdAt: fiscalData.created_at,
                updatedAt: fiscalData.updated_at
              };
              
              console.log(`Found fiscal action for retained shipment ${shipment.id}:`, fiscalAction);
            } else if (fiscalError) {
              console.error(`Error fetching fiscal action for shipment ${shipment.id}:`, fiscalError);
            } else {
              console.warn(`Shipment ${shipment.id} is marked as retained but no fiscal action found`);
            }
          }
          
          return {
            ...mapShipmentFromSupabase(shipment),
            documents: documentsData.map(mapDocumentFromSupabase),
            fiscalAction
          };
        });
        
        const shipmentsWithDetails = await Promise.all(shipmentsWithDetailsPromises);
        
        // Store in localStorage for backup
        localStorage.setItem('velomax_shipments', JSON.stringify(shipmentsWithDetails));
        
        // Update state
        setShipments(shipmentsWithDetails as Shipment[]);
      } catch (error) {
        console.error("Error loading shipments data:", error);
        toast.error("Não foi possível carregar os dados de embarques.");
        
        // Try to load from localStorage if available as fallback
        const storedShipments = localStorage.getItem("velomax_shipments");
        if (storedShipments) {
          try {
            const parsed = JSON.parse(storedShipments);
            setShipments(parsed as Shipment[]);
            console.log("Loaded shipments from local storage as fallback");
          } catch (parseError) {
            console.error("Error parsing stored shipments:", parseError);
            setShipments([]);
          }
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };
    
    loadShipmentsData();
  }, [user, refreshTrigger]);

  return {
    shipments,
    setShipments,
    loading,
    refreshShipmentsData
  };
}
