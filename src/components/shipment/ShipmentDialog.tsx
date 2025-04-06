import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShipments } from "@/contexts/ShipmentsContext";
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { format } from 'date-fns';
import { toast } from "sonner";
import { useClients } from "@/contexts/ClientsContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface ShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShipmentDialog({ open, onOpenChange }: ShipmentDialogProps) {
  const { addShipment, updateShipment } = useShipments();
  const { clients } = useClients();
  
  // Form state
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [transportMode, setTransportMode] = useState<"air" | "road">("air");
  const [carrierName, setCarrierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [packages, setPackages] = useState("");
  const [weight, setWeight] = useState("");
  const [arrivalFlight, setArrivalFlight] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [status, setStatus] = useState<ShipmentStatus>("in_transit");
  const [observations, setObservations] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  
  // Retention-specific fields
  const [retentionReason, setRetentionReason] = useState("");
  const [retentionAmount, setRetentionAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      // Reset form for a new shipment
      setCompanyId("");
      setCompanyName("");
      setTransportMode("air");
      setCarrierName("");
      setTrackingNumber("");
      setPackages("");
      setWeight("");
      setArrivalFlight("");
      setArrivalDate("");
      setStatus("in_transit");
      setObservations("");
      setDeliveryDate("");
      setDeliveryTime("");
      setRetentionReason("");
      setRetentionAmount("");
      setPaymentDate("");
    }
  }, [open]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!companyId.trim() || !companyName.trim() || !carrierName.trim() || !trackingNumber.trim()) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      
      const packageCount = parseInt(packages || "0");
      const weightValue = parseFloat(weight || "0");
      
      if (isNaN(packageCount) || isNaN(weightValue) || packageCount < 0 || weightValue < 0) {
        toast.error("Volumes e peso devem ser valores numéricos válidos");
        return;
      }
      
      // Validate retention-specific fields if status is "retained"
      if (status === "retained" && !retentionReason.trim()) {
        toast.error("Informe o motivo da retenção");
        return;
      }
      
      // Build shipment object with all required fields
      const shipmentData = {
        companyId: companyId.trim(),
        companyName: companyName.trim(),
        transportMode,
        carrierName: carrierName.trim(),
        trackingNumber: trackingNumber.trim(),
        packages: packageCount,
        weight: weightValue,
        arrivalFlight: arrivalFlight.trim() || undefined,
        arrivalDate: arrivalDate || undefined,
        observations: observations.trim() || undefined,
        status,
        isRetained: status === "retained",
        deliveryDate: deliveryDate || undefined,
        deliveryTime: deliveryTime || undefined,
      };
      
      // Add fiscal action if status is retained
      if (status === "retained") {
        // Create fiscal action data without ID, createdAt, updatedAt
        // These will be added by the addShipment function in the context
        const fiscalActionData = {
          reason: retentionReason.trim(),
          amountToPay: parseFloat(retentionAmount) || 0,
          paymentDate: paymentDate || undefined,
        };
        
        // Include fiscal action in shipment data
        await addShipment({
          ...shipmentData,
          // We're passing fiscalActionData, not a complete FiscalAction
          // The ShipmentContext.addShipment will handle creating the complete FiscalAction
          fiscalActionData,
        });
      } else {
        await addShipment(shipmentData);
      }
      
      toast.success("Embarque criado com sucesso");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao salvar embarque");
      console.error(error);
    }
  };
  
  const handleCompanySelect = (selectedId: string) => {
    const selectedClient = clients.find(client => client.id === selectedId);
    
    if (selectedClient) {
      setCompanyId(selectedClient.id);
      setCompanyName(selectedClient.name);
    }
  };

  const getCarrierOptions = () => {
    if (transportMode === "air") {
      return (
        <>
          <SelectItem value="GOL">GOL</SelectItem>
          <SelectItem value="LATAM">LATAM</SelectItem>
          <SelectItem value="AZUL">AZUL</SelectItem>
        </>
      );
    }
    return (
      <SelectItem value="custom">Outra transportadora</SelectItem>
    );
  };
  
  // Format client options for the searchable select
  const clientOptions = clients.map(client => ({
    value: client.id,
    label: client.tradingName,
    description: client.name
  }));
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>Novo Embarque</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(95vh-130px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="companyName" className="text-sm font-medium">Empresa</label>
                <SearchableSelect 
                  options={clientOptions}
                  value={companyId}
                  onValueChange={handleCompanySelect}
                  placeholder="Selecione uma empresa"
                  emptyMessage="Nenhuma empresa encontrada"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="transportMode" className="text-sm font-medium">Modal de Transporte</label>
                <Select 
                  value={transportMode} 
                  onValueChange={(val: "air" | "road") => {
                    setTransportMode(val);
                    setCarrierName(""); // Reset carrier when mode changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="air">Aéreo</SelectItem>
                    <SelectItem value="road">Rodoviário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="carrierName" className="text-sm font-medium">Transportadora</label>
                {transportMode === "air" ? (
                  <Select 
                    value={carrierName} 
                    onValueChange={(val) => setCarrierName(val)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a companhia aérea" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GOL">GOL</SelectItem>
                      <SelectItem value="LATAM">LATAM</SelectItem>
                      <SelectItem value="AZUL">AZUL</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    id="carrierName"
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    placeholder="Nome da transportadora"
                    required
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="trackingNumber" className="text-sm font-medium">Número do Conhecimento</label>
                <Input 
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ex: 123456789"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="packages" className="text-sm font-medium">Volumes</label>
                <Input 
                  id="packages"
                  type="number"
                  min="0"
                  value={packages}
                  onChange={(e) => setPackages(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="weight" className="text-sm font-medium">Peso (kg)</label>
                <Input 
                  id="weight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
              
              {transportMode === "air" && (
                <div className="space-y-2">
                  <label htmlFor="arrivalFlight" className="text-sm font-medium">Voo de Chegada</label>
                  <Input 
                    id="arrivalFlight"
                    value={arrivalFlight}
                    onChange={(e) => setArrivalFlight(e.target.value)}
                    placeholder="Ex: LA3456"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="arrivalDate" className="text-sm font-medium">Data de Chegada</label>
                <Input 
                  id="arrivalDate"
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="observations" className="text-sm font-medium">Observações</label>
                <Textarea 
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Observações sobre a carga (perecível, biológico, entrega dedicada, etc.)"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2 pt-4 border-t border-gray-200">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={(val: ShipmentStatus) => setStatus(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_transit">Em Trânsito</SelectItem>
                    <SelectItem value="retained">Retida</SelectItem>
                    <SelectItem value="delivered">Retirada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {status === "retained" && (
                <div className="space-y-4 border p-4 rounded-md bg-red-50 md:col-span-2">
                  <h3 className="font-medium">Detalhes da Retenção</h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="retentionReason" className="text-sm font-medium">Motivo da Retenção</label>
                    <Textarea 
                      id="retentionReason"
                      value={retentionReason}
                      onChange={(e) => setRetentionReason(e.target.value)}
                      placeholder="Descreva o motivo da retenção fiscal"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="retentionAmount" className="text-sm font-medium">Valor do Imposto</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">R$</span>
                      <Input 
                        id="retentionAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={retentionAmount}
                        onChange={(e) => setRetentionAmount(e.target.value)}
                        className="pl-8"
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="paymentDate" className="text-sm font-medium">Data de Pagamento</label>
                    <Input 
                      id="paymentDate"
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Criar
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
