import { useState, useEffect } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useClients } from '@/contexts/ClientsContext';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useCities } from '@/contexts/CitiesContext';
import { usePriceTables } from '@/contexts/PriceTablesContext';
import { CalendarIcon, Download, FileText, Plus, Search, MapPin, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Delivery } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const DeliveryForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { clients } = useClients();
  const { cities } = useCities();
  const { calculateFreight, isDoorToDoorDelivery, isExclusiveDelivery, checkMinuteNumberExists } = useDeliveries();
  const { calculateInsurance } = usePriceTables();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>>({
    clientId: '',
    deliveryDate: format(new Date(), 'yyyy-MM-dd'),
    deliveryTime: format(new Date(), 'HH:mm'),
    receiver: '',
    weight: 0,
    deliveryType: 'standard',
    cargoType: 'standard',
    cargoValue: 0,
    notes: '',
    minuteNumber: '',
    totalFreight: 0,
    customPricing: false,
    discount: 0,
  });
  const [estimatedFreight, setEstimatedFreight] = useState<number | null>(null);
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const [invoiceValue, setInvoiceValue] = useState<number>(0);
  const [insuranceAmount, setInsuranceAmount] = useState<number>(0);
  const [minuteNumberExists, setMinuteNumberExists] = useState(false);
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);
  
  const isCurrentTypeDoorToDoor = isDoorToDoorDelivery(formData.deliveryType);
  const isCurrentTypeExclusive = isExclusiveDelivery(formData.deliveryType);
  const isReshipment = formData.deliveryType === 'reshipment';

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setFormData(prevData => ({
        ...prevData,
        deliveryDate: format(date, 'yyyy-MM-dd'),
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'minuteNumber' && formData.clientId) {
      const exists = checkMinuteNumberExists(value, formData.clientId);
      setMinuteNumberExists(exists);
    }
    
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'weight' || name === 'cargoValue' || name === 'totalFreight' || name === 'discount'
        ? parseFloat(value) || 0 
        : value,
    }));
    
    if (
      formData.clientId && 
      (name === 'weight' || name === 'cargoValue') &&
      !useCustomPrice
    ) {
      updateEstimatedFreight(
        formData.clientId,
        name === 'weight' ? parseFloat(value) || 0 : formData.weight,
        formData.deliveryType,
        formData.cargoType,
        name === 'cargoValue' ? parseFloat(value) || 0 : formData.cargoValue,
        undefined,
        formData.cityId
      );
    }
  };

  const handleClientChange = (clientId: string) => {
    setFormData(prevData => ({ ...prevData, clientId }));
    
    if (formData.minuteNumber) {
      const exists = checkMinuteNumberExists(formData.minuteNumber, clientId);
      setMinuteNumberExists(exists);
    }
    
    if (clientId && formData.weight > 0 && !useCustomPrice) {
      updateEstimatedFreight(
        clientId,
        formData.weight,
        formData.deliveryType,
        formData.cargoType,
        formData.cargoValue,
        undefined,
        formData.cityId
      );
    }
  };

  const handleDeliveryTypeChange = (deliveryType: Delivery['deliveryType']) => {
    setFormData(prevData => ({ ...prevData, deliveryType }));
    
    if (!isDoorToDoorDelivery(deliveryType) || isExclusiveDelivery(deliveryType)) {
      setFormData(prevData => ({ ...prevData, cityId: undefined }));
    }
    
    if (formData.clientId && formData.weight > 0 && !useCustomPrice) {
      updateEstimatedFreight(
        formData.clientId,
        formData.weight,
        deliveryType,
        formData.cargoType,
        formData.cargoValue,
        undefined,
        isDoorToDoorDelivery(deliveryType) && !isExclusiveDelivery(deliveryType) ? formData.cityId : undefined
      );
    }
    
    if (deliveryType === 'reshipment') {
      calculateReshipmentInsurance();
    } else {
      setInsuranceAmount(0);
      setInvoiceValue(0);
    }
  };
  
  const calculateReshipmentInsurance = () => {
    if (isReshipment && formData.clientId && invoiceValue > 0) {
      const client = clients.find(c => c.id === formData.clientId);
      if (client) {
        const calculatedInsurance = calculateInsurance(
          client.priceTableId,
          invoiceValue,
          true,
          formData.cargoType
        );
        setInsuranceAmount(calculatedInsurance);
      }
    }
  };
  
  useEffect(() => {
    calculateReshipmentInsurance();
  }, [invoiceValue, formData.clientId, formData.cargoType, isReshipment]);

  const handleCargoTypeChange = (cargoType: Delivery['cargoType']) => {
    setFormData(prevData => ({ ...prevData, cargoType }));
    
    if (formData.clientId && formData.weight > 0 && !useCustomPrice) {
      updateEstimatedFreight(
        formData.clientId,
        formData.weight,
        formData.deliveryType,
        cargoType,
        formData.cargoValue,
        undefined,
        formData.cityId
      );
    }
    
    if (isReshipment) {
      calculateReshipmentInsurance();
    }
  };

  const handleCityChange = (cityId: string) => {
    setFormData(prevData => ({ ...prevData, cityId }));
    
    if (formData.clientId && formData.weight > 0 && !useCustomPrice) {
      updateEstimatedFreight(
        formData.clientId,
        formData.weight,
        formData.deliveryType,
        formData.cargoType,
        formData.cargoValue,
        undefined,
        cityId
      );
    }
  };
  
  const handleInvoiceValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setInvoiceValue(value);
  };

  const updateEstimatedFreight = (
    clientId: string,
    weight: number,
    deliveryType: Delivery['deliveryType'],
    cargoType: Delivery['cargoType'],
    cargoValue: number,
    _distance?: number,
    cityId?: string
  ) => {
    const freight = calculateFreight(
      clientId,
      weight,
      deliveryType,
      cargoType,
      cargoValue,
      _distance,
      cityId
    );
    
    setEstimatedFreight(freight);
    setFormData(prevData => ({ ...prevData, totalFreight: freight }));
  };

  const handleCustomPricingToggle = () => {
    setUseCustomPrice(!useCustomPrice);
    setFormData(prevData => ({
      ...prevData,
      customPricing: !useCustomPrice,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (minuteNumberExists && !showDuplicateConfirm) {
      setShowDuplicateConfirm(true);
      return;
    }
    
    let finalFreight = useCustomPrice ? formData.totalFreight : (estimatedFreight || 0);
    
    if (isReshipment && !useCustomPrice) {
      finalFreight += insuranceAmount;
    }
    
    onSubmit({
      ...formData,
      totalFreight: finalFreight,
      cargoValue: isReshipment ? invoiceValue : formData.cargoValue
    });
  };

  const handleConfirmDuplicate = () => {
    let finalFreight = useCustomPrice ? formData.totalFreight : (estimatedFreight || 0);
    
    if (isReshipment && !useCustomPrice) {
      finalFreight += insuranceAmount;
    }
    
    onSubmit({
      ...formData,
      totalFreight: finalFreight,
      cargoValue: isReshipment ? invoiceValue : formData.cargoValue
    });
    
    setShowDuplicateConfirm(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="minuteNumber">Número da Minuta</Label>
            <Input
              id="minuteNumber"
              name="minuteNumber"
              value={formData.minuteNumber}
              onChange={handleChange}
              required
              className="mt-1"
            />
            {minuteNumberExists && !showDuplicateConfirm && (
              <p className="text-sm text-red-500 mt-1">
                Esta minuta já foi registrada para este cliente
              </p>
            )}
          </div>

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
                    className="p-3 pointer-events-auto"
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
                <SelectItem value="standard">Normal</SelectItem>
                <SelectItem value="emergency">Emergencial</SelectItem>
                <SelectItem value="saturday">Sábados até 12:00hs</SelectItem>
                <SelectItem value="exclusive">Exclusivo em Fortaleza</SelectItem>
                <SelectItem value="difficultAccess">Difícil Acesso</SelectItem>
                <SelectItem value="metropolitanRegion">Região Metropolitana</SelectItem>
                <SelectItem value="sundayHoliday">Capital Domingos e Feriados</SelectItem>
                <SelectItem value="normalBiological">Material Biológico Normal</SelectItem>
                <SelectItem value="infectiousBiological">Material Biológico Infeccioso</SelectItem>
                <SelectItem value="tracked">Rastreado</SelectItem>
                <SelectItem value="doorToDoorInterior">Porta a Porta Interior</SelectItem>
                <SelectItem value="reshipment">Redespacho por Transportadora</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div>
              <Label htmlFor="cityId">Cidade</Label>
              <Select 
                value={formData.cityId} 
                onValueChange={handleCityChange}
                required={isCurrentTypeDoorToDoor && !isCurrentTypeExclusive}
                disabled={!isCurrentTypeDoorToDoor || isCurrentTypeExclusive}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={isCurrentTypeDoorToDoor && !isCurrentTypeExclusive ? "Selecione a cidade" : "Não aplicável para este tipo"} />
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

          {isReshipment ? (
            <div className="bg-muted p-4 rounded-md mb-4">
              <Label htmlFor="invoiceValue">Valor da Nota Fiscal (Redespacho)</Label>
              <Input
                id="invoiceValue"
                type="number"
                step="0.01"
                value={invoiceValue || ''}
                onChange={handleInvoiceValueChange}
                required
                className="mt-1"
              />
              {invoiceValue > 0 && (
                <div className="mt-2 text-sm">
                  <p>Seguro obrigatório (1%): {formatCurrency(insuranceAmount)}</p>
                </div>
              )}
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>
                  Para redespacho, é obrigatório informar o valor da nota fiscal para cálculo do seguro de 1%.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
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
          )}

          <div className="bg-muted p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Valor do Frete:</div>
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleCustomPricingToggle}
                >
                  {useCustomPrice ? "Usar Cálculo Automático" : "Definir Preço Manualmente"}
                </Button>
              </div>
            </div>
            
            {useCustomPrice ? (
              <div className="space-y-2">
                <Label htmlFor="totalFreight">Valor Total</Label>
                <Input
                  id="totalFreight"
                  name="totalFreight"
                  type="number"
                  step="0.01"
                  value={formData.totalFreight || ''}
                  onChange={handleChange}
                  required
                  className="text-lg font-bold"
                />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {estimatedFreight !== null ? formatCurrency(estimatedFreight + (isReshipment ? insuranceAmount : 0)) : "R$ 0,00"}
                </div>
                {isReshipment && insuranceAmount > 0 && (
                  <div className="text-sm mt-1">
                    Inclui seguro de {formatCurrency(insuranceAmount)}
                  </div>
                )}
                <div className="mt-2">
                  <Label htmlFor="discount">Desconto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      step="0.01"
                      value={formData.discount || ''}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="Valor de desconto"
                    />
                    {formData.discount > 0 && estimatedFreight !== null && (
                      <div className="mt-1 text-muted-foreground">
                        Total com desconto: {formatCurrency((estimatedFreight + (isReshipment ? insuranceAmount : 0)) - formData.discount)}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      </ScrollArea>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Registrar Entrega
        </Button>
      </DialogFooter>
      
      <AlertDialog open={showDuplicateConfirm} onOpenChange={setShowDuplicateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Minuta duplicada</AlertDialogTitle>
            <AlertDialogDescription>
              Minuta já incluída em outro serviço. Tem certeza que deseja incluir minuta com o mesmo número?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDuplicateConfirm(false)}>Não</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDuplicate}>Sim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
};

const DeliveryDetails = ({ 
  delivery, 
  onClose,
  onDelete,
  canDelete
}: { 
  delivery: Delivery, 
  onClose: () => void,
  onDelete?: (id: string) => void,
  canDelete?: boolean
}) => {
  const { clients } = useClients();
  const { cities } = useCities();
  const client = clients.find(c => c.id === delivery.clientId);
  const city = delivery.cityId ? cities.find(c => c.id === delivery.cityId) : null;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const getDeliveryTypeName = (type: Delivery['deliveryType']) => {
    const types: Record<Delivery['deliveryType'], string> = {
      'standard': 'Normal',
      'emergency': 'Emergencial',
      'saturday': 'Sábados',
      'exclusive': 'Exclusivo',
      'difficultAccess': 'Difícil Acesso',
      'metropolitanRegion': 'Região Metropolitana',
      'sundayHoliday': 'Domingos/Feriados',
      'normalBiological': 'Biológico Normal',
      'infectiousBiological': 'Biológico Infeccioso',
      'tracked': 'Rastreado',
      'doorToDoorInterior': 'Porta a Porta',
      'reshipment': 'Redespacho',
    };
    return types[type] || type;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Minuta: {delivery.minuteNumber}</h2>
          <p className="text-muted-foreground">
            Registrado em: {new Date(delivery.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
        {canDelete && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">Excluir</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir entrega</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta entrega? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  onDelete(delivery.id);
                  onClose();
                }}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Informações da Entrega</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{client?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium">{new Date(delivery.deliveryDate).toLocaleDateString('pt-BR')} às {delivery.deliveryTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recebedor</p>
                <p className="font-medium">{delivery.receiver}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Entrega</p>
                <p className="font-medium">{getDeliveryTypeName(delivery.deliveryType)}</p>
              </div>
              {delivery.cityId && city && (
                <div>
                  <p className="text-sm text-muted-foreground">Cidade</p>
                  <p className="font-medium">{city.name} ({city.distance} km)</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Carga</p>
                <p className="font-medium">{delivery.cargoType === 'perishable' ? 'Perecível' : 'Padrão'}</p>
              </div>
            </div>
          </div>
          
          {delivery.notes && (
            <div>
              <h3 className="text-lg font-medium">Observações</h3>
              <p className="mt-1 text-sm">{delivery.notes}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Valores</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Peso</p>
                <p className="font-medium">{delivery.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor da Carga</p>
                <p className="font-medium">{formatCurrency(delivery.cargoValue)}</p>
              </div>
              {delivery.discount > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Desconto</p>
                  <p className="font-medium">{formatCurrency(delivery.discount)}</p>
                </div>
              )}
              {delivery.customPricing && (
                <div>
                  <p className="text-sm text-muted-foreground">Preço personalizado</p>
                  <p className="font-medium">Sim</p>
                </div>
              )}
              <div className="col-span-2 bg-primary/10 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Valor Total do Frete</p>
                <p className="text-xl font-bold">{formatCurrency(delivery.totalFreight)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Button onClick={onClose} className="w-full">Fechar</Button>
      </div>
    </div>
  );
};

const DeliveriesPage = () => {
  const { deliveries, loading, addDelivery, deleteDelivery } = useDeliveries();
  const { clients } = useClients();
  const { cities } = useCities();
  const { priceTables } = usePriceTables();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientFilter, setClientFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const itemsPerPage = 10;
  
  const canDeleteDeliveries = user?.role === 'admin' || (user?.permissions && user.permissions.financial);

  const handleCreate = (data: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => {
    addDelivery(data);
    setIsCreateDialogOpen(false);
  };
  
  const handleDelete = (id: string) => {
    deleteDelivery(id);
  };

  const filteredDeliveries = deliveries
    .filter((delivery) => {
      if (clientFilter && clientFilter !== 'all' && delivery.clientId !== clientFilter) {
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
      <div className="flex flex-col gap-6 h-full">
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
            <DialogContent className="max-w-3xl">
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
            <ScrollArea className="h-[calc(100vh-260px)]">
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDeliveries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          Nenhuma entrega encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedDeliveries.map((delivery) => {
                        const client =
