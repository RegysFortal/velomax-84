
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchAddressFromCep } from '@/utils/cepUtils';
import { toast } from '@/components/ui/use-toast';

interface AddressSectionProps {
  address: string;
  setAddress: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  zipCode: string;
  setZipCode: (value: string) => void;
}

export function AddressSection({
  address,
  setAddress,
  city,
  setCity,
  state,
  setState,
  zipCode,
  setZipCode
}: AddressSectionProps) {
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value;
    setZipCode(cep);
    
    // Only try to fetch if CEP length is 8 digits (without formatting)
    if (cep.replace(/\D/g, '').length === 8) {
      setIsLoadingCep(true);
      
      try {
        const addressData = await fetchAddressFromCep(cep);
        
        if (addressData) {
          setAddress(addressData.logradouro || '');
          setCity(addressData.localidade || '');
          setState(addressData.uf || '');
          
          toast({
            title: "CEP encontrado",
            description: "Endereço preenchido automaticamente",
          });
        }
      } catch (error) {
        console.error('Error fetching address from CEP:', error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Endereço Completo</Label>
        <Input 
          id="address" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          placeholder="Rua, número, complemento"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input 
            id="city" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            placeholder="Cidade"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input 
            id="state" 
            value={state} 
            onChange={(e) => setState(e.target.value)} 
            placeholder="Estado"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP</Label>
          <Input 
            id="zipCode" 
            value={zipCode} 
            onChange={handleCepChange} 
            placeholder="00000-000"
            className={isLoadingCep ? "bg-muted" : ""}
          />
        </div>
      </div>
    </div>
  );
}
