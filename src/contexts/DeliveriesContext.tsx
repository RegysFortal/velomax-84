
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Delivery {
  id: string;
  clientId: string;
  clientName?: string;
  cityId?: string;
  cityName?: string;
  minuteNumber: string;
  packages: number;
  weight: number;
  cargoType: string;
  cargoValue?: number;
  deliveryType: string;
  notes?: string;
  occurrence?: string;
  receiver: string;
  deliveryDate: string;
  deliveryTime: string;
  totalFreight: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryFormData {
  minuteNumber: string;
  clientId: string;
  cityId?: string;
  packages: number;
  weight: number;
  cargoType: string;
  cargoValue?: number;
  deliveryType: string;
  notes?: string;
  occurrence?: string;
  receiver: string;
  deliveryDate: string;
  deliveryTime: string;
  totalFreight: number;
}

interface DeliveriesContextType {
  deliveries: Delivery[];
  loading: boolean;
  addDelivery: (delivery: DeliveryFormData) => Promise<Delivery | undefined>;
  updateDelivery: (id: string, data: Partial<Delivery>) => Promise<Delivery | undefined>;
  deleteDelivery: (id: string) => Promise<boolean>;
  getDeliveryById: (id: string) => Delivery | undefined;
  createDeliveriesFromShipment: (shipment: any, deliveryDetails: any) => Promise<void>;
  refreshDeliveries: () => Promise<void>;
}

const DeliveriesContext = createContext<DeliveriesContextType | undefined>(undefined);

export const DeliveriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch deliveries from Supabase
  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('deliveries')
        .select('*, clients(name)')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedDeliveries = data.map((item: any) => ({
        id: item.id,
        clientId: item.client_id,
        clientName: item.clients?.name,
        cityId: item.city_id,
        minuteNumber: item.minute_number,
        packages: item.packages,
        weight: item.weight,
        cargoType: item.cargo_type,
        cargoValue: item.cargo_value,
        deliveryType: item.delivery_type,
        notes: item.notes,
        occurrence: item.occurrence,
        receiver: item.receiver,
        deliveryDate: item.delivery_date,
        deliveryTime: item.delivery_time,
        totalFreight: item.total_freight,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      setDeliveries(formattedDeliveries);
      return formattedDeliveries;
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast.error('Erro ao buscar entregas');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new delivery
  const addDelivery = async (deliveryData: DeliveryFormData) => {
    try {
      // Ensure total_freight is a valid number and correctly calculated
      const totalFreight = parseFloat(deliveryData.totalFreight.toString()) || 0;

      const { data, error } = await supabase
        .from('deliveries')
        .insert({
          id: uuidv4(),
          client_id: deliveryData.clientId,
          city_id: deliveryData.cityId,
          minute_number: deliveryData.minuteNumber,
          packages: deliveryData.packages,
          weight: deliveryData.weight,
          cargo_type: deliveryData.cargoType,
          cargo_value: deliveryData.cargoValue,
          delivery_type: deliveryData.deliveryType,
          notes: deliveryData.notes,
          occurrence: deliveryData.occurrence,
          receiver: deliveryData.receiver,
          delivery_date: deliveryData.deliveryDate,
          delivery_time: deliveryData.deliveryTime,
          total_freight: totalFreight, // Ensure this is a number
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Format the new delivery to match our app's structure
      const newDelivery: Delivery = {
        id: data.id,
        clientId: data.client_id,
        cityId: data.city_id,
        minuteNumber: data.minute_number,
        packages: data.packages,
        weight: data.weight,
        cargoType: data.cargo_type,
        cargoValue: data.cargo_value,
        deliveryType: data.delivery_type,
        notes: data.notes,
        occurrence: data.occurrence,
        receiver: data.receiver,
        deliveryDate: data.delivery_date,
        deliveryTime: data.delivery_time,
        totalFreight: data.total_freight,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      // Update local state
      setDeliveries((prevDeliveries) => [newDelivery, ...prevDeliveries]);

      return newDelivery;
    } catch (error) {
      console.error('Error adding delivery:', error);
      toast.error('Erro ao adicionar entrega');
      return undefined;
    }
  };

  // Update an existing delivery
  const updateDelivery = async (id: string, data: Partial<Delivery>) => {
    try {
      // Convert app data structure to Supabase structure
      const supabaseData: any = {
        client_id: data.clientId,
        city_id: data.cityId,
        minute_number: data.minuteNumber,
        packages: data.packages,
        weight: data.weight,
        cargo_type: data.cargoType,
        cargo_value: data.cargoValue,
        delivery_type: data.deliveryType,
        notes: data.notes,
        occurrence: data.occurrence,
        receiver: data.receiver,
        delivery_date: data.deliveryDate,
        delivery_time: data.deliveryTime,
        total_freight: parseFloat(String(data.totalFreight)) || 0, // Ensure this is a number
      };

      // Remove undefined values
      Object.keys(supabaseData).forEach(
        (key) => supabaseData[key] === undefined && delete supabaseData[key]
      );

      const { data: updatedData, error } = await supabase
        .from('deliveries')
        .update(supabaseData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Format the updated delivery
      const updatedDelivery: Delivery = {
        id: updatedData.id,
        clientId: updatedData.client_id,
        cityId: updatedData.city_id,
        minuteNumber: updatedData.minute_number,
        packages: updatedData.packages,
        weight: updatedData.weight,
        cargoType: updatedData.cargo_type,
        cargoValue: updatedData.cargo_value,
        deliveryType: updatedData.delivery_type,
        notes: updatedData.notes,
        occurrence: updatedData.occurrence,
        receiver: updatedData.receiver,
        deliveryDate: updatedData.delivery_date,
        deliveryTime: updatedData.delivery_time,
        totalFreight: updatedData.total_freight,
        createdAt: updatedData.created_at,
        updatedAt: updatedData.updated_at,
      };

      // Update local state
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.id === id ? { ...delivery, ...updatedDelivery } : delivery
        )
      );

      return updatedDelivery;
    } catch (error) {
      console.error('Error updating delivery:', error);
      toast.error('Erro ao atualizar entrega');
      return undefined;
    }
  };

  // Delete a delivery
  const deleteDelivery = async (id: string) => {
    try {
      const { error } = await supabase.from('deliveries').delete().eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setDeliveries((prevDeliveries) =>
        prevDeliveries.filter((delivery) => delivery.id !== id)
      );

      return true;
    } catch (error) {
      console.error('Error deleting delivery:', error);
      toast.error('Erro ao excluir entrega');
      return false;
    }
  };

  // Get a delivery by ID
  const getDeliveryById = (id: string) => {
    return deliveries.find((delivery) => delivery.id === id);
  };

  // Create deliveries from shipment
  const createDeliveriesFromShipment = async (shipment: any, deliveryDetails: any) => {
    try {
      console.log("Creating deliveries from shipment:", shipment);
      console.log("Delivery details:", deliveryDetails);

      if (!shipment || !deliveryDetails || !deliveryDetails.selectedDocumentIds || deliveryDetails.selectedDocumentIds.length === 0) {
        console.error("Invalid shipment or delivery details");
        return;
      }

      // Get selected documents
      const selectedDocs = shipment.documents.filter((doc: any) => 
        deliveryDetails.selectedDocumentIds.includes(doc.id)
      );

      if (selectedDocs.length === 0) {
        console.error("No selected documents found");
        return;
      }

      console.log("Selected documents:", selectedDocs);

      // Create a delivery for each selected document
      for (const doc of selectedDocs) {
        const newDelivery: DeliveryFormData = {
          clientId: shipment.companyId,
          minuteNumber: doc.minuteNumber || "",
          packages: doc.packages || 1,
          weight: doc.weight || 0,
          cargoType: "cargo", // Default value
          deliveryType: "normal", // Default value
          receiver: deliveryDetails.receiverName,
          deliveryDate: deliveryDetails.deliveryDate,
          deliveryTime: deliveryDetails.deliveryTime,
          totalFreight: 0, // This will be calculated correctly
        };

        console.log("Creating new delivery:", newDelivery);
        await addDelivery(newDelivery);
      }

      // Update the shipment documents as delivered
      if (shipment.id && deliveryDetails.selectedDocumentIds.length > 0) {
        try {
          const { error } = await supabase
            .from('shipment_documents')
            .update({ is_delivered: true })
            .in('id', deliveryDetails.selectedDocumentIds);

          if (error) {
            console.error("Error updating shipment documents:", error);
          }
        } catch (err) {
          console.error("Error updating shipment documents:", err);
        }
      }

      toast.success("Entregas criadas com sucesso");
    } catch (error) {
      console.error("Error creating deliveries from shipment:", error);
      toast.error("Erro ao criar entregas a partir do embarque");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const refreshDeliveries = async () => {
    await fetchDeliveries();
  };

  return (
    <DeliveriesContext.Provider
      value={{
        deliveries,
        loading,
        addDelivery,
        updateDelivery,
        deleteDelivery,
        getDeliveryById,
        createDeliveriesFromShipment,
        refreshDeliveries,
      }}
    >
      {children}
    </DeliveriesContext.Provider>
  );
};

export const useDeliveries = () => {
  const context = useContext(DeliveriesContext);
  if (context === undefined) {
    throw new Error('useDeliveries must be used within a DeliveriesProvider');
  }
  return context;
};
