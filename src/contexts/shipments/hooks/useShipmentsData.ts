
import { useState, useEffect } from 'react';
import { Shipment, Document } from '@/types/shipment';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User as SupabaseUser } from '@supabase/supabase-js';

export function useShipmentsData(user: SupabaseUser | null | undefined) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const mapSupabaseToDocument = (doc: any): Document => {
    return {
      id: doc.id,
      name: doc.name,
      type: doc.type,
      url: doc.url,
      notes: doc.notes,
      minuteNumber: doc.minute_number,
      invoiceNumbers: doc.invoice_numbers || [],
      weight: doc.weight ? parseFloat(doc.weight) : undefined,
      packages: doc.packages,
      status: 'in_transit', // Default status
      isPriority: false, // Default priority
      retentionInfo: {
        _type: "undefined",
        value: "undefined"
      },
      deliveryInfo: {
        _type: "undefined", 
        value: "undefined"
      },
      isDelivered: doc.is_delivered || false,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at
    };
  };

  const fetchShipments = async () => {
    try {
      setLoading(true);
      
      console.log("Fetching shipments with documents...");
      
      // Fetch shipments with their documents
      const { data: shipmentsData, error: shipmentsError } = await supabase
        .from('shipments')
        .select(`
          *,
          shipment_documents (*)
        `)
        .order('created_at', { ascending: false });
      
      if (shipmentsError) {
        throw shipmentsError;
      }
      
      console.log("Raw shipments data from Supabase:", shipmentsData);
      
      const mappedShipments = shipmentsData.map((shipment: any): Shipment => {
        // Map documents
        const documents = shipment.shipment_documents?.map(mapSupabaseToDocument) || [];
        
        console.log(`Shipment ${shipment.id} has ${documents.length} documents:`, documents);
        
        return {
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
          documents: documents // Ensure documents are included
        };
      });
      
      console.log("Final mapped shipments:", mappedShipments);
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
    console.log("Refreshing shipments data...");
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
