
import { supabase } from '@/integrations/supabase/client';
import { PriceTable } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const usePriceTableDatabase = () => {
  const { toast } = useToast();

  const savePriceTableToDb = async (supabasePriceTable: any) => {
    const { data, error } = await supabase
      .from('price_tables')
      .insert(supabasePriceTable)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  const updatePriceTableInDb = async (id: string, supabasePriceTable: any) => {
    const { data, error } = await supabase
      .from('price_tables')
      .update(supabasePriceTable)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return data && data.length > 0 ? data[0] : null;
  };

  const deletePriceTableFromDb = async (id: string) => {
    const { error } = await supabase
      .from('price_tables')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  };

  return {
    savePriceTableToDb,
    updatePriceTableInDb,
    deletePriceTableFromDb,
  };
};
