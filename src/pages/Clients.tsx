
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { useClients } from '@/contexts/ClientsContext';
import { usePriceTables } from '@/contexts/PriceTablesContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Building2, Edit, Mail, MapPin, Phone, Plus, Search, Trash2, User } from 'lucide-react';
import { Client } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const ClientForm = ({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Client;
  onSubmit: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) => {
  const { priceTables } = usePriceTables();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>({
    name: initialData?.name || '',
    street: initialData?.street || '',
    number: initialData?.number || '',
    complement: initialData?.complement || '',
    neighborhood: initialData?.neighborhood || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    contact: initialData?.contact || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    priceTableId: initialData?.priceTableId || '',
  });
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const searchCEP = async () => {
    if (!formData.zipCode || formData.zipCode.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "O CEP deve ter 8 dígitos",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${formData.zipCode}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP informado",
          variant: "destructive",
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        street: data.logradouro || prev.street,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));
      
      toast({
        title: "Endereço encontrado",
        description: "Os dados do endereço foram preenchidos automaticamente",
      });
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description: "Não foi possível consultar o CEP",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCep(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ScrollArea className="h-[60vh] pr-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="general">Dados Gerais</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Cliente</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="contact">Pessoa de Contato</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="priceTableId">Tabela de Preços</Label>
              <Select 
                value={formData.priceTableId} 
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priceTableId: value }))}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione uma tabela" />
                </SelectTrigger>
                <SelectContent>
                  {priceTables.map((table) => (
                    <SelectItem key={table.id} value={table.id}>
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="address" className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="zipCode">CEP</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Somente números"
                    maxLength={8}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={searchCEP}
                    disabled={isLoadingCep || !formData.zipCode}
                  >
                    {isLoadingCep ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="street">Logradouro</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  name="complement"
                  value={formData.complement || ''}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="state">Estado</Label>
              <Select 
                value={formData.state} 
                onValueChange={(value) => setFormData((prev) => ({ ...prev, state: value }))}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AC">Acre</SelectItem>
                  <SelectItem value="AL">Alagoas</SelectItem>
                  <SelectItem value="AP">Amapá</SelectItem>
                  <SelectItem value="AM">Amazonas</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                  <SelectItem value="CE">Ceará</SelectItem>
                  <SelectItem value="DF">Distrito Federal</SelectItem>
                  <SelectItem value="ES">Espírito Santo</SelectItem>
                  <SelectItem value="GO">Goiás</SelectItem>
                  <SelectItem value="MA">Maranhão</SelectItem>
                  <SelectItem value="MT">Mato Grosso</SelectItem>
                  <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="PA">Pará</SelectItem>
                  <SelectItem value="PB">Paraíba</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="PE">Pernambuco</SelectItem>
                  <SelectItem value="PI">Piauí</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="RO">Rondônia</SelectItem>
                  <SelectItem value="RR">Roraima</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="SE">Sergipe</SelectItem>
                  <SelectItem value="TO">Tocantins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Atualizar Cliente' : 'Adicionar Cliente'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const ClientCard = ({ client, canEdit }: { client: Client, canEdit: boolean }) => {
  const { updateClient, deleteClient } = useClients();
  const { priceTables } = usePriceTables();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUpdate = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    updateClient(client.id, data);
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    deleteClient(client.id);
  };

  const priceTable = priceTables.find(table => table.id === client.priceTableId);
  const fullAddress = [
    client.street,
    client.number && `nº ${client.number}`,
    client.complement,
    client.neighborhood && `${client.neighborhood}`,
    client.city && client.state && `${client.city} - ${client.state}`,
    client.zipCode && `CEP: ${client.zipCode}`
  ].filter(Boolean).join(', ');

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{client.name}</CardTitle>
          {canEdit && (
            <div className="flex space-x-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Cliente</DialogTitle>
                    <DialogDescription>
                      Atualize as informações do cliente. Clique em salvar quando terminar.
                    </DialogDescription>
                  </DialogHeader>
                  <ClientForm
                    initialData={client}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. O cliente será permanentemente removido.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{fullAddress}</span>
        </div>
        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{client.contact}</span>
        </div>
        <div className="flex items-center text-sm">
          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{client.phone}</span>
        </div>
        <div className="flex items-center text-sm">
          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{client.email}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Tabela de Preços:</span>
          <span className="text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded-md">
            {priceTable?.name || 'N/A'}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to={`/clients/${client.id}`}>Ver Detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const Clients = () => {
  const { clients, loading, addClient } = useClients();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  const handleCreate = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    addClient(data);
    setIsCreateDialogOpen(false);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground">
              Gerenciamento de clientes e suas tabelas de preço.
            </p>
          </div>
          {canEdit && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do cliente. Clique em adicionar quando terminar.
                  </DialogDescription>
                </DialogHeader>
                <ClientForm
                  onSubmit={handleCreate}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-10 w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-4">
              {filteredClients.map((client) => (
                <ClientCard 
                  key={client.id} 
                  client={client} 
                  canEdit={canEdit} 
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {filteredClients.length === 0 && !loading && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Clients;
