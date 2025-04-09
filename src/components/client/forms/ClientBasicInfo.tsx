
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClientBasicInfoProps {
  name: string;
  setName: (value: string) => void;
  tradingName: string;
  setTradingName: (value: string) => void;
  document: string;
  setDocument: (value: string) => void;
}

export function ClientBasicInfo({
  name,
  setName,
  tradingName,
  setTradingName,
  document,
  setDocument,
}: ClientBasicInfoProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nome/Razão Social*</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Nome completo ou razão social"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tradingName">Nome Fantasia</Label>
        <Input 
          id="tradingName" 
          value={tradingName} 
          onChange={(e) => setTradingName(e.target.value)} 
          placeholder="Nome fantasia"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="document">CNPJ/CPF</Label>
        <Input 
          id="document" 
          value={document} 
          onChange={(e) => setDocument(e.target.value)} 
          placeholder="00.000.000/0000-00"
        />
      </div>
    </>
  );
}
