
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="priceTableId">Tabela de Preços</Label>
        <Select value={priceTableId} onValueChange={setPriceTableId}>
          <SelectTrigger id="priceTableId">
            <SelectValue placeholder="Selecione uma tabela" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="table-a">Tabela A</SelectItem>
            <SelectItem value="table-b">Tabela B</SelectItem>
            <SelectItem value="table-c">Tabela C</SelectItem>
            <SelectItem value="table-d">Tabela D</SelectItem>
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
