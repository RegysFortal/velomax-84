import { useState } from 'react';
import { Shipment, ShipmentStatus, TransportMode } from '@/types/shipment';
import { ShipmentCreateData } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useShipmentOperations(
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) {
  const [loading, setLoading] = useState(false);

  const addShipment = async (shipmentData: ShipmentCreateData): Promise<Shipment> => {
    try {
      setLoading(true);

      // Get current user for user_id field
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      console.log('useShipmentOperations - shipmentData received:', shipmentData);
      console.log('useShipmentOperations - arrivalDate:', shipmentData.arrivalDate);

      const supabaseShipment = {
        company_id: shipmentData.companyId,
        company_name: shipmentData.companyName,
        transport_mode: shipmentData.transportMode,
        carrier_name: shipmentData.carrierName,
        tracking_number: shipmentData.trackingNumber,
        packages: shipmentData.packages,
        weight: shipmentData.weight,
        arrival_flight: shipmentData.arrivalFlight,
        arrival_date: shipmentData.arrivalDate, // Manter a data ISO exatamente como recebida
        observations: shipmentData.observations,
        status: shipmentData.status,
        user_id: user.id,
        is_retained: shipmentData.status === 'retained'
      };

      console.log('useShipmentOperations - supabaseShipment to be saved:', supabaseShipment);

      const { data, error } = await supabase
        .from('shipments')
        .insert(supabaseShipment)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('useShipmentOperations - shipment saved in database:', data);

      const newShipment: Shipment = {
        id: data.id,
        companyId: data.company_id,
        companyName: data.company_name,
        transportMode: data.transport_mode as TransportMode,
        carrierName: data.carrier_name,
        trackingNumber: data.tracking_number,
        packages: data.packages,
        weight: data.weight,
        arrivalFlight: data.arrival_flight,
        arrivalDate: data.arrival_date,
        observations: data.observations,
        status: data.status as ShipmentStatus,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isRetained: data.is_retained || false,
        receiverName: data.receiver_name,
        receiverId: data.receiver_id,
        deliveryDate: data.delivery_date,
        deliveryTime: data.delivery_time,
        documents: [] // Initialize empty documents array
      };

      // Update shipments list immediately
      setShipments(prev => [newShipment, ...prev]);
      
      // Dispatch custom events to notify other components
      window.dispatchEvent(new CustomEvent('shipment-created', { 
        detail: { shipment: newShipment } 
      }));
      window.dispatchEvent(new CustomEvent('shipments-updated', { 
        detail: { type: 'create', shipment: newShipment } 
      }));
      
      toast.success("Embarque criado com sucesso");
      return newShipment;
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error("Erro ao criar embarque");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateShipment = async (id: string, updates: Partial<Shipment>): Promise<Shipment> => {
    try {
      setLoading(true);

      const updateData: any = {};
      
      if (updates.companyId !== undefined) updateData.company_id = updates.companyId;
      if (updates.companyName !== undefined) updateData.company_name = updates.companyName;
      if (updates.transportMode !== undefined) updateData.transport_mode = updates.transportMode;
      if (updates.carrierName !== undefined) updateData.carrier_name = updates.carrierName;
      if (updates.trackingNumber !== undefined) updateData.tracking_number = updates.trackingNumber;
      if (updates.packages !== undefined) updateData.packages = updates.packages;
      if (updates.weight !== undefined) updateData.weight = updates.weight;
      if (updates.arrivalFlight !== undefined) updateData.arrival_flight = updates.arrivalFlight;
      if (updates.arrivalDate !== undefined) updateData.arrival_date = updates.arrivalDate;
      if (updates.observations !== undefined) updateData.observations = updates.observations;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.isRetained !== undefined) updateData.is_retained = updates.isRetained;
      if (updates.receiverName !== undefined) updateData.receiver_name = updates.receiverName;
      if (updates.receiverId !== undefined) updateData.receiver_id = updates.receiverId;
      if (updates.deliveryDate !== undefined) updateData.delivery_date = updates.deliveryDate;
      if (updates.deliveryTime !== undefined) updateData.delivery_time = updates.deliveryTime;

      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('shipments')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      setShipments(prev => 
        prev.map(shipment => 
          shipment.id === id 
            ? { ...shipment, ...updates, updatedAt: updateData.updated_at }
            : shipment
        )
      );

      toast.success("Embarque atualizado com sucesso");
      const updatedShipment = { ...updates, updatedAt: updateData.updated_at } as Shipment;
      return updatedShipment;
    } catch (error) {
      console.error('Error updating shipment:', error);
      toast.error("Erro ao atualizar embarque");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteShipment = async (id: string): Promise<void> => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setShipments(prev => prev.filter(shipment => shipment.id !== id));
      
      toast.success("Embarque excluído com sucesso");
    } catch (error) {
      console.error('Error deleting shipment:', error);
      toast.error("Erro ao excluir embarque");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: ShipmentStatus): Promise<Shipment | undefined> => {
    try {
      const { error } = await supabase
        .from('shipments')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setShipments(prev => 
        prev.map(shipment => 
          shipment.id === id 
            ? { ...shipment, status, updatedAt: new Date().toISOString() }
            : shipment
        )
      );

      toast.success("Status do embarque atualizado");
      return shipments.find(s => s.id === id);
    } catch (error) {
      console.error('Error updating shipment status:', error);
      toast.error("Erro ao atualizar status do embarque");
      throw error;
    }
  };

  const getShipmentById = (id: string): Shipment | undefined => {
    return shipments.find(shipment => shipment.id === id);
  };

  return {
    addShipment,
    updateShipment,
    deleteShipment,
    updateStatus,
    getShipmentById,
    loading
  };
}
