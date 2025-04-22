
import { useState } from 'react';
import { PriceTable } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PriceTableInput } from './types';

export const usePriceTableOperations = (
  priceTables: PriceTable[], 
  setPriceTables: React.Dispatch<React.SetStateAction<PriceTable[]>>
) => {
  const { toast } = useToast();
  
  const addPriceTable = async (
    priceTable: PriceTableInput,
    userId?: string
  ) => {
    try {
      const timestamp = new Date().toISOString();
      
      const supabasePriceTable: any = {
        name: priceTable.name,
        description: priceTable.description,
        minimum_rate: JSON.stringify(priceTable.minimumRate),
        excess_weight: JSON.stringify(priceTable.excessWeight),
        door_to_door: JSON.stringify(priceTable.doorToDoor),
        waiting_hour: JSON.stringify(priceTable.waitingHour),
        insurance: JSON.stringify({ 
          rate: priceTable.insurance.rate,
          standard: priceTable.insurance.standard
        }),
        metropolitan_cities: JSON.stringify(priceTable.metropolitanCities || []),
        allow_custom_pricing: priceTable.allowCustomPricing,
        default_discount: priceTable.defaultDiscount || 0,
        user_id: userId
      };
      
      const { data, error } = await supabase
        .from('price_tables')
        .insert(supabasePriceTable)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Parse the JSON data safely
      const minimumRate = typeof data.minimum_rate === 'string' 
        ? JSON.parse(data.minimum_rate) 
        : data.minimum_rate;
        
      const excessWeight = typeof data.excess_weight === 'string'
        ? JSON.parse(data.excess_weight)
        : data.excess_weight;
        
      const doorToDoor = typeof data.door_to_door === 'string'
        ? JSON.parse(data.door_to_door)
        : data.door_to_door;
        
      const waitingHour = typeof data.waiting_hour === 'string'
        ? JSON.parse(data.waiting_hour)
        : data.waiting_hour;
        
      const insurance = typeof data.insurance === 'string'
        ? JSON.parse(data.insurance)
        : data.insurance;
      
      // Using optional chaining and type assertion to safely handle the data
      const responseData = data as any;
      const metropolitanCities = responseData.metropolitan_cities 
        ? (typeof responseData.metropolitan_cities === 'string' 
            ? JSON.parse(responseData.metropolitan_cities) 
            : responseData.metropolitan_cities)
        : [];
      
      const newPriceTable: PriceTable = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        minimumRate,
        excessWeight,
        doorToDoor,
        waitingHour,
        insurance,
        metropolitanCities,
        allowCustomPricing: data.allow_custom_pricing,
        defaultDiscount: data.default_discount || 0,
        createdAt: data.created_at || timestamp,
        updatedAt: data.updated_at || timestamp,
      };
      
      setPriceTables((prev) => [...prev, newPriceTable]);
      
      toast({
        title: "Tabela de preços criada",
        description: `A tabela "${priceTable.name}" foi criada com sucesso.`,
      });
    } catch (error) {
      console.error("Error adding price table:", error);
      toast({
        title: "Erro ao criar tabela de preços",
        description: "Ocorreu um erro ao criar a tabela de preços. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const updatePriceTable = async (id: string, priceTable: Partial<PriceTable>) => {
    try {
      const timestamp = new Date().toISOString();
      
      const supabasePriceTable: any = {
        updated_at: timestamp
      };
      
      if (priceTable.name !== undefined) supabasePriceTable.name = priceTable.name;
      if (priceTable.description !== undefined) supabasePriceTable.description = priceTable.description;
      if (priceTable.minimumRate !== undefined) supabasePriceTable.minimum_rate = JSON.stringify(priceTable.minimumRate);
      if (priceTable.excessWeight !== undefined) supabasePriceTable.excess_weight = JSON.stringify(priceTable.excessWeight);
      if (priceTable.doorToDoor !== undefined) supabasePriceTable.door_to_door = JSON.stringify(priceTable.doorToDoor);
      if (priceTable.waitingHour !== undefined) supabasePriceTable.waiting_hour = JSON.stringify(priceTable.waitingHour);
      if (priceTable.insurance !== undefined) supabasePriceTable.insurance = JSON.stringify(priceTable.insurance);
      if (priceTable.allowCustomPricing !== undefined) supabasePriceTable.allow_custom_pricing = priceTable.allowCustomPricing;
      if (priceTable.defaultDiscount !== undefined) supabasePriceTable.default_discount = priceTable.defaultDiscount;
      if (priceTable.metropolitanCities !== undefined) supabasePriceTable.metropolitan_cities = JSON.stringify(priceTable.metropolitanCities);

      const { error } = await supabase
        .from('price_tables')
        .update(supabasePriceTable)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setPriceTables((prev) => 
        prev.map((table) => 
          table.id === id 
            ? { ...table, ...priceTable, updatedAt: timestamp } 
            : table
        )
      );
      
      toast({
        title: "Tabela de preços atualizada",
        description: `A tabela foi atualizada com sucesso.`,
      });
    } catch (error) {
      console.error("Error updating price table:", error);
      toast({
        title: "Erro ao atualizar tabela de preços",
        description: "Ocorreu um erro ao atualizar a tabela de preços. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const deletePriceTable = async (id: string) => {
    try {
      const { error } = await supabase
        .from('price_tables')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setPriceTables((prev) => prev.filter((table) => table.id !== id));
      
      toast({
        title: "Tabela de preços removida",
        description: `A tabela foi removida com sucesso.`,
      });
    } catch (error) {
      console.error("Error deleting price table:", error);
      toast({
        title: "Erro ao remover tabela de preços",
        description: "Ocorreu um erro ao remover a tabela de preços. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  return {
    addPriceTable,
    updatePriceTable,
    deletePriceTable,
  };
};
