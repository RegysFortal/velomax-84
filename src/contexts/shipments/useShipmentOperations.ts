
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { ShipmentCreateData } from "./types";

export const useShipmentOperations = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const addShipment = async (shipmentData: ShipmentCreateData) => {
    const now = new Date().toISOString();
    
    let fiscalAction = undefined;
    
    if (shipmentData.fiscalActionData) {
      fiscalAction = {
        ...shipmentData.fiscalActionData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      };
    }
    
    const newShipment: Shipment = {
      ...(shipmentData as Omit<Shipment, 'id' | 'createdAt' | 'updatedAt' | 'documents' | 'fiscalAction'>),
      id: uuidv4(),
      documents: [],
      fiscalAction,
      createdAt: now,
      updatedAt: now,
    };
    
    setShipments(prev => [...prev, newShipment]);
    return newShipment;
  };
  
  const updateShipment = async (id: string, shipmentData: Partial<Shipment>) => {
    const updatedShipments = shipments.map(s => {
      if (s.id === id) {
        return { ...s, ...shipmentData, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    
    setShipments(updatedShipments);
    const updatedShipment = updatedShipments.find(s => s.id === id);
    
    if (!updatedShipment) {
      throw new Error("Shipment not found");
    }
    
    return updatedShipment;
  };
  
  const deleteShipment = async (id: string) => {
    setShipments(prev => prev.filter(s => s.id !== id));
  };
  
  const getShipmentById = (id: string) => {
    return shipments.find(s => s.id === id);
  };
  
  const updateStatus = async (shipmentId: string, status: ShipmentStatus) => {
    const now = new Date().toISOString();
    const updatedShipments = shipments.map(s => {
      if (s.id === shipmentId) {
        return { 
          ...s, 
          status,
          updatedAt: now
        };
      }
      return s;
    });
    
    setShipments(updatedShipments);
    return updatedShipments.find(s => s.id === shipmentId);
  };
  
  return {
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentById,
    updateStatus
  };
};
