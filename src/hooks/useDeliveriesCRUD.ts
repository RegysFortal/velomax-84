
import { useState, useCallback } from 'react';
import { Delivery } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { useClients } from '@/contexts/ClientsContext';
import { generateMinuteNumber } from '@/utils/deliveryUtils';

export const useDeliveriesCRUD = (
  deliveries: Delivery[],
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>
) => {
  const { toast } = useToast();
  const { addLog } = useActivityLog();
  const { clients } = useClients();

  const addDelivery = useCallback((delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    
    // Generate a sequential minute number based on the current date if not provided
    let minuteNumber = delivery.minuteNumber;
    if (!minuteNumber) {
      minuteNumber = generateMinuteNumber(deliveries);
    }
    
    const newDelivery: Delivery = {
      ...delivery,
      minuteNumber,
      id: `delivery-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    setDeliveries(prev => [...prev, newDelivery]);
    
    const client = clients.find(c => c.id === delivery.clientId);
    const clientName = client ? (client.tradingName || client.name) : 'Cliente desconhecido';
    
    toast({
      title: "Entrega registrada",
      description: `A entrega ${minuteNumber} foi registrada com sucesso.`,
    });
    
    return newDelivery;
  }, [deliveries, setDeliveries, clients, toast]);
  
  const updateDelivery = useCallback((id: string, delivery: Partial<Delivery>) => {
    setDeliveries(prev => 
      prev.map(d => 
        d.id === id 
          ? { ...d, ...delivery, updatedAt: new Date().toISOString() } 
          : d
      )
    );
    
    toast({
      title: "Entrega atualizada",
      description: `A entrega foi atualizada com sucesso.`,
    });
  }, [setDeliveries, toast]);
  
  const deleteDelivery = useCallback((id: string) => {
    setDeliveries(prev => prev.filter(delivery => delivery.id !== id));
    
    toast({
      title: "Entrega removida",
      description: `A entrega foi removida com sucesso.`,
    });
  }, [setDeliveries, toast]);
  
  const getDelivery = useCallback((id: string) => {
    return deliveries.find(delivery => delivery.id === id);
  }, [deliveries]);
  
  return {
    addDelivery,
    updateDelivery,
    deleteDelivery,
    getDelivery
  };
};
