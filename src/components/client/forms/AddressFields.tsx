
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchAddressFromCep } from '@/utils/cepUtils';
import { toast } from '@/components/ui/use-toast';

interface AddressFieldsProps {
  street: string;
  setStreet: (value: string) => void;
  number: string;
  setNumber: (value: string) => void;
  complement: string;
  setComplement: (value: string) => void;
  neighborhood: string;
  setNeighborhood: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  zipCode: string;
  setZipCode: (value: string) => void;
}

export function AddressFields({
  street,
  setStreet,
  number,
  setNumber,
  complement,
  setComplement,
  neighborhood,
  setNeighborhood,
  city,
  setCity,
  state,
  setState,
  zipCode,
  setZipCode,
}: AddressFieldsProps) {
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
          setStreet(addressData.logradouro || '');
          setNeighborhood(addressData.bairro || '');
          setCity(addressData.localidade || '');
          setState(addressData.uf || '');
          
          // If there's a complement from the API, use it
          if (addressData.complemento) {
            setComplement(addressData.complemento);
          }
          
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="street">Rua/Avenida</Label>
          <Input 
            id="street" 
            value={street} 
            onChange={(e) => setStreet(e.target.value)} 
            placeholder="Rua ou avenida"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input 
            id="number" 
            value={number} 
            onChange={(e) => setNumber(e.target.value)} 
            placeholder="Número"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input 
            id="complement" 
            value={complement} 
            onChange={(e) => setComplement(e.target.value)} 
            placeholder="Complemento"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input 
            id="neighborhood" 
            value={neighborhood} 
            onChange={(e) => setNeighborhood(e.target.value)} 
            placeholder="Bairro"
          />
        </div>
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
    </>
  );
}
