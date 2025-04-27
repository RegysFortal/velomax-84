
import { useState, useEffect } from 'react';
import { Shipment } from '@/types/shipment';
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
        
        if (!loading) setLoading(true);
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
          if (shipment.is_retained) {
            const { data: fiscalData, error: fiscalError } = await supabase
              .from('fiscal_actions')
              .select('*')
              .eq('shipment_id', shipment.id)
              .single();
            
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
            }
          }
          
          return {
            ...mapShipmentFromSupabase(shipment),
            documents: documentsData.map(mapDocumentFromSupabase),
            fiscalAction
          };
        });
        
        const shipmentsWithDetails = await Promise.all(shipmentsWithDetailsPromises);
        setShipments(shipmentsWithDetails);
      } catch (error) {
        console.error("Error loading shipments data:", error);
        toast.error("Não foi possível carregar os dados de embarques.");
        
        const storedShipments = localStorage.getItem("velomax_shipments");
        if (storedShipments) {
          try {
            const parsed = JSON.parse(storedShipments);
            setShipments(parsed);
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
