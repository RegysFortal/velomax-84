
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useClients } from '@/contexts/ClientsContext';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useCities } from '@/contexts/CitiesContext';
import { CalendarIcon, Download, FileText, Plus, Search, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Delivery, doorToDoorDeliveryTypes } from '@/types';

const DeliveryForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt' | 'totalFreight'>) => void;
  onCancel: () => void;
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { clients } = useClients();
  const { cities } = useCities();
  const { calculateFreight, isDoorToDoorDelivery } = useDeliveries();
  const [formData, setFormData] = useState<Omit<Delivery, 'id' | 'createdAt' | 'updatedAt' | 'totalFreight'>>({
    clientId: '',
    deliveryDate: format(new Date(), 'yyyy-MM-dd'),
    deliveryTime: format(new Date(), 'HH:mm'),
    receiver: '',
    weight: 0,
    distance: 0,
    deliveryType: 'standard',
    cargoType: 'standard',
    cargoValue: 0,
    notes: '',
    minuteNumber: '',
  });
  const [estimatedFreight, setEstimatedFreight] = useState<number | null>(null);
  
  const isCurrentTypeDoorToDoor = isDoorToDoorDelivery(formData.deliveryType);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setFormData(prev => ({
        ...prev,
        deliveryDate: format(date, 'yyyy-MM-dd'),
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight' || name === 'distance' || name === 'cargoValue' 
        ? parseFloat(value) || 0 
        : value,
    }));
    
    if (
      formData.clientId && 
      (name === 'weight' || name === 'cargoValue' || name === 'distance')
    ) {
      updateEstimatedFreight(
        formData.clientId,
        name === 'weight' ? parseFloat(value) || 0 : formData.weight,
        formData.deliveryType,
        formData.cargoType,
        name === 'cargoValue' ? parseFloat(value) || 0 : formData.cargoValue,
        name === 'distance' ? parseFloat(value) || 0 : formData.distance,
        formData.cityId
      );
    }
  };

  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({ ...prev, clientId }));
    
    if (clientId && formData.weight > 0) {
      updateEstimatedFreight(
        clientId,
        formData.weight,
        formData.deliveryType,
        formData.cargoType,
        formData.cargoValue,
        formData.distance,
        formData.cityId
      );
    }
  };

  const handleDeliveryTypeChange = (deliveryType: Delivery['deliveryType']) => {
    setFormData(prev => ({ ...prev, deliveryType }));
    
    if (!isDoorToDoorDelivery(deliveryType)) {
      setFormData(prev => ({ ...prev, cityId: undefined }));
    }
    
    if (formData.clientId && formData.weight > 0) {
      updateEstimatedFreight(
        formData.clientId,
        formData.weight,
        deliveryType,
        formData.cargoType,
        formData.cargoValue,
        formData.distance,
        isDoorToDoorDelivery(deliveryType) ? formData.cityId : undefined
      );
    }
  };

  const handleCargoTypeChange = (cargoType: Delivery['cargoType']) => {
    setFormData(prev => ({ ...prev, cargoType }));
    
    if (formData.clientId && formData.weight > 0) {
      updateEstimatedFreight(
        formData.clientId,
        formData.weight,
        formData.deliveryType,
        cargoType,
        formData.cargoValue,
        formData.distance,
        formData.cityId
      );
    }
  };

  const handleCityChange = (cityId: string) => {
    setFormData(prev => ({ ...prev, cityId }));
    
    const city = cities.find(c => c.id === cityId);
    if (city && formData.clientId && formData.weight > 0) {
      updateEstimatedFreight(
        formData.clientId,
        formData.weight,
        formData.deliveryType,
        formData.cargoType,
        formData.cargoValue,
        city.distance,
        cityId
      );
    }
  };

  const updateEstimatedFreight = (
    clientId: string,
    weight: number,
    deliveryType: Delivery['deliveryType'],
    cargoType: Delivery['cargoType'],
    cargoValue: number,
    distance?: number,
    cityId?: string
  ) => {
    const freight = calculateFreight(
      clientId,
      weight,
      deliveryType,
      cargoType,
      cargoValue,
      distance,
      cityId
    );
    setEstimatedFreight(freight);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="clientId">Cliente</Label>
        <Select 
          value={formData.clientId} 
          onValueChange={handleClientChange}
          required
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data de Entrega</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "P", { locale: ptBR }) : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="deliveryTime">Hora de Entrega</Label>
          <Input
            id="deliveryTime"
            name="deliveryTime"
            type="time"
            value={formData.deliveryTime}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="receiver">Recebedor</Label>
        <Input
          id="receiver"
          name="receiver"
          value={formData.receiver}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="weight">Peso (Kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            step="0.01"
            value={formData.weight || ''}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        
        {isCurrentTypeDoorToDoor ? (
          <div>
            <Label htmlFor="cityId">Cidade</Label>
            <Select 
              value={formData.cityId} 
              onValueChange={handleCityChange}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name} ({city.distance} Km)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div>
            <Label htmlFor="distance">Distância (Km)</Label>
            <Input
              id="distance"
              name="distance"
              type="number"
              step="0.1"
              value={formData.distance || ''}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        )}
        
        <div>
          <Label htmlFor="cargoValue">Valor da Carga</Label>
          <Input
            id="cargoValue"
            name="cargoValue"
            type="number"
            step="0.01"
            value={formData.cargoValue || ''}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="deliveryType">Tipo de Entrega</Label>
          <Select 
            value={formData.deliveryType} 
            onValueChange={(value) => handleDeliveryTypeChange(value as Delivery['deliveryType'])}
            required
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione o tipo de entrega" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Região Metropolitana</SelectItem>
              <SelectItem value="saturday">Coleta aos Sábados</SelectItem>
              <SelectItem value="emergency">Coleta Emergencial</SelectItem>
              <SelectItem value="exclusive">Veículo Exclusivo (Porta a Porta)</SelectItem>
              <SelectItem value="scheduled">Agendado/Difícil Acesso (Porta a Porta)</SelectItem>
              <SelectItem value="normalBiological">Material Biológico Normal</SelectItem>
              <SelectItem value="infectiousBiological">Material Biológico Infeccioso</SelectItem>
              <SelectItem value="sundayHoliday">Domingos e Feriados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="cargoType">Tipo de Carga</Label>
          <Select 
            value={formData.cargoType} 
            onValueChange={(value) => handleCargoTypeChange(value as Delivery['cargoType'])}
            required
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione o tipo de carga" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Padrão</SelectItem>
              <SelectItem value="perishable">Perecível/Medicamentos/Frágil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {estimatedFreight !== null && (
        <div className="bg-muted p-4 rounded-md">
          <div className="text-sm text-muted-foreground">Frete estimado:</div>
          <div className="text-2xl font-bold">{formatCurrency(estimatedFreight)}</div>
        </div>
      )}

      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="mt-1"
          rows={3}
        />
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Registrar Entrega
        </Button>
      </DialogFooter>
    </form>
  );
};

const DeliveriesPage = () => {
  const { deliveries, loading, addDelivery } = useDeliveries();
  const { clients } = useClients();
  const { cities } = useCities();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientFilter, setClientFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleCreate = (data: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt' | 'totalFreight'>) => {
    addDelivery(data);
    setIsCreateDialogOpen(false);
  };

  const filteredDeliveries = deliveries
    .filter((delivery) => {
      if (clientFilter && delivery.clientId !== clientFilter) {
        return false;
      }
      
      const client = clients.find(c => c.id === delivery.clientId);
      const clientName = client ? client.name.toLowerCase() : '';
      
      return delivery.minuteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
             delivery.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
             clientName.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime());
  
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Entregas</h1>
            <p className="text-muted-foreground">
              Gerenciamento de entregas e fretes.
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Entrega
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nova Entrega</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes da entrega para calcular o frete.
                </DialogDescription>
              </DialogHeader>
              <DeliveryForm
                onSubmit={handleCreate}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar entregas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div className="w-full md:w-64">
            <Select 
              value={clientFilter} 
              onValueChange={(value) => {
                setClientFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os clientes</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Minuta</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="w-[120px]">Data</TableHead>
                    <TableHead>Recebedor</TableHead>
                    <TableHead className="text-right w-[100px]">Peso</TableHead>
                    <TableHead className="text-right w-[140px]">Frete Total</TableHead>
                    <TableHead className="w-[100px] text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDeliveries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Nenhuma entrega encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedDeliveries.map((delivery) => {
                      const client = clients.find(c => c.id === delivery.clientId);
                      
                      return (
                        <TableRow key={delivery.id}>
                          <TableCell className="font-medium">
                            {delivery.minuteNumber}
                          </TableCell>
                          <TableCell>{client?.name || 'N/A'}</TableCell>
                          <TableCell>
                            {new Date(delivery.deliveryDate).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>{delivery.receiver}</TableCell>
                          <TableCell className="text-right">
                            {delivery.weight.toFixed(2)} Kg
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(delivery.totalFreight)}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <Button asChild variant="ghost" size="icon">
                                <Link to={`/deliveries/${delivery.id}`}>
                                  <FileText className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            {filteredDeliveries.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredDeliveries.length)} de {filteredDeliveries.length} entregas
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <div className="text-sm">
                    Página {currentPage} de {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default DeliveriesPage;
