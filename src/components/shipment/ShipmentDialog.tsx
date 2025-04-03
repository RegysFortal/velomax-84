
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
import { Checkbox } from "@/components/ui/checkbox";
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

interface ShipmentDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose: () => void;
  shipment?: Shipment;
}

export function ShipmentDialog({ open, onOpenChange, onClose, shipment }: ShipmentDialogProps) {
  const { addShipment, updateShipment } = useShipments();
  
  // Form state
  const [companyId, setCompanyId] = useState(shipment?.companyId || "");
  const [companyName, setCompanyName] = useState(shipment?.companyName || "");
  const [transportMode, setTransportMode] = useState<"air" | "road">(shipment?.transportMode || "air");
  const [carrierName, setCarrierName] = useState(shipment?.carrierName || "");
  const [trackingNumber, setTrackingNumber] = useState(shipment?.trackingNumber || "");
  const [packages, setPackages] = useState(shipment?.packages?.toString() || "1");
  const [weight, setWeight] = useState(shipment?.weight?.toString() || "0");
  const [arrivalFlight, setArrivalFlight] = useState(shipment?.arrivalFlight || "");
  const [arrivalDate, setArrivalDate] = useState(
    shipment?.arrivalDate
      ? format(new Date(shipment.arrivalDate), 'yyyy-MM-dd')
      : ""
  );
  const [status, setStatus] = useState<ShipmentStatus>(shipment?.status || "in_transit");
  const [isPriority, setIsPriority] = useState(shipment?.isPriority || false);
  const [observations, setObservations] = useState(shipment?.observations || "");
  const [deliveryDate, setDeliveryDate] = useState(
    shipment?.deliveryDate
      ? format(new Date(shipment.deliveryDate), 'yyyy-MM-dd')
      : ""
  );
  const [deliveryTime, setDeliveryTime] = useState(shipment?.deliveryTime || "");
  
  // Reset form when dialog opens/closes or shipment changes
  useEffect(() => {
    if (open && shipment) {
      setCompanyId(shipment.companyId || "");
      setCompanyName(shipment.companyName || "");
      setTransportMode(shipment.transportMode || "air");
      setCarrierName(shipment.carrierName || "");
      setTrackingNumber(shipment.trackingNumber || "");
      setPackages(shipment.packages?.toString() || "1");
      setWeight(shipment.weight?.toString() || "0");
      setArrivalFlight(shipment.arrivalFlight || "");
      setStatus(shipment.status || "in_transit");
      setIsPriority(shipment.isPriority || false);
      setObservations(shipment.observations || "");
      
      if (shipment.arrivalDate) {
        setArrivalDate(format(new Date(shipment.arrivalDate), 'yyyy-MM-dd'));
      } else {
        setArrivalDate("");
      }
      
      if (shipment.deliveryDate) {
        setDeliveryDate(format(new Date(shipment.deliveryDate), 'yyyy-MM-dd'));
      } else {
        setDeliveryDate("");
      }
      
      setDeliveryTime(shipment.deliveryTime || "");
    } else if (open) {
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
      setIsPriority(false);
      setObservations("");
      setDeliveryDate("");
      setDeliveryTime("");
    }
  }, [open, shipment]);
  
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
        isPriority,
        deliveryDate: deliveryDate || undefined,
        deliveryTime: deliveryTime || undefined,
      };
      
      if (shipment) {
        await updateShipment(shipment.id, shipmentData);
        toast.success("Embarque atualizado com sucesso");
      } else {
        await addShipment(shipmentData);
        toast.success("Embarque criado com sucesso");
      }
      
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar embarque");
      console.error(error);
    }
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
    if (!open) {
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {shipment ? "Editar Embarque" : "Novo Embarque"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="companyName" className="text-sm font-medium">Nome da Empresa</label>
              <Input 
                id="companyName"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (!companyId && e.target.value) {
                    // Simple ID generation if no ID is set yet
                    setCompanyId(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="Ex: Empresa XYZ"
                required
              />
              <Input 
                type="hidden"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="transportMode" className="text-sm font-medium">Modo de Transporte</label>
              <Select value={transportMode} onValueChange={(val: "air" | "road") => setTransportMode(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="air">Aéreo</SelectItem>
                  <SelectItem value="road">Rodoviário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="carrierName" className="text-sm font-medium">Transportadora</label>
              <Input 
                id="carrierName"
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                placeholder={transportMode === "air" ? "Ex: LATAM Cargo" : "Ex: Transportadora XYZ"}
                required
              />
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
                  <SelectItem value="cleared">Liberada</SelectItem>
                  <SelectItem value="standby">Standby</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
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
            
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isPriority" 
                  checked={isPriority}
                  onCheckedChange={(checked) => setIsPriority(checked === true)}
                />
                <label
                  htmlFor="isPriority"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Embarque Prioritário
                </label>
              </div>
            </div>
            
            {isPriority && (
              <>
                <div className="space-y-2">
                  <label htmlFor="deliveryDate" className="text-sm font-medium">Data de Entrega Programada</label>
                  <Input 
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="deliveryTime" className="text-sm font-medium">Hora de Entrega Programada</label>
                  <Input 
                    id="deliveryTime"
                    type="time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {shipment ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
