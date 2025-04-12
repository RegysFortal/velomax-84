
import { useState } from "react";
import { Shipment, ShipmentStatus, TransportMode } from "@/types/shipment";
import { ShipmentCreateData } from "./types";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useShipmentOperations = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const addShipment = async (shipmentData: ShipmentCreateData) => {
    try {
      // Ensure transport_mode and status are valid enum values
      const transportMode = shipmentData.transportMode as TransportMode;
      const status = shipmentData.status as ShipmentStatus;
      
      // Prepare data for Supabase insert
      const supabaseShipment = {
        company_id: shipmentData.companyId,
        company_name: shipmentData.companyName,
        transport_mode: transportMode,
        carrier_name: shipmentData.carrierName,
        tracking_number: shipmentData.trackingNumber,
        packages: shipmentData.packages,
        weight: shipmentData.weight,
        arrival_flight: shipmentData.arrivalFlight,
        arrival_date: shipmentData.arrivalDate,
        observations: shipmentData.observations,
        status: status,
        is_retained: shipmentData.status === 'retained'
      };
      
      // Insert shipment into Supabase
      const { data: newShipment, error } = await supabase
        .from('shipments')
        .insert(supabaseShipment)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // If the shipment is retained, create a fiscal action record
      let fiscalAction = undefined;
      if (shipmentData.status === 'retained' && shipmentData.fiscalActionData) {
        const fiscalActionData = {
          shipment_id: newShipment.id,
          action_number: shipmentData.fiscalActionData.actionNumber,
          reason: shipmentData.fiscalActionData.reason,
          amount_to_pay: shipmentData.fiscalActionData.amountToPay,
          payment_date: shipmentData.fiscalActionData.paymentDate,
          release_date: shipmentData.fiscalActionData.releaseDate,
          notes: shipmentData.fiscalActionData.notes
        };
        
        const { data: newFiscalAction, error: fiscalError } = await supabase
          .from('fiscal_actions')
          .insert(fiscalActionData)
          .select()
          .single();
          
        if (fiscalError) {
          console.error("Error creating fiscal action:", fiscalError);
        } else {
          fiscalAction = {
            id: newFiscalAction.id,
            actionNumber: newFiscalAction.action_number,
            reason: newFiscalAction.reason,
            amountToPay: newFiscalAction.amount_to_pay,
            paymentDate: newFiscalAction.payment_date,
            releaseDate: newFiscalAction.release_date,
            notes: newFiscalAction.notes,
            createdAt: newFiscalAction.created_at,
            updatedAt: newFiscalAction.updated_at
          };
        }
      }
      
      // Map the Supabase data to our Shipment type
      const newShipmentMapped: Shipment = {
        id: newShipment.id,
        companyId: newShipment.company_id,
        companyName: newShipment.company_name,
        transportMode: newShipment.transport_mode as TransportMode,
        carrierName: newShipment.carrier_name,
        trackingNumber: newShipment.tracking_number,
        packages: newShipment.packages,
        weight: newShipment.weight,
        arrivalFlight: newShipment.arrival_flight,
        arrivalDate: newShipment.arrival_date,
        observations: newShipment.observations,
        status: newShipment.status as ShipmentStatus,
        isRetained: newShipment.is_retained,
        documents: [],
        fiscalAction,
        createdAt: newShipment.created_at,
        updatedAt: newShipment.updated_at
      };
      
      // Update state
      setShipments(prev => [newShipmentMapped, ...prev]);
      return newShipmentMapped;
    } catch (error) {
      console.error("Error adding shipment:", error);
      toast.error("Erro ao criar embarque");
      throw error;
    }
  };
  
  const updateShipment = async (id: string, shipmentData: Partial<Shipment>) => {
    try {
      console.log("Updating shipment:", id, shipmentData);
      
      // Prepare data for Supabase update
      const supabaseShipment: any = {
        updated_at: new Date().toISOString()
      };
      
      // Map fields from our model to Supabase column names
      if (shipmentData.companyId !== undefined) supabaseShipment.company_id = shipmentData.companyId;
      if (shipmentData.companyName !== undefined) supabaseShipment.company_name = shipmentData.companyName;
      if (shipmentData.transportMode !== undefined) supabaseShipment.transport_mode = shipmentData.transportMode;
      if (shipmentData.carrierName !== undefined) supabaseShipment.carrier_name = shipmentData.carrierName;
      if (shipmentData.trackingNumber !== undefined) supabaseShipment.tracking_number = shipmentData.trackingNumber;
      if (shipmentData.packages !== undefined) supabaseShipment.packages = shipmentData.packages;
      if (shipmentData.weight !== undefined) supabaseShipment.weight = shipmentData.weight;
      if (shipmentData.arrivalFlight !== undefined) supabaseShipment.arrival_flight = shipmentData.arrivalFlight;
      if (shipmentData.arrivalDate !== undefined) supabaseShipment.arrival_date = shipmentData.arrivalDate;
      if (shipmentData.observations !== undefined) supabaseShipment.observations = shipmentData.observations;
      if (shipmentData.status !== undefined) supabaseShipment.status = shipmentData.status;
      if (shipmentData.isRetained !== undefined) supabaseShipment.is_retained = shipmentData.isRetained;
      if (shipmentData.deliveryDate !== undefined) supabaseShipment.delivery_date = shipmentData.deliveryDate;
      if (shipmentData.deliveryTime !== undefined) supabaseShipment.delivery_time = shipmentData.deliveryTime;
      if (shipmentData.receiverName !== undefined) supabaseShipment.receiver_name = shipmentData.receiverName;
      if (shipmentData.receiverId !== undefined) supabaseShipment.receiver_id = shipmentData.receiverId;
      
      console.log("Supabase shipment update data:", supabaseShipment);
      
      // Update shipment in Supabase
      const { error } = await supabase
        .from('shipments')
        .update(supabaseShipment)
        .eq('id', id);
        
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
      // Update the shipment in state
      const updatedShipments = shipments.map(s => {
        if (s.id === id) {
          return { ...s, ...shipmentData, updatedAt: supabaseShipment.updated_at };
        }
        return s;
      });
      
      setShipments(updatedShipments);
      
      // Return the updated shipment
      const updatedShipment = updatedShipments.find(s => s.id === id);
      if (!updatedShipment) {
        throw new Error("Shipment not found");
      }
      
      return updatedShipment;
    } catch (error) {
      console.error("Error updating shipment:", error);
      toast.error("Erro ao atualizar embarque");
      throw error;
    }
  };
  
  const deleteShipment = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update state
      setShipments(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting shipment:", error);
      toast.error("Erro ao excluir embarque");
      throw error;
    }
  };
  
  const getShipmentById = (id: string) => {
    return shipments.find(s => s.id === id);
  };
  
  const updateStatus = async (shipmentId: string, status: ShipmentStatus): Promise<Shipment | undefined> => {
    try {
      console.log(`Updating shipment status to ${status} for ID: ${shipmentId}`);
      
      // Update in Supabase
      const { error } = await supabase
        .from('shipments')
        .update({ 
          status,
          is_retained: status === 'retained',
          updated_at: new Date().toISOString()
        })
        .eq('id', shipmentId);
        
      if (error) {
        console.error("Supabase status update error:", error);
        throw error;
      }
      
      // Update state
      const updatedShipments = shipments.map(s => {
        if (s.id === shipmentId) {
          return { 
            ...s, 
            status,
            isRetained: status === 'retained',
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      });
      
      setShipments(updatedShipments);
      return updatedShipments.find(s => s.id === shipmentId);
    } catch (error) {
      console.error("Error updating shipment status:", error);
      toast.error("Erro ao atualizar status do embarque");
      throw error;
    }
  };
  
  return {
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentById,
    updateStatus
  };
};
