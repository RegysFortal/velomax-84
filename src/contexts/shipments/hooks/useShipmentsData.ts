
import { useState, useEffect } from 'react';
import { Shipment } from '@/types/shipment';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User as SupabaseUser } from '@supabase/supabase-js';

export function useShipmentsData(user: SupabaseUser | null | undefined) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const mappedShipments = data.map((shipment: any): Shipment => ({
        id: shipment.id,
        companyId: shipment.company_id,
        companyName: shipment.company_name,
        transportMode: shipment.transport_mode,
        carrierName: shipment.carrier_name,
        trackingNumber: shipment.tracking_number,
        packages: shipment.packages,
        weight: shipment.weight,
        arrivalFlight: shipment.arrival_flight,
        arrivalDate: shipment.arrival_date,
        observations: shipment.observations,
        status: shipment.status,
        createdAt: shipment.created_at,
        updatedAt: shipment.updated_at,
        isRetained: shipment.is_retained || false,
        receiverName: shipment.receiver_name,
        receiverId: shipment.receiver_id,
        deliveryDate: shipment.delivery_date,
        deliveryTime: shipment.delivery_time,
        documents: [] // Initialize empty documents array
      }));
      
      setShipments(mappedShipments);
      
      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('shipments-updated', { 
        detail: { type: 'fetch', shipments: mappedShipments } 
      }));
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast.error("Erro ao carregar embarques. Usando dados locais como fallback.");
      
      // Load from localStorage as fallback
      const storedShipments = localStorage.getItem('velomax_shipments');
      if (storedShipments) {
        try {
          const parsed = JSON.parse(storedShipments);
          setShipments(parsed);
        } catch (error) {
          console.error('Failed to parse stored shipments', error);
          setShipments([]);
        }
      } else {
        setShipments([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshShipmentsData = () => {
    fetchShipments();
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // Save shipments to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_shipments', JSON.stringify(shipments));
    }
  }, [shipments, loading]);

  // Listen for shipment updates
  useEffect(() => {
    const handleShipmentUpdate = () => {
      fetchShipments();
    };

    window.addEventListener('shipment-created', handleShipmentUpdate);
    window.addEventListener('shipment-updated', handleShipmentUpdate);
    
    return () => {
      window.removeEventListener('shipment-created', handleShipmentUpdate);
      window.removeEventListener('shipment-updated', handleShipmentUpdate);
    };
  }, []);

  return {
    shipments,
    setShipments,
    loading,
    refreshShipmentsData
  };
}
