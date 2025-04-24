
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePriceTables } from '@/contexts';

interface PriceTableAndNotesProps {
  priceTableId: string;
  setPriceTableId: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
}

export function PriceTableAndNotes({
  priceTableId,
  setPriceTableId,
  notes,
  setNotes,
}: PriceTableAndNotesProps) {
  // Initialize with default values
  const [availableTables, setAvailableTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Safely get price tables
  useEffect(() => {
    try {
      const { priceTables, loading } = usePriceTables();
      setAvailableTables(priceTables || []);
      setIsLoading(loading);
    } catch (error) {
      console.warn("PriceTablesProvider not available");
      setAvailableTables([]);
      setIsLoading(false);
    }
  }, []);
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="priceTableId">Tabela de Preços</Label>
        <Select value={priceTableId} onValueChange={setPriceTableId}>
          <SelectTrigger id="priceTableId">
            <SelectValue placeholder="Selecione uma tabela" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>Carregando tabelas...</SelectItem>
            ) : availableTables.length > 0 ? (
              availableTables.map((table) => (
                <SelectItem key={table.id} value={table.id}>
                  {table.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-tables" disabled>Nenhuma tabela disponível</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea 
          id="notes" 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
          placeholder="Observações sobre o cliente"
          className="min-h-[100px]"
        />
      </div>
    </>
  );
}
