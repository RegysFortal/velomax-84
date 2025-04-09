
import { useState, useEffect } from 'react';
import { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useClients } from '@/contexts/ClientsContext';

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
                onChange={(e) => setZipCode(e.target.value)} 
                placeholder="00000-000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contato</Label>
              <Input 
                id="contact" 
                value={contact} 
                onChange={(e) => setContact(e.target.value)} 
                placeholder="Nome do contato"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="email@exemplo.com"
            />
          </div>

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
