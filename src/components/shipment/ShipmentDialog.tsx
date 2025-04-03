
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
  const [packages, setPackages] = useState("1");
  const [weight, setWeight] = useState("0");
  const [arrivalFlight, setArrivalFlight] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [status, setStatus] = useState<ShipmentStatus>("in_transit");
  const [observations, setObservations] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      // Reset form for a new shipment
      setCompanyId("");
      setCompanyName("");
      setTransportMode("air");
      setCarrierName("");
      setTrackingNumber("");
      setPackages("1");
      setWeight("0");
      setArrivalFlight("");
      setArrivalDate("");
      setStatus("in_transit");
      setObservations("");
      setDeliveryDate("");
      setDeliveryTime("");
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
      
      const packageCount = parseInt(packages);
      const weightValue = parseFloat(weight);
      
      if (isNaN(packageCount) || isNaN(weightValue) || packageCount < 1 || weightValue < 0) {
        toast.error("Volumes e peso devem ser valores numéricos válidos");
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
      
      await addShipment(shipmentData);
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Novo Embarque</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="companyName" className="text-sm font-medium">Empresa</label>
              <Select 
                value={companyId} 
                onValueChange={handleCompanySelect}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            
            <div className="space-y-2">
              <label htmlFor="packages" className="text-sm font-medium">Volumes</label>
              <Input 
                id="packages"
                type="number"
                min="1"
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
            
            {status === "retained" && (
              <div className="space-y-4 border p-4 rounded-md bg-red-50 md:col-span-2">
                <h3 className="font-medium">Detalhes da Retenção</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Este embarque está marcado como retido. Por favor, salve o embarque primeiro e depois adicione os detalhes da retenção fiscal.
                </p>
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
      </DialogContent>
    </Dialog>
  );
}
