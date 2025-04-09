
import { useState, useEffect } from 'react';
import { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useClients } from '@/contexts/ClientsContext';
import { ClientBasicInfo } from './forms/ClientBasicInfo';
import { AddressFields } from './forms/AddressFields';
import { ContactInfo } from './forms/ContactInfo';
import { PriceTableAndNotes } from './forms/PriceTableAndNotes';

interface ClientFormProps {
  client: Client | null;
  isCreating: boolean;
  onComplete: () => void;
}

export function ClientForm({ client, isCreating, onComplete }: ClientFormProps) {
  // Form state
  const [name, setName] = useState('');
  const [tradingName, setTradingName] = useState('');
  const [document, setDocument] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [priceTableId, setPriceTableId] = useState('');
  const [notes, setNotes] = useState('');

  const { addClient, updateClient } = useClients();

  // Load client data if editing
  useEffect(() => {
    if (client) {
      setName(client.name || '');
      setTradingName(client.tradingName || '');
      setDocument(client.document || '');
      setStreet(client.street || '');
      setNumber(client.number || '');
      setComplement(client.complement || '');
      setNeighborhood(client.neighborhood || '');
      setCity(client.city || '');
      setState(client.state || '');
      setZipCode(client.zipCode || '');
      setContact(client.contact || '');
      setPhone(client.phone || '');
      setEmail(client.email || '');
      setPriceTableId(client.priceTableId || '');
      setNotes(client.notes || '');
    } else {
      // Reset form for new client
      setName('');
      setTradingName('');
      setDocument('');
      setStreet('');
      setNumber('');
      setComplement('');
      setNeighborhood('');
      setCity('');
      setState('');
      setZipCode('');
      setContact('');
      setPhone('');
      setEmail('');
      setPriceTableId('');
      setNotes('');
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    try {
      const address = `${street}, ${number}${complement ? ', ' + complement : ''}, ${neighborhood}`;
      
      const clientData = {
        name,
        tradingName,
        document,
        address,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
        contact,
        phone,
        email,
        priceTableId,
        notes
      };

      if (isCreating) {
        addClient(clientData);
      } else if (client?.id) {
        updateClient(client.id, clientData);
      }
      
      onComplete();
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error("Ocorreu um erro ao salvar. Tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-[600px]">
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          <ClientBasicInfo
            name={name}
            setName={setName}
            tradingName={tradingName}
            setTradingName={setTradingName}
            document={document}
            setDocument={setDocument}
          />

          <AddressFields
            street={street}
            setStreet={setStreet}
            number={number}
            setNumber={setNumber}
            complement={complement}
            setComplement={setComplement}
            neighborhood={neighborhood}
            setNeighborhood={setNeighborhood}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />

          <ContactInfo
            contact={contact}
            setContact={setContact}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
          />

          <PriceTableAndNotes
            priceTableId={priceTableId}
            setPriceTableId={setPriceTableId}
            notes={notes}
            setNotes={setNotes}
          />
        </div>
      </ScrollArea>

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancelar
        </Button>
        <Button type="submit">
          {isCreating ? 'Criar' : 'Atualizar'}
        </Button>
      </div>
    </form>
  );
}

export default ClientForm;
